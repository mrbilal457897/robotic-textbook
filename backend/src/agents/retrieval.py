"""
Retrieval Agent
Handles vector search, chunk retrieval, and confidence scoring
"""

import os
from typing import List, Dict, Any, Optional
import logging

from ..mcp.embeddings import get_embeddings_mcp
from ..mcp.search import get_search_mcp
from ..mcp.metadata import get_metadata_mcp

logger = logging.getLogger(__name__)


class RetrievalAgent:
    """
    Retrieval Agent for RAG pipeline
    Performs vector search and chunk retrieval with confidence filtering
    """

    def __init__(self):
        self.embeddings_mcp = get_embeddings_mcp()
        self.search_mcp = get_search_mcp()
        self.metadata_mcp = get_metadata_mcp()

        # Ensure Qdrant collection exists (creates if missing, no-op if already exists)
        try:
            self.search_mcp.qdrant.ensure_collection()
        except Exception as e:
            logger.warning(f"Could not ensure Qdrant collection exists: {e}")

        # Configuration from environment
        self.top_k_candidates = int(os.getenv("RAG_TOP_K_CANDIDATES", "20"))
        self.top_k_final = int(os.getenv("RAG_TOP_K_FINAL", "5"))
        self.confidence_threshold = float(
            os.getenv("RAG_CONFIDENCE_THRESHOLD", "0.70")
        )
        self.enable_reranking = os.getenv("RAG_ENABLE_RERANKING", "false").lower() in (
            "true",
            "1",
            "yes",
        )

        logger.info(
            f"Retrieval Agent initialized (top_k: {self.top_k_candidates}, "
            f"threshold: {self.confidence_threshold}, reranking: {self.enable_reranking})"
        )

    def retrieve(
        self,
        query: str,
        mode: str,
        filters: Optional[Dict[str, Any]] = None,
        context_window: int = 0,
    ) -> Dict[str, Any]:
        """
        Retrieve relevant chunks for a query

        Args:
            query: User query text
            mode: Answering mode (book-only, selected-text-only, general-knowledge)
            filters: Metadata filters from Router Agent
            context_window: Number of surrounding chunks to include (0 = disabled)

        Returns:
            Retrieval result with chunks and metadata
        """
        logger.info(f"Retrieving chunks for query (mode: {mode})")

        # Step 1: Generate query embedding
        query_embedding = self._generate_query_embedding(query)

        # Step 2: Perform vector search
        search_results = self._vector_search(
            query_vector=query_embedding["embedding"],
            filters=filters,
            top_k=self.top_k_candidates,
        )

        logger.info(
            f"Vector search returned {len(search_results)} candidate chunks"
        )

        # Step 3: Apply mode-specific filtering
        filtered_chunks = self._apply_mode_filtering(
            chunks=search_results, mode=mode, filters=filters
        )

        logger.info(
            f"After mode filtering: {len(filtered_chunks)} chunks remain"
        )

        # Step 4: Rerank (optional)
        if self.enable_reranking and len(filtered_chunks) > self.top_k_final:
            reranked_chunks = self._rerank_chunks(query, filtered_chunks)
            logger.info(f"Reranked to top {len(reranked_chunks)} chunks")
        else:
            reranked_chunks = filtered_chunks[: self.top_k_final]

        # Step 5: Apply confidence threshold
        high_confidence_chunks = self._filter_by_confidence(
            reranked_chunks, threshold=self.confidence_threshold
        )

        logger.info(
            f"After confidence filtering: {len(high_confidence_chunks)} chunks above {self.confidence_threshold}"
        )

        # Step 6: Retrieve context (if requested)
        if context_window > 0 and high_confidence_chunks:
            chunk_ids = [chunk["chunk_id"] for chunk in high_confidence_chunks]
            chunks_with_context = self.metadata_mcp.get_chunks_with_context(
                chunk_ids=chunk_ids, context_window=context_window
            )
            logger.info(f"Retrieved context window of {context_window} chunks")
        else:
            chunks_with_context = [
                {"main_chunk": chunk, "context_before": [], "context_after": []}
                for chunk in high_confidence_chunks
            ]

        # Step 7: Build retrieval result
        retrieval_result = {
            "status": "success" if high_confidence_chunks else "no_results",
            "query": query,
            "mode": mode,
            "chunks": chunks_with_context,
            "metadata": {
                "candidates_found": len(search_results),
                "after_filtering": len(filtered_chunks),
                "after_confidence": len(high_confidence_chunks),
                "confidence_threshold": self.confidence_threshold,
                "reranking_enabled": self.enable_reranking,
                "context_window": context_window,
            },
        }

        # Add refusal reason if no results
        if not high_confidence_chunks:
            retrieval_result["refusal_reason"] = self._determine_refusal_reason(
                mode=mode,
                candidates_count=len(search_results),
                filtered_count=len(filtered_chunks),
            )

        return retrieval_result

    def _generate_query_embedding(self, query: str) -> Dict[str, Any]:
        """
        Generate embedding for query

        Args:
            query: User query text

        Returns:
            Embedding dict with vector and metadata
        """
        try:
            embedding_result = self.embeddings_mcp.generate_embedding(
                text=query, input_type="search_query"  # Query mode for Cohere
            )

            logger.debug(
                f"Generated query embedding: {embedding_result['dimensions']} dimensions"
            )

            return embedding_result

        except Exception as e:
            logger.error(f"Failed to generate query embedding: {e}")
            raise

    def _vector_search(
        self,
        query_vector: List[float],
        filters: Optional[Dict[str, Any]],
        top_k: int,
    ) -> List[Dict[str, Any]]:
        """
        Perform vector similarity search in Qdrant

        Args:
            query_vector: Query embedding vector
            filters: Metadata filters
            top_k: Number of candidates to retrieve

        Returns:
            List of search results
        """
        try:
            # Extract Qdrant-compatible filters
            qdrant_filters = self._build_qdrant_filters(filters)

            # Perform search
            results = self.search_mcp.search(
                query_vector=query_vector,
                top_k=top_k,
                filters=qdrant_filters,
                score_threshold=None,  # Apply threshold after mode filtering
            )

            return results

        except Exception as e:
            logger.error(f"Vector search failed: {e}")
            raise

    def _build_qdrant_filters(
        self, filters: Optional[Dict[str, Any]]
    ) -> Optional[Dict[str, Any]]:
        """
        Build Qdrant-compatible filters from Router Agent filters

        Args:
            filters: Filter dict from Router Agent

        Returns:
            Qdrant filter dict or None
        """
        if not filters:
            return None

        qdrant_filters = {}

        # Book ID filter
        if "book_id" in filters:
            qdrant_filters["book_id"] = filters["book_id"]

        # Chapter filter
        if "chapter" in filters:
            qdrant_filters["chapter"] = filters["chapter"]

        return qdrant_filters if qdrant_filters else None

    def _apply_mode_filtering(
        self,
        chunks: List[Dict[str, Any]],
        mode: str,
        filters: Optional[Dict[str, Any]],
    ) -> List[Dict[str, Any]]:
        """
        Apply mode-specific filtering to chunks

        Args:
            chunks: Search result chunks
            mode: Answering mode
            filters: Filters from Router Agent

        Returns:
            Filtered chunks
        """
        if mode == "selected-text-only":
            # For selected-text mode, filtering happens after retrieval
            # (matching selected text content)
            # This is handled by downstream Citation Agent
            logger.debug("Selected-text mode: deferring filtering to Citation Agent")
            return chunks

        elif mode == "book-only":
            # Already filtered by book_id in vector search
            # Additional validation: ensure all chunks have book_id
            filtered = [chunk for chunk in chunks if chunk.get("metadata", {}).get("book_id")]
            return filtered

        elif mode == "general-knowledge":
            # No filtering (allow all chunks)
            return chunks

        else:
            logger.warning(f"Unknown mode: {mode}, returning unfiltered chunks")
            return chunks

    def _rerank_chunks(
        self, query: str, chunks: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """
        Rerank chunks using cross-encoder (future implementation)

        Args:
            query: User query
            chunks: Candidate chunks

        Returns:
            Reranked chunks
        """
        # TODO: Implement cross-encoder reranking
        # For now, return chunks as-is (already sorted by cosine similarity)
        logger.warning("Reranking requested but not implemented; using vector scores")
        return chunks

    def _filter_by_confidence(
        self, chunks: List[Dict[str, Any]], threshold: float
    ) -> List[Dict[str, Any]]:
        """
        Filter chunks by confidence score

        Args:
            chunks: Candidate chunks with scores
            threshold: Minimum confidence threshold (0.0 - 1.0)

        Returns:
            High-confidence chunks
        """
        filtered = []

        for chunk in chunks:
            score = chunk.get("score", 0.0)

            # Validate confidence threshold (score from Qdrant is cosine similarity 0-1)
            if score >= threshold:
                filtered.append(chunk)
            else:
                logger.debug(
                    f"Chunk {chunk.get('chunk_id')} filtered out: score {score:.3f} < {threshold:.3f}"
                )

        return filtered

    def _determine_refusal_reason(
        self, mode: str, candidates_count: int, filtered_count: int
    ) -> str:
        """
        Determine why no results were found

        Args:
            mode: Answering mode
            candidates_count: Number of candidates before filtering
            filtered_count: Number after mode filtering

        Returns:
            Human-readable refusal reason
        """
        if candidates_count == 0:
            return "no_content_found"

        if filtered_count == 0:
            return "filtered_by_mode"

        return "below_confidence_threshold"

    def retrieve_by_book(
        self,
        query: str,
        book_id: str,
        chapter: Optional[str] = None,
        context_window: int = 0,
    ) -> Dict[str, Any]:
        """
        Convenience method: Retrieve chunks from a specific book

        Args:
            query: User query
            book_id: Book identifier
            chapter: Optional chapter filter
            context_window: Context window size

        Returns:
            Retrieval result
        """
        filters = {"book_id": book_id}
        if chapter:
            filters["chapter"] = chapter

        return self.retrieve(
            query=query,
            mode="book-only",
            filters=filters,
            context_window=context_window,
        )


# Global instance
_retrieval_agent = None


def get_retrieval_agent() -> RetrievalAgent:
    """Get or create global Retrieval Agent instance"""
    global _retrieval_agent
    if _retrieval_agent is None:
        _retrieval_agent = RetrievalAgent()
    return _retrieval_agent
