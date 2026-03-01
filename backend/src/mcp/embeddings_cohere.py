"""
Cohere Embeddings MCP Server
Provides embedding generation using Cohere API
USE THIS INSTEAD OF GEMINI IF GEMINI KEY IS LEAKED
"""

import os
import time
from typing import List, Dict, Any
import logging

logger = logging.getLogger(__name__)


class CohereEmbeddingsMCP:
    """MCP Server for embedding generation using Cohere"""

    def __init__(self):
        self.api_key = os.getenv("COHERE_API_KEY")
        self.model = os.getenv("COHERE_EMBEDDING_MODEL", "embed-english-v3.0")
        self.input_type = os.getenv("COHERE_INPUT_TYPE", "search_document")

        if not self.api_key:
            raise ValueError("COHERE_API_KEY environment variable not set")

        import cohere
        self._client = cohere.ClientV2(api_key=self.api_key)

        logger.info(f"Cohere Embeddings MCP initialized (model: {self.model})")

    def _embed_one(self, text: str, task_type: str) -> List[float]:
        """
        Embed a single text with retry on transient errors.
        Returns the embedding vector (1024 dims for embed-english-v3.0).
        """
        # Map task types
        input_type_map = {
            "RETRIEVAL_QUERY": "search_query",
            "RETRIEVAL_DOCUMENT": "search_document",
            "SEMANTIC_SIMILARITY": "search_document",
            "CLASSIFICATION": "classification",
            "CLUSTERING": "clustering",
        }
        cohere_input_type = input_type_map.get(task_type, "search_document")

        last_error = None
        for attempt in range(3):
            try:
                result = self._client.embed(
                    model=self.model,
                    texts=[text],
                    input_type=cohere_input_type,
                    embedding_types=["float"],
                )
                return result.embeddings.float_[0]
            except Exception as e:
                last_error = e
                if attempt < 2:
                    wait = 2 ** attempt  # 1s, 2s
                    logger.warning(
                        f"Cohere embedding attempt {attempt + 1}/3 failed "
                        f"({type(e).__name__}: {str(e)}), retrying in {wait}s..."
                    )
                    time.sleep(wait)

        # Failed after retries
        logger.error(
            f"Cohere embedding failed after 3 attempts: {type(last_error).__name__}: {str(last_error)}"
        )
        raise ConnectionError(
            f"Cohere embedding API failed after 3 attempts: "
            f"{type(last_error).__name__}: {str(last_error)}"
        ) from last_error

    def generate_embedding(
        self, text: str, task_type: str = "RETRIEVAL_DOCUMENT"
    ) -> Dict[str, Any]:
        """
        Generate an embedding for the given text.

        Args:
            text: Text to embed
            task_type: One of RETRIEVAL_QUERY, RETRIEVAL_DOCUMENT, SEMANTIC_SIMILARITY,
                      CLASSIFICATION, CLUSTERING

        Returns:
            Dict with 'embedding' (list of floats) and 'model' (str)
        """
        if not text or not text.strip():
            raise ValueError("Text cannot be empty")

        embedding = self._embed_one(text, task_type)

        return {
            "embedding": embedding,
            "model": self.model,
            "dimensions": len(embedding),
        }

    def generate_embeddings_batch(
        self, texts: List[str], task_type: str = "RETRIEVAL_DOCUMENT"
    ) -> Dict[str, Any]:
        """
        Generate embeddings for multiple texts.

        Args:
            texts: List of texts to embed
            task_type: Embedding task type

        Returns:
            Dict with 'embeddings' (list of lists) and 'model' (str)
        """
        if not texts:
            raise ValueError("Texts list cannot be empty")

        # Cohere supports batch embedding
        input_type_map = {
            "RETRIEVAL_QUERY": "search_query",
            "RETRIEVAL_DOCUMENT": "search_document",
            "SEMANTIC_SIMILARITY": "search_document",
            "CLASSIFICATION": "classification",
            "CLUSTERING": "clustering",
        }
        cohere_input_type = input_type_map.get(task_type, "search_document")

        try:
            result = self._client.embed(
                model=self.model,
                texts=texts,
                input_type=cohere_input_type,
                embedding_types=["float"],
            )

            embeddings = result.embeddings.float_

            return {
                "embeddings": embeddings,
                "model": self.model,
                "count": len(embeddings),
                "dimensions": len(embeddings[0]) if embeddings else 0,
            }
        except Exception as e:
            logger.error(f"Batch embedding failed: {e}")
            raise ConnectionError(f"Cohere batch embedding failed: {str(e)}") from e
