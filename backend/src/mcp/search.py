"""
Search MCP Server
Provides vector search operations using Qdrant with Postgres full-text search fallback
"""

import os
from typing import List, Dict, Any, Optional
import logging

from ..db.qdrant import get_qdrant
from ..db.postgres import get_db

logger = logging.getLogger(__name__)


class SearchMCP:
    """
    MCP Server for vector search operations with graceful degradation

    Primary: Qdrant vector search
    Fallback: Postgres full-text search
    """

    def __init__(self):
        self.qdrant = get_qdrant()
        self.postgres = get_db()
        self.default_top_k = int(os.getenv("RAG_TOP_K_CANDIDATES", "20"))
        self.similarity_threshold = float(
            os.getenv("RAG_SIMILARITY_THRESHOLD", "0.70")
        )
        self.enable_fallback = os.getenv("ENABLE_POSTGRES_FALLBACK", "true").lower() == "true"

        logger.info(
            f"Search MCP initialized (top_k: {self.default_top_k}, fallback: {self.enable_fallback})"
        )

    def search(
        self,
        query_vector: List[float],
        top_k: Optional[int] = None,
        filters: Optional[Dict[str, Any]] = None,
        score_threshold: Optional[float] = None,
        query_text: Optional[str] = None,
    ) -> List[Dict[str, Any]]:
        """
        Perform vector similarity search with automatic fallback to full-text search

        Args:
            query_vector: Query embedding vector
            top_k: Number of results to return (default from config)
            filters: Optional metadata filters (e.g., {"book_id": "intro-ai"})
            score_threshold: Minimum similarity score (default from config)
            query_text: Original query text (required for fallback)

        Returns:
            List of search results with chunks and scores
        """
        top_k = top_k or self.default_top_k
        score_threshold = score_threshold or self.similarity_threshold

        try:
            results = self.qdrant.search(
                query_vector=query_vector,
                top_k=top_k,
                filters=filters,
                score_threshold=score_threshold,
            )

            logger.info(
                f"Vector search completed: {len(results)} results "
                f"(top_k={top_k}, threshold={score_threshold})"
            )

            return results

        except Exception as e:
            logger.error(f"Vector search failed: {e}")

            # Attempt fallback to Postgres full-text search
            if self.enable_fallback and query_text:
                logger.warning("Falling back to Postgres full-text search")
                try:
                    return self._postgres_fallback_search(
                        query_text=query_text,
                        top_k=top_k,
                        filters=filters,
                    )
                except Exception as fallback_error:
                    logger.error(f"Fallback search also failed: {fallback_error}")

            # If fallback is disabled or failed, re-raise original error
            raise

    def _postgres_fallback_search(
        self,
        query_text: str,
        top_k: int,
        filters: Optional[Dict[str, Any]] = None,
    ) -> List[Dict[str, Any]]:
        """
        Fallback search using Postgres full-text search

        Args:
            query_text: Original query text
            top_k: Number of results to return
            filters: Optional metadata filters

        Returns:
            List of search results (formatted to match vector search output)
        """
        # Build WHERE clause for filters
        where_clauses = []
        params = [query_text]  # $1 is the query text

        if filters:
            if "book_id" in filters:
                where_clauses.append("metadata->>'book_id' = %s")
                params.append(filters["book_id"])

            if "chapter" in filters:
                where_clauses.append("metadata->>'chapter' = %s")
                params.append(filters["chapter"])

        where_clause = " AND " + " AND ".join(where_clauses) if where_clauses else ""

        # Postgres full-text search query
        # Uses tsvector for text indexing and tsquery for search
        query = f"""
        SELECT
            chunk_id,
            text,
            metadata,
            ts_rank(to_tsvector('english', text), plainto_tsquery('english', %s)) as score
        FROM
            chunks
        WHERE
            to_tsvector('english', text) @@ plainto_tsquery('english', %s)
            {where_clause}
        ORDER BY
            score DESC
        LIMIT %s
        """

        # Add query_text twice (for ts_rank and WHERE clause)
        search_params = [query_text, query_text] + params[1:] + [top_k]

        try:
            rows = self.postgres.execute_query(
                query=query,
                params=tuple(search_params),
                fetch_all=True,
                return_dict=True,
            )

            # Format results to match vector search output
            results = []
            for row in rows:
                results.append({
                    "chunk_id": row["chunk_id"],
                    "text": row["text"],
                    "metadata": row["metadata"],
                    "score": float(row["score"]),
                    "is_fallback": True,  # Mark as fallback result
                })

            logger.info(
                f"Postgres fallback search completed: {len(results)} results (degraded mode)"
            )

            return results

        except Exception as e:
            logger.error(f"Postgres fallback search failed: {e}")
            raise

    def search_by_book(
        self,
        query_vector: List[float],
        book_id: str,
        top_k: Optional[int] = None,
        score_threshold: Optional[float] = None,
        query_text: Optional[str] = None,
    ) -> List[Dict[str, Any]]:
        """
        Search within a specific book

        Args:
            query_vector: Query embedding vector
            book_id: Book identifier to filter by
            top_k: Number of results
            score_threshold: Minimum similarity score
            query_text: Original query text (for fallback)

        Returns:
            List of search results from the specified book
        """
        filters = {"book_id": book_id}

        return self.search(
            query_vector=query_vector,
            top_k=top_k,
            filters=filters,
            score_threshold=score_threshold,
            query_text=query_text,
        )

    def search_by_chapter(
        self,
        query_vector: List[float],
        book_id: str,
        chapter: str,
        top_k: Optional[int] = None,
        score_threshold: Optional[float] = None,
        query_text: Optional[str] = None,
    ) -> List[Dict[str, Any]]:
        """
        Search within a specific chapter

        Args:
            query_vector: Query embedding vector
            book_id: Book identifier
            chapter: Chapter name/number
            top_k: Number of results
            score_threshold: Minimum similarity score
            query_text: Original query text (for fallback)

        Returns:
            List of search results from the specified chapter
        """
        filters = {"book_id": book_id, "chapter": chapter}

        return self.search(
            query_vector=query_vector,
            top_k=top_k,
            filters=filters,
            score_threshold=score_threshold,
            query_text=query_text,
        )

    def get_collection_stats(self) -> Dict[str, Any]:
        """
        Get collection statistics

        Returns:
            Dict with collection info
        """
        try:
            stats = self.qdrant.get_collection_info()
            return stats

        except Exception as e:
            logger.error(f"Failed to get collection stats: {e}")
            raise


# Global instance
_search_mcp = None


def get_search_mcp() -> SearchMCP:
    """Get or create global Search MCP instance"""
    global _search_mcp
    if _search_mcp is None:
        _search_mcp = SearchMCP()
    return _search_mcp
