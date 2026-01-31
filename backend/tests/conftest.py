"""
Pytest configuration and shared fixtures
"""

import pytest
from uuid import UUID, uuid4
from datetime import datetime, timedelta
from unittest.mock import Mock, AsyncMock, patch
from fastapi.testclient import TestClient


@pytest.fixture
def mock_postgres():
    """Mock Postgres database connection"""
    mock_db = Mock()
    mock_conn = Mock()
    mock_cursor = Mock()

    # Setup context managers
    mock_db.get_connection.return_value.__enter__ = Mock(return_value=mock_conn)
    mock_db.get_connection.return_value.__exit__ = Mock(return_value=None)
    mock_conn.cursor.return_value.__enter__ = Mock(return_value=mock_cursor)
    mock_conn.cursor.return_value.__exit__ = Mock(return_value=None)

    return mock_db, mock_cursor


@pytest.fixture
def mock_router_agent():
    """Mock Router Agent"""
    mock_agent = Mock()

    # Default valid responses
    mock_agent.validate_request.return_value = (True, None)
    mock_agent.route_request.return_value = {
        "mode": "book-only",
        "intent": "definition",
        "query": {
            "original": "What is inverse kinematics?",
            "normalized": "inverse kinematics",
        },
        "filters": {
            "book_id": "physical-ai-robotics",
            "chapter": None,
        },
    }

    return mock_agent


@pytest.fixture
def mock_retrieval_agent():
    """Mock Retrieval Agent"""
    mock_agent = Mock()

    # Default successful retrieval
    mock_agent.retrieve.return_value = {
        "status": "success",
        "chunks": [
            {
                "chunk_id": "chunk_abc123",
                "text": "Inverse kinematics (IK) is the mathematical process of determining joint angles...",
                "chapter": "Chapter 3",
                "section": "Motion Planning",
                "page": 45,
                "confidence": 0.92,
            },
            {
                "chunk_id": "chunk_def456",
                "text": "IK algorithms compute the configuration space...",
                "chapter": "Chapter 3",
                "section": "Motion Planning",
                "page": 46,
                "confidence": 0.88,
            },
        ],
        "metadata": {
            "candidates_found": 2,
            "search_time_ms": 45,
        },
    }

    return mock_agent


@pytest.fixture
def mock_response_agent():
    """Mock Response Agent"""
    mock_agent = Mock()

    # Default successful response
    mock_agent.generate_response.return_value = {
        "status": "success",
        "answer": "Inverse kinematics (IK) is the mathematical process of determining the joint angles needed to position a robot's end-effector at a desired location.",
        "citations": [
            {
                "chunk_id": "chunk_abc123",
                "text": "Inverse kinematics determines joint angles...",
                "chapter": "Chapter 3",
                "page": 45,
            }
        ],
        "confidence_score": 0.89,
        "tokens_used": 350,
    }

    return mock_agent


@pytest.fixture
def mock_citation_agent():
    """Mock Citation Agent"""
    mock_agent = Mock()

    # Default valid citations
    mock_agent.validate_citations.return_value = {
        "valid": True,
        "invalid_citations": [],
        "coverage": 0.95,
    }

    mock_agent.format_citations.return_value = [
        {
            "chunk_id": "chunk_abc123",
            "text": "Inverse kinematics determines joint angles...",
            "chapter": "Chapter 3",
            "page": 45,
        }
    ]

    return mock_agent


@pytest.fixture
def sample_conversation_id():
    """Sample conversation UUID"""
    return UUID("550e8400-e29b-41d4-a716-446655440000")


@pytest.fixture
def sample_message_id():
    """Sample message UUID"""
    return UUID("650e8400-e29b-41d4-a716-446655440000")


@pytest.fixture
def sample_user_id():
    """Sample user ID"""
    return "user_12345"


@pytest.fixture
def sample_timestamp():
    """Sample timestamp"""
    return datetime(2026, 1, 29, 10, 30, 0)
