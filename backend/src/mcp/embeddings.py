"""
Embeddings MCP Server
Provides embedding generation using Google Gemini API (google.genai SDK v1)
"""

import os
import time
from typing import List, Dict, Any
import logging

logger = logging.getLogger(__name__)


class EmbeddingsMCP:
    """MCP Server for embedding generation using Google Gemini"""

    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        self.model = os.getenv("GEMINI_EMBEDDING_MODEL", "gemini-embedding-001")

        if not self.api_key:
            raise ValueError("GEMINI_API_KEY environment variable not set")

        from google import genai
        self._client = genai.Client(api_key=self.api_key)

        logger.info(f"Embeddings MCP initialized (model: {self.model})")

    def _embed_one(self, text: str, task_type: str) -> List[float]:
        """
        Embed a single text with retry on transient errors.
        Returns the embedding vector (768 dims for text-embedding-004).
        """
        from google.genai import types

        last_error = None
        for attempt in range(3):
            try:
                result = self._client.models.embed_content(
                    model=self.model,
                    contents=text,
                    config=types.EmbedContentConfig(task_type=task_type),
                )
                return list(result.embeddings[0].values)
            except Exception as e:
                last_error = e
                if attempt < 2:
                    wait = 2 ** attempt  # 1s, 2s
                    logger.warning(
                        f"Gemini embedding attempt {attempt + 1}/3 failed "
                        f"({type(e).__name__}: {e}), retrying in {wait}s..."
                    )
                    time.sleep(wait)
                else:
                    logger.error(f"Gemini embedding failed after 3 attempts: {e}")

        raise ConnectionError(
            f"Gemini embedding API failed after 3 attempts: {last_error}"
        ) from last_error

    def generate_embedding(
        self, text: str, input_type: str = None
    ) -> Dict[str, Any]:
        """
        Generate embedding for single text

        Args:
            text: Input text
            input_type: "search_document" for indexing, "search_query" for queries

        Returns:
            Dict with embedding vector and metadata
        """
        task_type = (
            "RETRIEVAL_QUERY" if input_type == "search_query" else "RETRIEVAL_DOCUMENT"
        )
        embedding = self._embed_one(text, task_type)

        return {
            "embedding": embedding,
            "model": self.model,
            "input_type": input_type or "search_document",
            "dimensions": len(embedding),
        }

    def generate_embeddings_batch(
        self, texts: List[str], input_type: str = None
    ) -> List[Dict[str, Any]]:
        """
        Generate embeddings for multiple texts

        Args:
            texts: List of input texts
            input_type: "search_document" for indexing, "search_query" for queries

        Returns:
            List of dicts with embedding vectors
        """
        task_type = (
            "RETRIEVAL_QUERY" if input_type == "search_query" else "RETRIEVAL_DOCUMENT"
        )
        input_type_str = input_type or "search_document"

        all_results = []
        for i, text in enumerate(texts):
            if i % 50 == 0 and i > 0:
                logger.info(f"  Embedded {i}/{len(texts)} texts...")
            embedding = self._embed_one(text, task_type)
            all_results.append(
                {
                    "embedding": embedding,
                    "model": self.model,
                    "input_type": input_type_str,
                    "dimensions": len(embedding),
                }
            )

        logger.info(f"Generated {len(all_results)} embeddings")
        return all_results


# Global instance
_embeddings_mcp = None


def get_embeddings_mcp() -> EmbeddingsMCP:
    """Get or create global Embeddings MCP instance"""
    global _embeddings_mcp
    if _embeddings_mcp is None:
        _embeddings_mcp = EmbeddingsMCP()
    return _embeddings_mcp
