"""
Integration tests for POST /api/v1/chat endpoint
Tests the complete RAG pipeline integration
"""

import pytest
from datetime import datetime, timedelta
from uuid import UUID, uuid4
from unittest.mock import Mock, patch, MagicMock
from fastapi.testclient import TestClient

from src.main import app
from src.models.chat import ChatRequest, ChatResponse, OptimisticLockError


class TestChatEndpointNewConversation:
    """Test chat endpoint with new conversation creation"""

    @patch("src.api.v1.chat.get_citation_agent")
    @patch("src.api.v1.chat.get_response_agent")
    @patch("src.api.v1.chat.get_retrieval_agent")
    @patch("src.api.v1.chat.get_router_agent")
    @patch("src.api.v1.chat.get_postgres")
    def test_successful_chat_new_conversation(
        self,
        mock_get_postgres,
        mock_get_router,
        mock_get_retrieval,
        mock_get_response,
        mock_get_citation,
        mock_router_agent,
        mock_retrieval_agent,
        mock_response_agent,
        mock_citation_agent,
        sample_conversation_id,
        sample_message_id,
        sample_timestamp,
    ):
        """Test successful chat request creating a new conversation"""
        # Setup mocks
        mock_get_router.return_value = mock_router_agent
        mock_get_retrieval.return_value = mock_retrieval_agent
        mock_get_response.return_value = mock_response_agent
        mock_get_citation.return_value = mock_citation_agent

        # Mock database responses
        mock_db = Mock()
        mock_cursor = Mock()
        mock_get_postgres.return_value = mock_db

        # Setup database context managers
        mock_conn = Mock()
        mock_db.get_connection.return_value.__enter__ = Mock(return_value=mock_conn)
        mock_db.get_connection.return_value.__exit__ = Mock(return_value=None)
        mock_conn.cursor.return_value.__enter__ = Mock(return_value=mock_cursor)
        mock_conn.cursor.return_value.__exit__ = Mock(return_value=None)

        # Mock conversation creation
        mock_cursor.fetchone.side_effect = [
            # First call: conversation creation
            (
                str(sample_conversation_id),
                "anonymous",
                "physical-ai-robotics",
                3,
                "book-only",
                sample_timestamp,
                sample_timestamp,
                "active",
            ),
            # Second call: user message save
            (str(uuid4()),),
            # Third call: assistant message save
            (str(sample_message_id),),
            # Fourth call: update conversation timestamp
            (str(sample_conversation_id), sample_timestamp),
        ]

        # Create test client
        client = TestClient(app)

        # Send request
        request_data = {
            "message": "What is inverse kinematics?",
            "mode": "book-only",
            "tone": "academic",
            "book_id": "physical-ai-robotics",
            "chapter_id": 3,
        }

        response = client.post(
            "/api/v1/chat",
            json=request_data,
            cookies={"session_id": "test_session_123"},
        )

        # Verify response
        assert response.status_code == 200
        data = response.json()

        assert "conversation_id" in data
        assert "message_id" in data
        assert "response" in data
        assert "citations" in data
        assert "confidence_score" in data
        assert data["mode"] == "book-only"
        assert data["tone"] == "academic"
        assert data["has_external_knowledge"] is False

        # Verify agents were called
        mock_router_agent.validate_request.assert_called_once()
        mock_router_agent.route_request.assert_called_once()
        mock_retrieval_agent.retrieve.assert_called_once()
        mock_response_agent.generate_response.assert_called_once()
        mock_citation_agent.validate_citations.assert_called_once()

    @patch("src.api.v1.chat.get_citation_agent")
    @patch("src.api.v1.chat.get_response_agent")
    @patch("src.api.v1.chat.get_retrieval_agent")
    @patch("src.api.v1.chat.get_router_agent")
    @patch("src.api.v1.chat.get_postgres")
    def test_successful_chat_authenticated_user(
        self,
        mock_get_postgres,
        mock_get_router,
        mock_get_retrieval,
        mock_get_response,
        mock_get_citation,
        mock_router_agent,
        mock_retrieval_agent,
        mock_response_agent,
        mock_citation_agent,
        sample_conversation_id,
        sample_message_id,
        sample_user_id,
        sample_timestamp,
    ):
        """Test successful chat request with authenticated user"""
        # Setup mocks
        mock_get_router.return_value = mock_router_agent
        mock_get_retrieval.return_value = mock_retrieval_agent
        mock_get_response.return_value = mock_response_agent
        mock_get_citation.return_value = mock_citation_agent

        # Mock database
        mock_db = Mock()
        mock_cursor = Mock()
        mock_get_postgres.return_value = mock_db

        mock_conn = Mock()
        mock_db.get_connection.return_value.__enter__ = Mock(return_value=mock_conn)
        mock_db.get_connection.return_value.__exit__ = Mock(return_value=None)
        mock_conn.cursor.return_value.__enter__ = Mock(return_value=mock_cursor)
        mock_conn.cursor.return_value.__exit__ = Mock(return_value=None)

        # Mock database responses (authenticated user = no expiration)
        mock_cursor.fetchone.side_effect = [
            # Conversation creation (no expires_at for authenticated users)
            (
                str(sample_conversation_id),
                sample_user_id,
                "physical-ai-robotics",
                3,
                "book-only",
                sample_timestamp,
                sample_timestamp,
                "active",
            ),
            (str(uuid4()),),  # User message
            (str(sample_message_id),),  # Assistant message
            (str(sample_conversation_id), sample_timestamp),  # Updated timestamp
        ]

        client = TestClient(app)

        response = client.post(
            "/api/v1/chat",
            json={
                "message": "What is inverse kinematics?",
                "mode": "book-only",
                "tone": "academic",
                "book_id": "physical-ai-robotics",
                "chapter_id": 3,
            },
            cookies={"user_id": sample_user_id},
        )

        assert response.status_code == 200


class TestChatEndpointExistingConversation:
    """Test chat endpoint with existing conversation"""

    @patch("src.api.v1.chat.get_citation_agent")
    @patch("src.api.v1.chat.get_response_agent")
    @patch("src.api.v1.chat.get_retrieval_agent")
    @patch("src.api.v1.chat.get_router_agent")
    @patch("src.api.v1.chat.get_postgres")
    def test_successful_chat_existing_conversation(
        self,
        mock_get_postgres,
        mock_get_router,
        mock_get_retrieval,
        mock_get_response,
        mock_get_citation,
        mock_router_agent,
        mock_retrieval_agent,
        mock_response_agent,
        mock_citation_agent,
        sample_conversation_id,
        sample_message_id,
        sample_user_id,
        sample_timestamp,
    ):
        """Test successful chat request with existing conversation"""
        # Setup mocks
        mock_get_router.return_value = mock_router_agent
        mock_get_retrieval.return_value = mock_retrieval_agent
        mock_get_response.return_value = mock_response_agent
        mock_get_citation.return_value = mock_citation_agent

        # Mock database
        mock_db = Mock()
        mock_cursor = Mock()
        mock_get_postgres.return_value = mock_db

        mock_conn = Mock()
        mock_db.get_connection.return_value.__enter__ = Mock(return_value=mock_conn)
        mock_db.get_connection.return_value.__exit__ = Mock(return_value=None)
        mock_conn.cursor.return_value.__enter__ = Mock(return_value=mock_cursor)
        mock_conn.cursor.return_value.__exit__ = Mock(return_value=None)

        # Mock database responses
        mock_cursor.fetchone.side_effect = [
            # First call: get existing conversation
            (
                str(sample_conversation_id),
                sample_user_id,
                "physical-ai-robotics",
                3,
                "book-only",
                sample_timestamp,
                sample_timestamp,
                "active",
            ),
            # Subsequent calls for message saves
            (str(uuid4()),),
            (str(sample_message_id),),
            (str(sample_conversation_id), sample_timestamp),
        ]

        client = TestClient(app)

        response = client.post(
            "/api/v1/chat",
            json={
                "conversation_id": str(sample_conversation_id),
                "message": "Tell me more about IK algorithms",
                "mode": "book-only",
                "tone": "academic",
                "book_id": "physical-ai-robotics",
                "chapter_id": 3,
                "last_updated_at": sample_timestamp.isoformat(),
            },
            cookies={"user_id": sample_user_id},
        )

        assert response.status_code == 200
        data = response.json()
        assert data["conversation_id"] == str(sample_conversation_id)

    @patch("src.api.v1.chat.get_postgres")
    def test_optimistic_lock_conflict(
        self,
        mock_get_postgres,
        sample_conversation_id,
        sample_user_id,
        sample_timestamp,
    ):
        """Test optimistic locking conflict (409 response)"""
        # Mock database
        mock_db = Mock()
        mock_cursor = Mock()
        mock_get_postgres.return_value = mock_db

        mock_conn = Mock()
        mock_db.get_connection.return_value.__enter__ = Mock(return_value=mock_conn)
        mock_db.get_connection.return_value.__exit__ = Mock(return_value=None)
        mock_conn.cursor.return_value.__enter__ = Mock(return_value=mock_cursor)
        mock_conn.cursor.return_value.__exit__ = Mock(return_value=None)

        # Conversation was updated elsewhere (newer timestamp)
        newer_timestamp = sample_timestamp + timedelta(seconds=30)

        mock_cursor.fetchone.return_value = (
            str(sample_conversation_id),
            sample_user_id,
            "physical-ai-robotics",
            3,
            "book-only",
            sample_timestamp,
            newer_timestamp,  # Updated timestamp is newer
            "active",
        )

        client = TestClient(app)

        response = client.post(
            "/api/v1/chat",
            json={
                "conversation_id": str(sample_conversation_id),
                "message": "Follow-up question",
                "mode": "book-only",
                "tone": "academic",
                "book_id": "physical-ai-robotics",
                "last_updated_at": sample_timestamp.isoformat(),  # Old timestamp
            },
            cookies={"user_id": sample_user_id},
        )

        # Should return 409 Conflict
        assert response.status_code == 409
        data = response.json()
        assert data["error"] == "CONVERSATION_UPDATED"
        assert "latest_updated_at" in data

    @patch("src.api.v1.chat.get_postgres")
    def test_conversation_not_found(
        self,
        mock_get_postgres,
        sample_conversation_id,
        sample_user_id,
    ):
        """Test conversation not found (404 response)"""
        # Mock database
        mock_db = Mock()
        mock_cursor = Mock()
        mock_get_postgres.return_value = mock_db

        mock_conn = Mock()
        mock_db.get_connection.return_value.__enter__ = Mock(return_value=mock_conn)
        mock_db.get_connection.return_value.__exit__ = Mock(return_value=None)
        mock_conn.cursor.return_value.__enter__ = Mock(return_value=mock_cursor)
        mock_conn.cursor.return_value.__exit__ = Mock(return_value=None)

        # No conversation found
        mock_cursor.fetchone.return_value = None

        client = TestClient(app)

        response = client.post(
            "/api/v1/chat",
            json={
                "conversation_id": str(sample_conversation_id),
                "message": "Follow-up question",
                "mode": "book-only",
                "tone": "academic",
                "book_id": "physical-ai-robotics",
            },
            cookies={"user_id": sample_user_id},
        )

        assert response.status_code == 404
        assert "not found" in response.json()["detail"].lower()

    @patch("src.api.v1.chat.get_postgres")
    def test_unauthorized_access_to_conversation(
        self,
        mock_get_postgres,
        sample_conversation_id,
        sample_timestamp,
    ):
        """Test unauthorized access to another user's conversation (403)"""
        # Mock database
        mock_db = Mock()
        mock_cursor = Mock()
        mock_get_postgres.return_value = mock_db

        mock_conn = Mock()
        mock_db.get_connection.return_value.__enter__ = Mock(return_value=mock_conn)
        mock_db.get_connection.return_value.__exit__ = Mock(return_value=None)
        mock_conn.cursor.return_value.__enter__ = Mock(return_value=mock_cursor)
        mock_conn.cursor.return_value.__exit__ = Mock(return_value=None)

        # Conversation belongs to different user
        mock_cursor.fetchone.return_value = (
            str(sample_conversation_id),
            "different_user_id",  # Different user
            "physical-ai-robotics",
            3,
            "book-only",
            sample_timestamp,
            sample_timestamp,
            "active",
        )

        client = TestClient(app)

        response = client.post(
            "/api/v1/chat",
            json={
                "conversation_id": str(sample_conversation_id),
                "message": "Follow-up question",
                "mode": "book-only",
                "tone": "academic",
                "book_id": "physical-ai-robotics",
            },
            cookies={"user_id": "attacker_user_id"},
        )

        assert response.status_code == 403
        assert "access" in response.json()["detail"].lower()


class TestChatEndpointRefusal:
    """Test refusal scenarios when no content found"""

    @patch("src.api.v1.chat.get_citation_agent")
    @patch("src.api.v1.chat.get_response_agent")
    @patch("src.api.v1.chat.get_retrieval_agent")
    @patch("src.api.v1.chat.get_router_agent")
    @patch("src.api.v1.chat.get_postgres")
    def test_no_results_found_refusal(
        self,
        mock_get_postgres,
        mock_get_router,
        mock_get_retrieval,
        mock_get_response,
        mock_get_citation,
        mock_router_agent,
        sample_conversation_id,
        sample_message_id,
        sample_timestamp,
    ):
        """Test refusal when no relevant content is found"""
        # Setup mocks
        mock_get_router.return_value = mock_router_agent

        # Mock retrieval agent to return no results
        mock_retrieval = Mock()
        mock_retrieval.retrieve.return_value = {
            "status": "no_results",
            "chunks": [],
            "refusal_reason": "no_content_found",
            "metadata": {"candidates_found": 0},
        }
        mock_get_retrieval.return_value = mock_retrieval

        # Mock database
        mock_db = Mock()
        mock_cursor = Mock()
        mock_get_postgres.return_value = mock_db

        mock_conn = Mock()
        mock_db.get_connection.return_value.__enter__ = Mock(return_value=mock_conn)
        mock_db.get_connection.return_value.__exit__ = Mock(return_value=None)
        mock_conn.cursor.return_value.__enter__ = Mock(return_value=mock_cursor)
        mock_conn.cursor.return_value.__exit__ = Mock(return_value=None)

        mock_cursor.fetchone.side_effect = [
            # Conversation creation
            (
                str(sample_conversation_id),
                "anonymous",
                "physical-ai-robotics",
                3,
                "book-only",
                sample_timestamp,
                sample_timestamp,
                "active",
            ),
            (str(uuid4()),),  # User message
            (str(sample_message_id),),  # Refusal message
            (str(sample_conversation_id), sample_timestamp),
        ]

        client = TestClient(app)

        response = client.post(
            "/api/v1/chat",
            json={
                "message": "What is quantum entanglement?",  # Not in textbook
                "mode": "book-only",
                "tone": "academic",
                "book_id": "physical-ai-robotics",
            },
            cookies={"session_id": "test_session"},
        )

        assert response.status_code == 200
        data = response.json()

        # Should return refusal message
        assert "couldn't find" in data["response"].lower() or "not found" in data["response"].lower()
        assert data["confidence_score"] == 0.0
        assert len(data["citations"]) == 0
        assert "refusal_reason" in data["metadata"]


class TestChatEndpointValidation:
    """Test request validation"""

    def test_invalid_mode(self):
        """Test invalid answering mode"""
        client = TestClient(app)

        response = client.post(
            "/api/v1/chat",
            json={
                "message": "What is inverse kinematics?",
                "mode": "invalid-mode",  # Invalid mode
                "tone": "academic",
                "book_id": "physical-ai-robotics",
            },
        )

        assert response.status_code == 422  # Validation error

    def test_invalid_tone(self):
        """Test invalid response tone"""
        client = TestClient(app)

        response = client.post(
            "/api/v1/chat",
            json={
                "message": "What is inverse kinematics?",
                "mode": "book-only",
                "tone": "invalid-tone",  # Invalid tone
                "book_id": "physical-ai-robotics",
            },
        )

        assert response.status_code == 422  # Validation error

    def test_message_too_long(self):
        """Test message exceeds max length"""
        client = TestClient(app)

        response = client.post(
            "/api/v1/chat",
            json={
                "message": "x" * 2001,  # Exceeds 2000 character limit
                "mode": "book-only",
                "tone": "academic",
                "book_id": "physical-ai-robotics",
            },
        )

        assert response.status_code == 422

    def test_selected_text_too_long(self):
        """Test selected text exceeds max length"""
        client = TestClient(app)

        response = client.post(
            "/api/v1/chat",
            json={
                "message": "Explain this",
                "mode": "selected-text",
                "tone": "academic",
                "book_id": "physical-ai-robotics",
                "selected_text": "x" * 8001,  # Exceeds 8000 character limit
            },
        )

        assert response.status_code == 422

    @patch("src.api.v1.chat.get_router_agent")
    @patch("src.api.v1.chat.get_postgres")
    def test_router_validation_failure(
        self,
        mock_get_postgres,
        mock_get_router,
        sample_conversation_id,
        sample_timestamp,
    ):
        """Test when router agent rejects the request"""
        # Mock router to reject request
        mock_router = Mock()
        mock_router.validate_request.return_value = (
            False,
            "Query is too vague. Please be more specific.",
        )
        mock_get_router.return_value = mock_router

        # Mock database for conversation creation
        mock_db = Mock()
        mock_cursor = Mock()
        mock_get_postgres.return_value = mock_db

        mock_conn = Mock()
        mock_db.get_connection.return_value.__enter__ = Mock(return_value=mock_conn)
        mock_db.get_connection.return_value.__exit__ = Mock(return_value=None)
        mock_conn.cursor.return_value.__enter__ = Mock(return_value=mock_cursor)
        mock_conn.cursor.return_value.__exit__ = Mock(return_value=None)

        mock_cursor.fetchone.return_value = (
            str(sample_conversation_id),
            "anonymous",
            "physical-ai-robotics",
            None,
            "book-only",
            sample_timestamp,
            sample_timestamp,
            "active",
        )

        client = TestClient(app)

        response = client.post(
            "/api/v1/chat",
            json={
                "message": "tell me",
                "mode": "book-only",
                "tone": "academic",
                "book_id": "physical-ai-robotics",
            },
        )

        assert response.status_code == 400
        assert "vague" in response.json()["detail"].lower()


class TestChatEndpointErrorHandling:
    """Test error handling scenarios"""

    @patch("src.api.v1.chat.get_response_agent")
    @patch("src.api.v1.chat.get_retrieval_agent")
    @patch("src.api.v1.chat.get_router_agent")
    @patch("src.api.v1.chat.get_postgres")
    def test_response_generation_error(
        self,
        mock_get_postgres,
        mock_get_router,
        mock_get_retrieval,
        mock_get_response,
        mock_router_agent,
        mock_retrieval_agent,
        sample_conversation_id,
        sample_timestamp,
    ):
        """Test when response generation fails"""
        # Setup mocks
        mock_get_router.return_value = mock_router_agent
        mock_get_retrieval.return_value = mock_retrieval_agent

        # Mock response agent to fail
        mock_response = Mock()
        mock_response.generate_response.return_value = {
            "status": "error",
            "error": "LLM API rate limit exceeded",
        }
        mock_get_response.return_value = mock_response

        # Mock database
        mock_db = Mock()
        mock_cursor = Mock()
        mock_get_postgres.return_value = mock_db

        mock_conn = Mock()
        mock_db.get_connection.return_value.__enter__ = Mock(return_value=mock_conn)
        mock_db.get_connection.return_value.__exit__ = Mock(return_value=None)
        mock_conn.cursor.return_value.__enter__ = Mock(return_value=mock_cursor)
        mock_conn.cursor.return_value.__exit__ = Mock(return_value=None)

        mock_cursor.fetchone.return_value = (
            str(sample_conversation_id),
            "anonymous",
            "physical-ai-robotics",
            3,
            "book-only",
            sample_timestamp,
            sample_timestamp,
            "active",
        )

        client = TestClient(app)

        response = client.post(
            "/api/v1/chat",
            json={
                "message": "What is inverse kinematics?",
                "mode": "book-only",
                "tone": "academic",
                "book_id": "physical-ai-robotics",
            },
        )

        assert response.status_code == 500
        assert "failed" in response.json()["detail"].lower()
