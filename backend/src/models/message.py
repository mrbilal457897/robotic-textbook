"""
Message Model
Represents a single user question or bot response
"""

from datetime import datetime
from typing import Optional
from uuid import UUID, uuid4
from pydantic import BaseModel, Field


class Citation(BaseModel):
    """Citation information for a message"""

    chunk_id: str = Field(..., description="Chunk ID")
    text: str = Field(..., description="Cited text excerpt")
    confidence: float = Field(..., description="Confidence score (0-1)")
    source_url: Optional[str] = Field(
        default=None, description="URL to source location in textbook"
    )
    source_type: str = Field(
        default="textbook", description="Source type: textbook or general"
    )
    chapter: Optional[str] = Field(default=None, description="Chapter reference")
    section: Optional[str] = Field(default=None, description="Section reference")
    page_number: Optional[int] = Field(default=None, description="Page number")

    class Config:
        json_schema_extra = {
            "example": {
                "chunk_id": "chunk_abc123",
                "text": "Inverse kinematics is the process of determining joint angles...",
                "confidence": 0.92,
                "source_url": "/textbook/physical-ai/chapter-3#section-2",
                "source_type": "textbook",
                "chapter": "Chapter 3",
                "section": "Section 2",
                "page_number": 45,
            }
        }


class Message(BaseModel):
    """Message entity (database model)"""

    id: UUID = Field(default_factory=uuid4, description="Unique message ID")
    conversation_id: UUID = Field(..., description="Parent conversation ID")
    role: str = Field(..., description="Message role: user or assistant")
    content: str = Field(..., description="Message content text")
    mode: str = Field(..., description="Answering mode used: book-only, selected-text, general")
    tone: Optional[str] = Field(
        default=None, description="Response tone: academic, beginner, concise"
    )
    action: Optional[str] = Field(
        default=None, description="Action type: explain, summarize, example, simplify"
    )
    citations: list[Citation] = Field(
        default_factory=list, description="Citations for assistant messages"
    )
    confidence_score: Optional[float] = Field(
        default=None, description="Overall confidence score (0-1)"
    )
    tokens_used: Optional[int] = Field(
        default=None, description="Number of tokens used for this message"
    )
    created_at: datetime = Field(
        default_factory=datetime.utcnow, description="Creation timestamp"
    )
    metadata: dict = Field(
        default_factory=dict, description="Additional metadata (latency, model version, etc.)"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "id": "650e8400-e29b-41d4-a716-446655440000",
                "conversation_id": "550e8400-e29b-41d4-a716-446655440000",
                "role": "assistant",
                "content": "Inverse kinematics is the mathematical process...",
                "mode": "book-only",
                "tone": "academic",
                "action": None,
                "citations": [
                    {
                        "chunk_id": "chunk_abc123",
                        "text": "Inverse kinematics is...",
                        "confidence": 0.92,
                        "source_type": "textbook",
                    }
                ],
                "confidence_score": 0.89,
                "tokens_used": 350,
                "created_at": "2026-01-29T10:30:00Z",
                "metadata": {"latency_ms": 2450, "model": "gemini-1.5-flash"},
            }
        }


class MessageCreate(BaseModel):
    """Request model for creating a new message"""

    conversation_id: UUID
    role: str = Field(..., description="Message role: user or assistant")
    content: str = Field(..., description="Message content")
    mode: str = Field(..., description="Answering mode")
    tone: Optional[str] = None
    action: Optional[str] = None
    selected_text: Optional[str] = Field(
        default=None, description="Selected text for selected-text mode"
    )


class MessageResponse(BaseModel):
    """Response model for message"""

    id: UUID
    conversation_id: UUID
    role: str
    content: str
    mode: str
    tone: Optional[str]
    action: Optional[str]
    citations: list[Citation]
    confidence_score: Optional[float]
    tokens_used: Optional[int]
    created_at: datetime
    has_external_knowledge: bool = Field(
        default=False, description="Whether response includes external knowledge"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "id": "650e8400-e29b-41d4-a716-446655440000",
                "conversation_id": "550e8400-e29b-41d4-a716-446655440000",
                "role": "assistant",
                "content": "Inverse kinematics (IK) is the mathematical process...",
                "mode": "book-only",
                "tone": "academic",
                "action": None,
                "citations": [
                    {
                        "chunk_id": "chunk_abc123",
                        "text": "Inverse kinematics determines joint angles...",
                        "confidence": 0.92,
                        "source_type": "textbook",
                    }
                ],
                "confidence_score": 0.89,
                "tokens_used": 350,
                "created_at": "2026-01-29T10:30:00Z",
                "has_external_knowledge": False,
            }
        }
