"""
Conversation Model
Represents a chat session between user and bot
"""

from datetime import datetime
from typing import Optional
from uuid import UUID, uuid4
from pydantic import BaseModel, Field


class Conversation(BaseModel):
    """Conversation entity (database model)"""

    id: UUID = Field(default_factory=uuid4, description="Unique conversation ID")
    user_id: Optional[str] = Field(
        default=None, description="OAuth user_id (GitHub/Google) or session_id for anonymous"
    )
    is_authenticated: bool = Field(
        default=False, description="Whether user is authenticated"
    )
    book_id: str = Field(..., description="Textbook book ID")
    chapter_id: Optional[int] = Field(default=None, description="Current chapter ID")
    mode: str = Field(
        default="book-only",
        description="Answering mode: book-only, selected-text, general",
    )
    created_at: datetime = Field(
        default_factory=datetime.utcnow, description="Creation timestamp"
    )
    updated_at: datetime = Field(
        default_factory=datetime.utcnow, description="Last update timestamp"
    )
    expires_at: Optional[datetime] = Field(
        default=None,
        description="Expiration timestamp (24h for anonymous, NULL for authenticated)",
    )
    status: str = Field(
        default="active", description="Status: active, archived, expired"
    )
    metadata: dict = Field(
        default_factory=dict, description="Additional metadata (tone, OAuth provider, etc.)"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "id": "550e8400-e29b-41d4-a716-446655440000",
                "user_id": "github_12345",
                "is_authenticated": True,
                "book_id": "physical-ai-robotics",
                "chapter_id": 3,
                "mode": "book-only",
                "status": "active",
                "metadata": {"tone": "academic", "oauth_provider": "github"},
            }
        }


class ConversationCreate(BaseModel):
    """Request model for creating a new conversation"""

    book_id: str = Field(..., description="Textbook book ID")
    chapter_id: Optional[int] = Field(default=None, description="Current chapter ID")
    mode: str = Field(
        default="book-only",
        description="Answering mode: book-only, selected-text, general",
    )
    metadata: dict = Field(default_factory=dict, description="Additional metadata")


class ConversationUpdate(BaseModel):
    """Request model for updating a conversation"""

    chapter_id: Optional[int] = None
    mode: Optional[str] = None
    status: Optional[str] = None
    metadata: Optional[dict] = None


class ConversationResponse(BaseModel):
    """Response model for conversation"""

    id: UUID
    book_id: str
    chapter_id: Optional[int]
    mode: str
    is_authenticated: bool
    created_at: datetime
    updated_at: datetime
    status: str
    message_count: Optional[int] = Field(
        default=0, description="Number of messages in conversation"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "id": "550e8400-e29b-41d4-a716-446655440000",
                "book_id": "physical-ai-robotics",
                "chapter_id": 3,
                "mode": "book-only",
                "is_authenticated": True,
                "created_at": "2026-01-29T10:30:00Z",
                "updated_at": "2026-01-29T10:35:00Z",
                "status": "active",
                "message_count": 5,
            }
        }
