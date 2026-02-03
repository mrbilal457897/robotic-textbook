"""
Chat Models
Request/Response models for the chat API endpoint
"""

from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field, field_validator

from .message import Citation


class ChatRequest(BaseModel):
    """Request model for POST /api/v1/chat"""

    conversation_id: Optional[UUID] = Field(
        default=None,
        description="Existing conversation ID (creates new if null)",
    )
    message: str = Field(
        ...,
        min_length=1,
        max_length=2000,
        description="User's question or message",
    )
    mode: str = Field(
        ...,
        description="Answering mode: book-only, selected-text, general",
    )
    tone: str = Field(
        default="academic",
        description="Response tone: academic, beginner, concise",
    )
    book_id: str = Field(..., description="Textbook book ID")
    chapter_id: Optional[int] = Field(
        default=None, description="Current chapter (for context)"
    )
    selected_text: Optional[str] = Field(
        default=None,
        max_length=8000,
        description="Selected text for selected-text mode",
    )
    action: Optional[str] = Field(
        default=None,
        description="Action for selected-text: explain, summarize, example, simplify",
    )
    last_updated_at: Optional[datetime] = Field(
        default=None,
        description="Last updated timestamp (for optimistic locking)",
    )

    @field_validator("mode")
    @classmethod
    def validate_mode(cls, v: str) -> str:
        """Validate answering mode"""
        allowed_modes = {"book-only", "selected-text", "general"}
        if v not in allowed_modes:
            raise ValueError(f"Mode must be one of: {allowed_modes}")
        return v

    @field_validator("tone")
    @classmethod
    def validate_tone(cls, v: str) -> str:
        """Validate response tone"""
        allowed_tones = {"academic", "beginner", "concise"}
        if v not in allowed_tones:
            raise ValueError(f"Tone must be one of: {allowed_tones}")
        return v

    @field_validator("action")
    @classmethod
    def validate_action(cls, v: Optional[str]) -> Optional[str]:
        """Validate action type"""
        if v is None:
            return v
        allowed_actions = {"explain", "summarize", "example", "simplify"}
        if v not in allowed_actions:
            raise ValueError(f"Action must be one of: {allowed_actions}")
        return v

    class Config:
        json_schema_extra = {
            "example": {
                "conversation_id": "550e8400-e29b-41d4-a716-446655440000",
                "message": "What is inverse kinematics?",
                "mode": "book-only",
                "tone": "academic",
                "book_id": "physical-ai-robotics",
                "chapter_id": 3,
                "selected_text": None,
                "action": None,
                "last_updated_at": "2026-01-29T10:30:00Z",
            }
        }


class ChatResponse(BaseModel):
    """Response model for POST /api/v1/chat"""

    conversation_id: UUID = Field(..., description="Conversation ID")
    message_id: UUID = Field(..., description="Generated message ID")
    response: str = Field(..., description="Bot's response text")
    citations: list[Citation] = Field(
        default_factory=list, description="Citations for the response"
    )
    confidence_score: Optional[float] = Field(
        default=None, description="Overall confidence score (0-1)"
    )
    tokens_used: int = Field(..., description="Number of tokens used")
    mode: str = Field(..., description="Answering mode used")
    tone: str = Field(..., description="Response tone used")
    has_external_knowledge: bool = Field(
        default=False,
        description="Whether response includes external knowledge (general mode)",
    )
    timestamp: datetime = Field(
        default_factory=datetime.utcnow, description="Response timestamp"
    )
    conversation_updated_at: datetime = Field(
        ..., description="Conversation's updated_at for optimistic locking"
    )
    metadata: dict = Field(
        default_factory=dict, description="Additional metadata (latency, model, etc.)"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "conversation_id": "550e8400-e29b-41d4-a716-446655440000",
                "message_id": "650e8400-e29b-41d4-a716-446655440000",
                "response": "Inverse kinematics (IK) is the mathematical process...",
                "citations": [
                    {
                        "chunk_id": "chunk_abc123",
                        "text": "Inverse kinematics determines joint angles...",
                        "confidence": 0.92,
                        "source_url": "/textbook/physical-ai/chapter-3#section-2",
                        "source_type": "textbook",
                        "chapter": "Chapter 3",
                        "section": "Section 2",
                        "page_number": 45,
                    }
                ],
                "confidence_score": 0.89,
                "tokens_used": 350,
                "mode": "book-only",
                "tone": "academic",
                "has_external_knowledge": False,
                "timestamp": "2026-01-29T10:30:15Z",
                "conversation_updated_at": "2026-01-29T10:30:15Z",
                "metadata": {
                    "latency_ms": 2450,
                    "model": "gemini-1.5-flash",
                    "embedding_model": "embed-english-v3.0",
                    "retrieval_count": 5,
                },
            }
        }


class ChatError(BaseModel):
    """Error response model"""

    error: str = Field(..., description="Error code")
    message: str = Field(..., description="Human-readable error message")
    details: Optional[dict] = Field(default=None, description="Additional error details")

    class Config:
        json_schema_extra = {
            "example": {
                "error": "RATE_LIMIT_EXCEEDED",
                "message": "You have exceeded the rate limit. Please try again in 3600 seconds.",
                "details": {"retry_after": 3600, "limit": 10, "window": "1 hour"},
            }
        }


class OptimisticLockError(BaseModel):
    """Optimistic locking conflict error"""

    error: str = Field(default="CONVERSATION_UPDATED")
    message: str = Field(..., description="Error message")
    latest_updated_at: datetime = Field(
        ..., description="Latest updated_at timestamp from server"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "error": "CONVERSATION_UPDATED",
                "message": "Conversation was updated elsewhere. Please refresh and try again.",
                "latest_updated_at": "2026-01-29T10:35:00Z",
            }
        }
