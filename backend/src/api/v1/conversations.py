"""
Conversations API Endpoint
Endpoints for managing conversation history
"""

from datetime import datetime
from typing import Optional, List
from uuid import UUID
import logging

from fastapi import APIRouter, HTTPException, Request, Depends, Query

from ...models.conversation import ConversationResponse
from ...models.message import MessageResponse, Citation
from ...db.postgres import get_postgres

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/conversations", tags=["conversations"])


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
        return (None, False)


@router.get("/{conversation_id}", response_model=dict)
async def get_conversation(
    conversation_id: UUID,
    http_request: Request,
    user_info: tuple = Depends(get_user_id),
    include_messages: bool = Query(
        default=True, description="Include message history"
    ),
    message_limit: int = Query(
        default=50, ge=1, le=100, description="Max messages to return"
    ),
) -> dict:
    """
    Get conversation by ID with optional message history

    Args:
        conversation_id: Conversation UUID
        http_request: FastAPI request object
        user_info: User ID and authentication status
        include_messages: Whether to include messages
        message_limit: Maximum number of messages to return

    Returns:
        Conversation with messages

    Raises:
        HTTPException 404: Conversation not found
        HTTPException 403: User does not have access
    """
    user_id, is_authenticated = user_info

    logger.info(
        f"Get conversation: id={conversation_id}, user={user_id}, include_messages={include_messages}"
    )

    db = get_postgres()

    # Get conversation
    conversation = _fetch_conversation(db, conversation_id, user_id)

    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")

    # Get messages if requested
    messages = []
    if include_messages:
        messages = _fetch_messages(db, conversation_id, limit=message_limit)

    return {
        "conversation": conversation,
        "messages": messages,
        "message_count": len(messages),
    }


@router.get("", response_model=List[ConversationResponse])
async def list_conversations(
    http_request: Request,
    user_info: tuple = Depends(get_user_id),
    book_id: Optional[str] = Query(default=None, description="Filter by book ID"),
    status: str = Query(default="active", description="Filter by status"),
    limit: int = Query(default=20, ge=1, le=100, description="Max conversations to return"),
    offset: int = Query(default=0, ge=0, description="Offset for pagination"),
) -> List[ConversationResponse]:
    """
    List conversations for current user

    Args:
        http_request: FastAPI request object
        user_info: User ID and authentication status
        book_id: Optional book ID filter
        status: Status filter (active, archived, expired)
        limit: Maximum number of results
        offset: Pagination offset

    Returns:
        List of conversations

    Raises:
        HTTPException 401: User not authenticated
    """
    user_id, is_authenticated = user_info

    if not user_id:
        raise HTTPException(
            status_code=401, detail="Authentication required"
        )

    logger.info(
        f"List conversations: user={user_id}, book={book_id}, status={status}"
    )

    db = get_postgres()

    with db.get_connection() as conn:
        with conn.cursor() as cur:
            # Build query with filters
            query = """
                SELECT c.id, c.book_id, c.chapter_id, c.mode, c.created_at, c.updated_at, c.status,
                       COUNT(m.id) AS message_count
                FROM conversations c
                LEFT JOIN messages m ON m.conversation_id = c.id
                WHERE c.user_id = %s AND c.status = %s
            """
            params = [user_id, status]

            if book_id:
                query += " AND c.book_id = %s"
                params.append(book_id)

            query += """
                GROUP BY c.id, c.book_id, c.chapter_id, c.mode, c.created_at, c.updated_at, c.status
                ORDER BY c.updated_at DESC
                LIMIT %s OFFSET %s
            """
            params.extend([limit, offset])

            cur.execute(query, params)
            rows = cur.fetchall()

            conversations = []
            for row in rows:
                conversations.append(
                    ConversationResponse(
                        id=row[0],
                        book_id=row[1],
                        chapter_id=row[2],
                        mode=row[3],
                        is_authenticated=is_authenticated,
                        created_at=row[4],
                        updated_at=row[5],
                        status=row[6],
                        message_count=row[7],
                    )
                )

            logger.info(f"Found {len(conversations)} conversations")

            return conversations


@router.delete("/{conversation_id}")
async def delete_conversation(
    conversation_id: UUID,
    http_request: Request,
    user_info: tuple = Depends(get_user_id),
) -> dict:
    """
    Delete (archive) a conversation

    Args:
        conversation_id: Conversation UUID
        http_request: FastAPI request object
        user_info: User ID and authentication status

    Returns:
        Success message

    Raises:
        HTTPException 404: Conversation not found
        HTTPException 403: User does not have access
    """
    user_id, is_authenticated = user_info

    logger.info(f"Delete conversation: id={conversation_id}, user={user_id}")

    db = get_postgres()

    # Verify ownership
    conversation = _fetch_conversation(db, conversation_id, user_id)

    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")

    # Soft delete (archive)
    with db.get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                UPDATE conversations
                SET status = 'archived', updated_at = CURRENT_TIMESTAMP
                WHERE id = %s
                """,
                (str(conversation_id),),
            )

    logger.info(f"Conversation archived: {conversation_id}")

    return {"status": "deleted", "conversation_id": str(conversation_id)}


def _fetch_conversation(
    db, conversation_id: UUID, user_id: Optional[str]
) -> Optional[ConversationResponse]:
    """
    Fetch conversation by ID

    Args:
        db: Database connection
        conversation_id: Conversation UUID
        user_id: User ID (for authorization)

    Returns:
        ConversationResponse or None
    """
    with db.get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT c.id, c.user_id, c.book_id, c.chapter_id, c.mode, c.created_at, c.updated_at, c.status,
                       COUNT(m.id) AS message_count
                FROM conversations c
                LEFT JOIN messages m ON m.conversation_id = c.id
                WHERE c.id = %s
                GROUP BY c.id, c.user_id, c.book_id, c.chapter_id, c.mode, c.created_at, c.updated_at, c.status
                """,
                (str(conversation_id),),
            )

            row = cur.fetchone()

            if not row:
                return None

            # Validate ownership
            if user_id and row[1] != user_id:
                raise HTTPException(
                    status_code=403,
                    detail="You do not have access to this conversation",
                )

            return ConversationResponse(
                id=row[0],
                book_id=row[2],
                chapter_id=row[3],
                mode=row[4],
                is_authenticated=(user_id is not None),
                created_at=row[5],
                updated_at=row[6],
                status=row[7],
                message_count=row[8],
            )


def _fetch_messages(
    db, conversation_id: UUID, limit: int = 50
) -> List[MessageResponse]:
    """
    Fetch messages for a conversation

    Args:
        db: Database connection
        conversation_id: Conversation UUID
        limit: Maximum messages to return

    Returns:
        List of MessageResponse objects
    """
    with db.get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT id, conversation_id, role, content, mode, tone, action, citations, confidence_score, tokens_used, created_at
                FROM messages
                WHERE conversation_id = %s
                ORDER BY created_at ASC
                LIMIT %s
                """,
                (str(conversation_id), limit),
            )

            rows = cur.fetchall()

            messages = []
            for row in rows:
                # Parse citations JSON
                citations_data = row[7] or []
                citations = [
                    Citation(**c) if isinstance(c, dict) else c
                    for c in citations_data
                ]

                messages.append(
                    MessageResponse(
                        id=row[0],
                        conversation_id=row[1],
                        role=row[2],
                        content=row[3],
                        mode=row[4],
                        tone=row[5],
                        action=row[6],
                        citations=citations,
                        confidence_score=row[8],
                        tokens_used=row[9],
                        created_at=row[10],
                        has_external_knowledge=(row[4] == "general"),
                    )
                )

            return messages
