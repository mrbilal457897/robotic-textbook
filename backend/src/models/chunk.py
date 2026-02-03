"""
Chunk Model
Represents a semantic chunk of textbook content
Hybrid storage: vectors in Qdrant, metadata in Postgres
"""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class ChunkMetadata(BaseModel):
    """Metadata for a textbook chunk"""

    book_id: str = Field(..., description="Textbook book ID")
    chapter: str = Field(..., description="Chapter reference")
    section: Optional[str] = Field(default=None, description="Section reference")
    paragraph: Optional[int] = Field(default=None, description="Paragraph number")
    page_number: Optional[int] = Field(default=None, description="Page number")
    heading: Optional[str] = Field(default=None, description="Section heading")

    class Config:
        json_schema_extra = {
            "example": {
                "book_id": "physical-ai-robotics",
                "chapter": "Chapter 3",
                "section": "Section 2",
                "paragraph": 5,
                "page_number": 45,
                "heading": "Inverse Kinematics Fundamentals",
            }
        }


class Chunk(BaseModel):
    """Chunk entity (hybrid Qdrant + Postgres storage)"""

    chunk_id: str = Field(..., description="Unique chunk ID")
    book_id: str = Field(..., description="Textbook book ID")
    chapter: str = Field(..., description="Chapter reference")
    section: Optional[str] = Field(default=None, description="Section reference")
    page_number: Optional[int] = Field(default=None, description="Page number")
    text: str = Field(..., description="Full chunk text content")
    token_count: int = Field(..., description="Number of tokens in chunk")
    embedding: Optional[list[float]] = Field(
        default=None, description="1024-dim embedding vector (from Cohere)"
    )
    created_at: datetime = Field(
        default_factory=datetime.utcnow, description="Creation timestamp"
    )
    metadata: ChunkMetadata = Field(..., description="Chunk metadata")

    class Config:
        json_schema_extra = {
            "example": {
                "chunk_id": "chunk_abc123",
                "book_id": "physical-ai-robotics",
                "chapter": "Chapter 3",
                "section": "Section 2",
                "page_number": 45,
                "text": "Inverse kinematics (IK) is the mathematical process of calculating...",
                "token_count": 512,
                "created_at": "2026-01-29T10:00:00Z",
                "metadata": {
                    "book_id": "physical-ai-robotics",
                    "chapter": "Chapter 3",
                    "section": "Section 2",
                    "paragraph": 5,
                    "page_number": 45,
                    "heading": "Inverse Kinematics Fundamentals",
                },
            }
        }


class ChunkCreate(BaseModel):
    """Request model for creating a chunk during ingestion"""

    book_id: str = Field(..., description="Textbook book ID")
    chapter: str = Field(..., description="Chapter reference")
    section: Optional[str] = None
    page_number: Optional[int] = None
    text: str = Field(..., description="Chunk text content")
    metadata: ChunkMetadata = Field(..., description="Chunk metadata")


class ChunkSearchResult(BaseModel):
    """Search result for a chunk from Qdrant"""

    chunk_id: str = Field(..., description="Chunk ID")
    score: float = Field(..., description="Similarity score (0-1)")
    text: str = Field(..., description="Chunk text")
    metadata: ChunkMetadata = Field(..., description="Chunk metadata")
    context: Optional[dict] = Field(
        default=None, description="Additional context (prev/next chunks)"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "chunk_id": "chunk_abc123",
                "score": 0.92,
                "text": "Inverse kinematics is the process of determining...",
                "metadata": {
                    "book_id": "physical-ai-robotics",
                    "chapter": "Chapter 3",
                    "section": "Section 2",
                    "page_number": 45,
                },
                "context": {
                    "prev_chunk": "Previous paragraph content...",
                    "next_chunk": "Next paragraph content...",
                },
            }
        }


class ChunkBatchResponse(BaseModel):
    """Response for batch chunk metadata lookup"""

    chunks: list[Chunk] = Field(..., description="List of chunks with metadata")

    class Config:
        json_schema_extra = {
            "example": {
                "chunks": [
                    {
                        "chunk_id": "chunk_abc123",
                        "book_id": "physical-ai-robotics",
                        "chapter": "Chapter 3",
                        "text": "Full chunk text...",
                        "metadata": {"chapter": "Chapter 3", "page_number": 45},
                    }
                ]
            }
        }
