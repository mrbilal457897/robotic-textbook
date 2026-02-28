"""
Qdrant Vector Database Client
Provides vector search and storage operations for textbook chunks
"""

import os
from typing import List, Dict, Any, Optional
from qdrant_client import QdrantClient
from qdrant_client.models import (
    PointStruct,
    Filter,
    FieldCondition,
    MatchValue,
    Distance,
    VectorParams,
    PayloadSchemaType,
)
import logging

logger = logging.getLogger(__name__)


class QdrantDB:
    """Manages Qdrant Cloud connection and provides vector search operations"""

    def __init__(self):
        """Initialize Qdrant client from environment variables"""
        self.url = os.getenv("QDRANT_URL")
        self.api_key = os.getenv("QDRANT_API_KEY")
        self.collection_name = os.getenv("QDRANT_COLLECTION_NAME", "textbook_chunks")
        self.vector_size = int(os.getenv("QDRANT_VECTOR_SIZE", "1024"))

        if not self.url or not self.api_key:
            raise ValueError("QDRANT_URL and QDRANT_API_KEY must be set")

        self.client = QdrantClient(url=self.url, api_key=self.api_key)
        logger.info(f"Qdrant client initialized (collection: {self.collection_name})")

    def ensure_collection(self):
        """
        Ensure collection exists with correct vector size, create/recreate if needed.

        This should be called during initialization/ingestion only
        """
        try:
            collections = self.client.get_collections()
            collection_names = [col.name for col in collections.collections]

            if self.collection_name in collection_names:
                # Check existing collection's vector size
                info = self.client.get_collection(collection_name=self.collection_name)
                vectors_cfg = info.config.params.vectors
                if isinstance(vectors_cfg, dict):
                    existing_size = next(iter(vectors_cfg.values())).size
                else:
                    existing_size = vectors_cfg.size if vectors_cfg else 0
                if existing_size != self.vector_size:
                    logger.warning(
                        f"Collection '{self.collection_name}' has wrong vector size "
                        f"({existing_size} != {self.vector_size}). Recreating..."
                    )
                    self.client.delete_collection(collection_name=self.collection_name)
                    collection_names.remove(self.collection_name)
                else:
                    logger.info(
                        f"Collection '{self.collection_name}' exists with correct size {existing_size}"
                    )

            if self.collection_name not in collection_names:
                logger.info(
                    f"Creating collection '{self.collection_name}' with vector size {self.vector_size}"
                )

                self.client.create_collection(
                    collection_name=self.collection_name,
                    vectors_config=VectorParams(
                        size=self.vector_size, distance=Distance.COSINE
                    ),
                )

                logger.info(f"Collection '{self.collection_name}' created successfully")

            # Ensure payload indexes exist for filterable fields
            for field in ["book_id", "chapter"]:
                try:
                    self.client.create_payload_index(
                        collection_name=self.collection_name,
                        field_name=field,
                        field_schema=PayloadSchemaType.KEYWORD,
                    )
                except Exception:
                    pass  # Index may already exist

        except Exception as e:
            logger.error(f"Failed to ensure collection: {e}")
            raise

    def search(
        self,
        query_vector: List[float],
        top_k: int = 20,
        score_threshold: Optional[float] = None,
        filters: Optional[Dict[str, Any]] = None,
    ) -> List[Dict[str, Any]]:
        """
        Search for similar vectors in the collection

        Args:
            query_vector: Query embedding vector
            top_k: Number of top results to return
            score_threshold: Minimum similarity score (0.0-1.0)
            filters: Optional metadata filters (e.g., {"book_id": "intro-to-ai"})

        Returns:
            List of search results with chunk_id, score, and metadata
        """
        try:
            # Build filter if provided
            query_filter = None
            if filters:
                conditions = []
                for key, value in filters.items():
                    conditions.append(
                        FieldCondition(key=key, match=MatchValue(value=value))
                    )
                if conditions:
                    query_filter = Filter(must=conditions)

            # Use query_points (qdrant-client >= 1.7)
            response = self.client.query_points(
                collection_name=self.collection_name,
                query=query_vector,
                query_filter=query_filter,
                limit=top_k,
                score_threshold=score_threshold,
                with_payload=True,
            )

            # Format results
            formatted_results = []
            for hit in response.points:
                formatted_results.append(
                    {
                        "chunk_id": str(hit.id),
                        "score": hit.score,
                        "text": hit.payload.get("text", ""),
                        "metadata": {
                            k: v
                            for k, v in hit.payload.items()
                            if k not in ["text", "embedding"]
                        },
                    }
                )

            logger.info(
                f"Search completed: {len(formatted_results)} results (threshold: {score_threshold})"
            )
            return formatted_results

        except Exception as e:
            logger.error(f"Search failed: {e}")
            raise

    def upsert_chunks(self, chunks: List[Dict[str, Any]]) -> int:
        """
        Insert or update chunks in the collection

        Args:
            chunks: List of chunk dictionaries with:
                - chunk_id: Unique identifier
                - embedding: Vector (list of floats)
                - text: Chunk text content
                - metadata: Additional metadata (book_id, chapter, page, etc.)

        Returns:
            Number of chunks upserted
        """
        try:
            points = []
            for chunk in chunks:
                point = PointStruct(
                    id=chunk["chunk_id"],
                    vector=chunk["embedding"],
                    payload={
                        "text": chunk["text"],
                        **chunk.get("metadata", {}),
                    },
                )
                points.append(point)

            self.client.upsert(collection_name=self.collection_name, points=points)

            logger.info(f"Upserted {len(points)} chunks to '{self.collection_name}'")
            return len(points)

        except Exception as e:
            logger.error(f"Upsert failed: {e}")
            raise

    def delete_chunks(self, chunk_ids: List[str]) -> int:
        """
        Delete chunks by IDs

        Args:
            chunk_ids: List of chunk IDs to delete

        Returns:
            Number of chunks deleted
        """
        try:
            self.client.delete(collection_name=self.collection_name, points_selector=chunk_ids)

            logger.info(f"Deleted {len(chunk_ids)} chunks from '{self.collection_name}'")
            return len(chunk_ids)

        except Exception as e:
            logger.error(f"Delete failed: {e}")
            raise

    def get_collection_info(self) -> Dict[str, Any]:
        """
        Get collection information

        Returns:
            Dictionary with collection stats
        """
        try:
            info = self.client.get_collection(collection_name=self.collection_name)

            vectors_cfg = info.config.params.vectors
            if isinstance(vectors_cfg, dict):
                first = next(iter(vectors_cfg.values()))
                vec_size = first.size
                vec_distance = first.distance.name
            else:
                vec_size = vectors_cfg.size if vectors_cfg else 0
                vec_distance = vectors_cfg.distance.name if vectors_cfg else "unknown"

            return {
                "collection_name": self.collection_name,
                "points_count": info.points_count,
                "vector_size": vec_size,
                "distance": vec_distance,
            }

        except Exception as e:
            logger.error(f"Failed to get collection info: {e}")
            raise


# Global Qdrant instance
_qdrant_instance: Optional[QdrantDB] = None


def get_qdrant() -> QdrantDB:
    """Get or create the global Qdrant instance"""
    global _qdrant_instance
    if _qdrant_instance is None:
        _qdrant_instance = QdrantDB()
    return _qdrant_instance
