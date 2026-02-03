"""
Metadata MCP Server
Provides chunk metadata retrieval and context operations
"""

from typing import List, Dict, Any, Optional
import logging

from ..db.qdrant import get_qdrant

logger = logging.getLogger(__name__)


class MetadataMCP:
    """MCP Server for metadata operations"""

    def __init__(self):
        self.qdrant = get_qdrant()
        logger.info("Metadata MCP initialized")

    def get_chunk_metadata(self, chunk_id: str) -> Optional[Dict[str, Any]]:
        """
        Get metadata for a specific chunk

        Args:
            chunk_id: Chunk identifier

        Returns:
            Chunk metadata dict or None if not found
        """
        try:
            # Search by ID (retrieve single point)
            results = self.qdrant.client.retrieve(
                collection_name=self.qdrant.collection_name,
                ids=[chunk_id],
                with_payload=True,
                with_vectors=False,
            )

            if results:
                payload = results[0].payload
                return {
                    "chunk_id": str(results[0].id),
                    "text": payload.get("text", ""),
                    "metadata": {
                        k: v for k, v in payload.items() if k not in ["text"]
                    },
                }

            return None

        except Exception as e:
            logger.error(f"Failed to get chunk metadata: {e}")
            return None

    def get_chunks_with_context(
        self, chunk_ids: List[str], context_window: int = 1
    ) -> List[Dict[str, Any]]:
        """
        Get chunks with surrounding context (previous and next chunks)

        Args:
            chunk_ids: List of chunk IDs
            context_window: Number of chunks to include before/after (default: 1)

        Returns:
            List of chunks with context
        """
        results = []

        for chunk_id in chunk_ids:
            chunk = self.get_chunk_metadata(chunk_id)

            if chunk:
                # Parse chunk index from ID (format: book_id_chunk_00123)
                try:
                    chunk_index = int(chunk_id.rsplit("_", 1)[-1])
                    book_id_prefix = chunk_id.rsplit("_chunk_", 1)[0]

                    # Get surrounding chunks
                    context_ids = []
                    for offset in range(-context_window, context_window + 1):
                        if offset != 0:  # Skip the main chunk
                            context_chunk_id = (
                                f"{book_id_prefix}_chunk_{chunk_index + offset:05d}"
                            )
                            context_ids.append(context_chunk_id)

                    # Retrieve context chunks
                    context_chunks = []
                    for context_id in context_ids:
                        context_chunk = self.get_chunk_metadata(context_id)
                        if context_chunk:
                            context_chunks.append(context_chunk)

                    results.append(
                        {
                            "main_chunk": chunk,
                            "context_before": [
                                c
                                for c in context_chunks
                                if c["chunk_id"] < chunk_id
                            ],
                            "context_after": [
                                c
                                for c in context_chunks
                                if c["chunk_id"] > chunk_id
                            ],
                        }
                    )

                except Exception as e:
                    logger.warning(f"Failed to extract context for {chunk_id}: {e}")
                    results.append({"main_chunk": chunk, "context_before": [], "context_after": []})

        return results

    def get_batch_metadata(self, chunk_ids: List[str]) -> List[Dict[str, Any]]:
        """
        Get metadata for multiple chunks in batch

        Args:
            chunk_ids: List of chunk identifiers

        Returns:
            List of chunk metadata dicts
        """
        try:
            results = self.qdrant.client.retrieve(
                collection_name=self.qdrant.collection_name,
                ids=chunk_ids,
                with_payload=True,
                with_vectors=False,
            )

            metadata_list = []
            for result in results:
                payload = result.payload
                metadata_list.append(
                    {
                        "chunk_id": str(result.id),
                        "text": payload.get("text", ""),
                        "metadata": {
                            k: v for k, v in payload.items() if k not in ["text"]
                        },
                    }
                )

            logger.info(f"Retrieved metadata for {len(metadata_list)} chunks")

            return metadata_list

        except Exception as e:
            logger.error(f"Batch metadata retrieval failed: {e}")
            raise

    def get_book_metadata(self, book_id: str) -> Dict[str, Any]:
        """
        Get aggregated metadata for a book

        Args:
            book_id: Book identifier

        Returns:
            Dict with book statistics
        """
        try:
            # Search with filter to count chunks
            results = self.qdrant.search(
                query_vector=[0.0] * self.qdrant.vector_size,  # Dummy vector
                top_k=1,
                filters={"book_id": book_id},
            )

            if not results:
                return {"book_id": book_id, "chunk_count": 0, "exists": False}

            # Get first chunk to extract metadata
            first_chunk = results[0]
            metadata = first_chunk.get("metadata", {})

            return {
                "book_id": book_id,
                "book_title": metadata.get("book_title", ""),
                "authors": metadata.get("authors", []),
                "exists": True,
            }

        except Exception as e:
            logger.error(f"Failed to get book metadata: {e}")
            raise


# Global instance
_metadata_mcp = None


def get_metadata_mcp() -> MetadataMCP:
    """Get or create global Metadata MCP instance"""
    global _metadata_mcp
    if _metadata_mcp is None:
        _metadata_mcp = MetadataMCP()
    return _metadata_mcp
