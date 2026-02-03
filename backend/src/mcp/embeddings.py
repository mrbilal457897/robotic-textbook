"""
Embeddings MCP Server
Provides embedding generation using Cohere API
"""

import os
from typing import List, Dict, Any
import logging

logger = logging.getLogger(__name__)


class EmbeddingsMCP:
    """MCP Server for embedding generation"""

    def __init__(self):
        self.api_key = os.getenv("COHERE_API_KEY")
        self.model = os.getenv("COHERE_EMBEDDING_MODEL", "embed-english-v3.0")
        self.input_type = os.getenv("COHERE_INPUT_TYPE", "search_document")

        if not self.api_key:
            raise ValueError("COHERE_API_KEY environment variable not set")

        logger.info(f"Embeddings MCP initialized (model: {self.model})")

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
        try:
            import cohere

            co = cohere.Client(self.api_key)

            # Use provided input_type or default
            input_type_to_use = input_type or self.input_type

            response = co.embed(
                texts=[text], model=self.model, input_type=input_type_to_use
            )

            embedding = response.embeddings[0]

            return {
                "embedding": embedding,
                "model": self.model,
                "input_type": input_type_to_use,
                "dimensions": len(embedding),
            }

        except ImportError:
            logger.error("cohere package not installed. Run: pip install cohere")
            raise
        except Exception as e:
            logger.error(f"Embedding generation failed: {e}")
            raise

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
        try:
            import cohere

            co = cohere.Client(self.api_key)

            # Use provided input_type or default
            input_type_to_use = input_type or self.input_type

            # Cohere limit: 96 texts per request
            batch_size = 96
            all_results = []

            for i in range(0, len(texts), batch_size):
                batch = texts[i : i + batch_size]

                response = co.embed(
                    texts=batch, model=self.model, input_type=input_type_to_use
                )

                for embedding in response.embeddings:
                    all_results.append(
                        {
                            "embedding": embedding,
                            "model": self.model,
                            "input_type": input_type_to_use,
                            "dimensions": len(embedding),
                        }
                    )

            logger.info(f"Generated {len(all_results)} embeddings")

            return all_results

        except ImportError:
            logger.error("cohere package not installed. Run: pip install cohere")
            raise
        except Exception as e:
            logger.error(f"Batch embedding generation failed: {e}")
            raise


# Global instance
_embeddings_mcp = None


def get_embeddings_mcp() -> EmbeddingsMCP:
    """Get or create global Embeddings MCP instance"""
    global _embeddings_mcp
    if _embeddings_mcp is None:
        _embeddings_mcp = EmbeddingsMCP()
    return _embeddings_mcp
