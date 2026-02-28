"""
Chat API Endpoint
Main endpoint for RAG-powered textbook chatbot
"""

import json
import time
from datetime import datetime, timedelta
from typing import Optional
from uuid import UUID, uuid4
import logging

import httpx

from fastapi import APIRouter, HTTPException, Request, Depends
from fastapi.responses import JSONResponse

from ...models.chat import ChatRequest, ChatResponse, OptimisticLockError
from ...models.message import Message, Citation
from ...agents.router import get_router_agent
from ...agents.retrieval import get_retrieval_agent
from ...agents.response import get_response_agent
from ...agents.citation import get_citation_agent
from ...db.postgres import get_postgres

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/chat", tags=["chat"])


# Dependency: Get user ID from session
def get_user_id(request: Request) -> tuple[Optional[str], bool]:
    """
    Extract user_id and authentication status from session

    Returns:
        (user_id, is_authenticated)
    """
    session_id = request.cookies.get("session_id")
    user_id = request.cookies.get("user_id")

    if user_id:
        return (user_id, True)
    elif session_id:
        return (session_id, False)
    else:
        # Anonymous session (should be created by middleware)
        return (None, False)


@router.post("", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    http_request: Request,
    user_info: tuple = Depends(get_user_id),
) -> ChatResponse:
    """
    Main chat endpoint with RAG pipeline

    Flow:
    1. Validate request and check optimistic locking
    2. Route request (Router Agent)
    3. Retrieve relevant chunks (Retrieval Agent)
    4. Generate response (Response Agent)
    5. Validate citations (Citation Agent)
    6. Save conversation and messages to database
    7. Return response with updated_at timestamp

    Args:
        request: Chat request
        http_request: FastAPI request object
        user_info: User ID and authentication status

    Returns:
        ChatResponse with answer and citations

    Raises:
        HTTPException 409: Optimistic lock conflict (conversation updated elsewhere)
        HTTPException 400: Invalid request
        HTTPException 500: Internal server error
    """
    start_time = time.time()
    user_id, is_authenticated = user_info

    logger.info(
        f"Chat request: user={user_id}, mode={request.mode}, book={request.book_id}"
    )

    try:
        # Step 1: Get or create conversation
        db = get_postgres()
        conversation_id = request.conversation_id

        if conversation_id:
            # Existing conversation: validate optimistic lock
            conversation = _get_conversation(db, conversation_id, user_id)

            if request.last_updated_at:
                # Check if conversation was updated elsewhere
                if conversation["updated_at"] != request.last_updated_at:
                    logger.warning(
                        f"Optimistic lock conflict: conversation {conversation_id}"
                    )
                    return JSONResponse(
                        status_code=409,
                        content=OptimisticLockError(
                            message="Conversation was updated in another tab/device. Refresh to see latest messages.",
                            latest_updated_at=conversation["updated_at"],
                        ).model_dump(),
                    )
        else:
            # New conversation: create it
            conversation = _create_conversation(
                db=db,
                user_id=user_id,
                is_authenticated=is_authenticated,
                book_id=request.book_id,
                mode=request.mode,
                tone=request.tone,
            )
            conversation_id = conversation["id"]

        # Step 2: Validate request
        router_agent = get_router_agent()
        is_valid, error = router_agent.validate_request(
            query=request.message,
            selected_text=request.selected_text,
        )

        if not is_valid:
            raise HTTPException(status_code=400, detail=error)

        # Step 3: Route request
        routing_decision = router_agent.route_request(
            query=request.message,
            mode=request.mode,
            selected_text=request.selected_text,
            book_id=request.book_id,
            chapter=str(request.chapter_id) if request.chapter_id else None,
        )

        logger.info(
            f"Routing: mode={routing_decision['mode']}, intent={routing_decision['intent']}"
        )

        # Step 4: Retrieve relevant chunks
        retrieval_agent = get_retrieval_agent()
        retrieval_result = retrieval_agent.retrieve(
            query=routing_decision["query"]["normalized"],
            mode=routing_decision["mode"],
            filters=routing_decision["filters"],
            context_window=1,  # Include surrounding chunks
        )

        if retrieval_result["status"] == "no_results":
            # No relevant content found
            refusal_text = _generate_refusal_message(
                query=request.message,
                mode=request.mode,
                refusal_reason=retrieval_result.get("refusal_reason"),
            )

            # Save user message and refusal
            _save_message(
                db=db,
                conversation_id=conversation_id,
                role="user",
                content=request.message,
                mode=request.mode,
                tone=request.tone,
                action=request.action,
            )

            assistant_message_id = _save_message(
                db=db,
                conversation_id=conversation_id,
                role="assistant",
                content=refusal_text,
                mode=request.mode,
                tone=request.tone,
                citations=[],
                confidence_score=0.0,
            )

            latency_ms = int((time.time() - start_time) * 1000)

            return ChatResponse(
                conversation_id=conversation_id,
                message=Message(
                    id=assistant_message_id,
                    conversation_id=conversation_id,
                    role="assistant",
                    content=refusal_text,
                    mode=request.mode,
                    tone=request.tone,
                    citations=[],
                    confidence_score=0.0,
                    metadata={"latency_ms": latency_ms},
                ),
                should_create_new_conversation=not bool(request.conversation_id),
            )

        # Step 5: Generate response
        response_agent = get_response_agent()
        response_result = response_agent.generate_response(
            query=request.message,
            chunks=retrieval_result["chunks"],
            mode=request.mode,
            tone=request.tone,
            intent=routing_decision.get("intent"),
        )

        if response_result["status"] == "error":
            raise HTTPException(
                status_code=500,
                detail=f"Response generation failed: {response_result.get('error')}",
            )

        # Step 6: Validate citations
        citation_agent = get_citation_agent()
        citation_validation = citation_agent.validate_citations(
            response_text=response_result["answer"],
            source_chunks=retrieval_result["chunks"],
            mode=request.mode,
        )

        if not citation_validation["valid"]:
            logger.warning(
                f"Invalid citations detected: {citation_validation['invalid_citations']}"
            )

        # Step 7: Format citations
        formatted_citations = citation_agent.format_citations(
            citations=response_result["citations"],
            format_style="inline",
        )

        # Convert to Citation models
        citation_models = [
            Citation(
                chunk_id=c["chunk_id"],
                text=c.get("text", ""),
                confidence=response_result["confidence_score"],
                source_type="textbook",
                chapter=c.get("chapter"),
                page_number=c.get("page"),
            )
            for c in formatted_citations
        ]

        # Step 8: Save messages to database
        _save_message(
            db=db,
            conversation_id=conversation_id,
            role="user",
            content=request.message,
            mode=request.mode,
            tone=request.tone,
            action=request.action,
        )

        assistant_message_id = _save_message(
            db=db,
            conversation_id=conversation_id,
            role="assistant",
            content=response_result["answer"],
            mode=request.mode,
            tone=request.tone,
            citations=citation_models,
            confidence_score=response_result["confidence_score"],
        )

        # Calculate latency
        latency_ms = int((time.time() - start_time) * 1000)

        logger.info(
            f"Chat response generated: conversation={conversation_id}, latency={latency_ms}ms"
        )

        return ChatResponse(
            conversation_id=conversation_id,
            message=Message(
                id=assistant_message_id,
                conversation_id=conversation_id,
                role="assistant",
                content=response_result["answer"],
                mode=request.mode,
                tone=request.tone,
                citations=citation_models,
                confidence_score=response_result["confidence_score"],
                metadata={"latency_ms": latency_ms, "model": "gemini-2.0-flash-exp"},
            ),
            should_create_new_conversation=not bool(request.conversation_id),
        )

    except HTTPException:
        raise
    except ImportError as e:
        logger.error(f"Missing dependency: {e}", exc_info=True)
        raise HTTPException(
            status_code=503,
            detail="Service temporarily unavailable. Please try again in a few moments.",
        )
    except TimeoutError as e:
        logger.error(f"Request timeout: {e}", exc_info=True)
        raise HTTPException(
            status_code=504,
            detail="The request took too long to process. Please try again with a simpler question or check your connection.",
        )
    except (ConnectionError, httpx.ConnectError, httpx.TimeoutException) as e:
        logger.error(f"Connection error: {e}", exc_info=True)
        raise HTTPException(
            status_code=503,
            detail="Unable to connect to required services. Please try again in a few moments.",
        )
    except ValueError as e:
        logger.error(f"Invalid value: {e}", exc_info=True)
        raise HTTPException(
            status_code=400,
            detail=f"Invalid input: {str(e)}. Please check your request and try again.",
        )
    except Exception as e:
        logger.error(f"Unexpected error in chat endpoint: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred while processing your request. Please try again or contact support if the problem persists.",
        )


def _get_conversation(
    db, conversation_id: UUID, user_id: Optional[str]
) -> dict:
    """
    Get conversation by ID and validate ownership

    Args:
        db: Database connection
        conversation_id: Conversation UUID
        user_id: User ID (for authorization)

    Returns:
        Conversation dict

    Raises:
        HTTPException 404: Conversation not found
        HTTPException 403: User does not own conversation
    """
    with db.get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT id, user_id, book_id, mode, tone, created_at, updated_at
                FROM conversations
                WHERE id = %s
                """,
                (str(conversation_id),),
            )

            row = cur.fetchone()

            if not row:
                raise HTTPException(
                    status_code=404, detail="Conversation not found"
                )

            conversation = {
                "id": row[0],
                "user_id": row[1],
                "book_id": row[2],
                "mode": row[3],
                "tone": row[4],
                "created_at": row[5],
                "updated_at": row[6],
            }

            # Validate ownership (if user_id provided)
            if user_id and str(conversation["user_id"]) != user_id:
                raise HTTPException(
                    status_code=403,
                    detail="You do not have access to this conversation",
                )

            return conversation


def _create_conversation(
    db,
    user_id: Optional[str],
    is_authenticated: bool,
    book_id: str,
    mode: str,
    tone: str,
) -> dict:
    """
    Create a new conversation

    Args:
        db: Database connection
        user_id: User ID or session ID
        is_authenticated: Whether user is authenticated
        book_id: Book identifier
        mode: Answering mode
        tone: Response tone

    Returns:
        Created conversation dict
    """
    # Calculate expiration (24h for anonymous, NULL for authenticated)
    expires_at = None
    if not is_authenticated:
        expires_at = datetime.utcnow() + timedelta(hours=24)

    # user_id column is UUID type; use fixed UUID for anonymous users
    ANONYMOUS_UUID = "00000000-0000-0000-0000-000000000000"
    effective_user_id = user_id or ANONYMOUS_UUID

    with db.get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO conversations (user_id, book_id, mode, tone, expires_at)
                VALUES (%s, %s, %s, %s, %s)
                RETURNING id, user_id, book_id, mode, tone, created_at, updated_at
                """,
                (
                    effective_user_id,
                    book_id,
                    mode,
                    tone,
                    expires_at,
                ),
            )

            row = cur.fetchone()

            return {
                "id": row[0],
                "user_id": row[1],
                "book_id": row[2],
                "mode": row[3],
                "tone": row[4],
                "created_at": row[5],
                "updated_at": row[6],
            }


def _update_conversation_timestamp(db, conversation_id: UUID) -> dict:
    """
    Update conversation's updated_at timestamp

    Args:
        db: Database connection
        conversation_id: Conversation UUID

    Returns:
        Updated conversation dict
    """
    with db.get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                UPDATE conversations
                SET updated_at = CURRENT_TIMESTAMP
                WHERE id = %s
                RETURNING id, updated_at
                """,
                (str(conversation_id),),
            )

            row = cur.fetchone()

            return {
                "id": row[0],
                "updated_at": row[1],
            }


def _save_message(
    db,
    conversation_id: UUID,
    role: str,
    content: str,
    mode: str,
    tone: Optional[str] = None,
    action: Optional[str] = None,
    citations: Optional[list] = None,
    confidence_score: Optional[float] = None,
    tokens_used: Optional[int] = None,
) -> UUID:
    """
    Save a message to the database

    Args:
        db: Database connection
        conversation_id: Parent conversation UUID
        role: Message role (user or assistant)
        content: Message content
        mode: Answering mode
        tone: Response tone
        action: Action type
        citations: List of Citation models
        confidence_score: Confidence score
        tokens_used: Token count (stored in metadata)

    Returns:
        Created message UUID
    """
    citations_json = json.dumps(
        [c.model_dump() for c in citations] if citations else []
    )
    metadata_json = json.dumps({"tokens_used": tokens_used} if tokens_used else {})

    with db.get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO messages (conversation_id, role, content, mode, tone, action, citations, confidence_score, metadata)
                VALUES (%s, %s, %s, %s, %s, %s, %s::jsonb, %s, %s::jsonb)
                RETURNING id
                """,
                (
                    str(conversation_id),
                    role,
                    content,
                    mode,
                    tone,
                    action,
                    citations_json,
                    confidence_score,
                    metadata_json,
                ),
            )

            row = cur.fetchone()
            return row[0]


def _generate_refusal_message(
    query: str, mode: str, refusal_reason: Optional[str]
) -> str:
    """
    Generate refusal message when no content found

    Args:
        query: User query
        mode: Answering mode
        refusal_reason: Reason for refusal

    Returns:
        Refusal message
    """
    if mode == "book-only":
        return f"I couldn't find information about '{query}' in this textbook. Try switching to General Knowledge mode for a broader answer."
    elif mode == "selected-text-only":
        return "The selected text doesn't contain enough information to answer your question. Please select a different passage or ask in Book-Only mode."
    else:
        return "I couldn't find relevant information to answer your question. Please try rephrasing or asking a different question."
