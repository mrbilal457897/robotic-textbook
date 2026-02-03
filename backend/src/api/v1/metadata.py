"""
Metadata API endpoints
Provides citation metadata and batch retrieval for frontend
"""

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field
from typing import List, Dict, Any
import logging

from ...mcp.metadata import get_metadata_mcp

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/metadata", tags=["metadata"])


class ChunkMetadataResponse(BaseModel):
    """Single chunk metadata response"""

    chunk_id: str
    text: str
    metadata: Dict[str, Any]


class ChunkWithContextResponse(BaseModel):
    """Chunk with context response"""

    main_chunk: ChunkMetadataResponse
    context_before: List[ChunkMetadataResponse]
    context_after: List[ChunkMetadataResponse]


class BatchMetadataRequest(BaseModel):
    """Batch metadata request"""

    chunk_ids: List[str] = Field(..., min_items=1, max_items=50)
    include_context: bool = Field(default=False)
    context_window: int = Field(default=1, ge=1, le=3)


class BatchMetadataResponse(BaseModel):
    """Batch metadata response"""

    chunks: List[ChunkMetadataResponse | ChunkWithContextResponse]
    total: int


@router.get("/{chunk_id}", response_model=ChunkMetadataResponse)
async def get_chunk_metadata(chunk_id: str):
    """
    Get metadata for a single chunk

    Args:
        chunk_id: Chunk identifier

    Returns:
        Chunk metadata with text and metadata fields
    """
    try:
        metadata_mcp = get_metadata_mcp()
        chunk = metadata_mcp.get_chunk_metadata(chunk_id)

        if not chunk:
            raise HTTPException(status_code=404, detail=f"Chunk {chunk_id} not found")

        return ChunkMetadataResponse(**chunk)

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to retrieve chunk metadata: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to retrieve chunk metadata")


@router.post("/batch", response_model=BatchMetadataResponse)
async def get_batch_metadata(request: BatchMetadataRequest):
    """
    Get metadata for multiple chunks in batch (T118)

    Supports two modes:
    1. Simple batch retrieval (include_context=False): Returns only the requested chunks
    2. Context-aware retrieval (include_context=True): Returns chunks with surrounding context

    Args:
        request: Batch metadata request with chunk IDs and context settings

    Returns:
        Batch metadata response with chunks and total count
    """
    try:
        metadata_mcp = get_metadata_mcp()

        if request.include_context:
            # Mode 2: Get chunks with context (T117)
            chunks_with_context = metadata_mcp.get_chunks_with_context(
                chunk_ids=request.chunk_ids, context_window=request.context_window
            )

            response_chunks = []
            for chunk_data in chunks_with_context:
                # Convert to response format
                main_chunk = ChunkMetadataResponse(**chunk_data["main_chunk"])
                context_before = [
                    ChunkMetadataResponse(**c) for c in chunk_data["context_before"]
                ]
                context_after = [
                    ChunkMetadataResponse(**c) for c in chunk_data["context_after"]
                ]

                response_chunks.append(
                    ChunkWithContextResponse(
                        main_chunk=main_chunk,
                        context_before=context_before,
                        context_after=context_after,
                    )
                )

            return BatchMetadataResponse(chunks=response_chunks, total=len(response_chunks))

        else:
            # Mode 1: Simple batch retrieval
            chunks = metadata_mcp.get_batch_metadata(chunk_ids=request.chunk_ids)

            response_chunks = [ChunkMetadataResponse(**chunk) for chunk in chunks]

            return BatchMetadataResponse(chunks=response_chunks, total=len(response_chunks))

    except Exception as e:
        logger.error(f"Batch metadata retrieval failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to retrieve batch metadata")


@router.get("/book/{book_id}")
async def get_book_metadata(book_id: str):
    """
    Get aggregated metadata for a book

    Args:
        book_id: Book identifier

    Returns:
        Book metadata with title, authors, and statistics
    """
    try:
        metadata_mcp = get_metadata_mcp()
        book_metadata = metadata_mcp.get_book_metadata(book_id)

        if not book_metadata.get("exists"):
            raise HTTPException(status_code=404, detail=f"Book {book_id} not found")

        return book_metadata

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to retrieve book metadata: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to retrieve book metadata")
