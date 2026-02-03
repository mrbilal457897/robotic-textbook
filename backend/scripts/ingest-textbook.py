#!/usr/bin/env python3
"""
Textbook Ingestion Script
Extracts text from PDF, creates semantic chunks, generates embeddings, and uploads to Qdrant

Usage:
    python backend/scripts/ingest-textbook.py --pdf path/to/textbook.pdf --book-id intro-ai
    python backend/scripts/ingest-textbook.py --pdf textbook.pdf --book-id ml-basics --title "Machine Learning Basics"
    python backend/scripts/ingest-textbook.py --pdf textbook.pdf --book-id ai --validate-only
"""

import os
import sys
import argparse
import json
from pathlib import Path
from typing import List, Dict, Any
import logging

# Setup logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Add parent directories to path
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

# Load .env
env_path = backend_dir / ".env"
if env_path.exists():
    with open(env_path) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, value = line.split("=", 1)
                os.environ.setdefault(key.strip(), value.strip())

# Import after environment is loaded
from src.services.ingestion import get_ingestion_service
from src.db.qdrant import get_qdrant


class TextbookIngestion:
    """Manages end-to-end textbook ingestion pipeline"""

    def __init__(self):
        self.ingestion_service = get_ingestion_service()
        self.qdrant = get_qdrant()
        self.cohere_api_key = os.getenv("COHERE_API_KEY")
        self.embedding_model = os.getenv("COHERE_EMBEDDING_MODEL", "embed-english-v3.0")

        if not self.cohere_api_key:
            raise ValueError("COHERE_API_KEY not set in environment")

    def ingest_pdf(
        self,
        pdf_path: str,
        book_id: str,
        book_title: str,
        authors: List[str] = None,
        validate_only: bool = False,
    ) -> Dict[str, Any]:
        """
        Complete ingestion pipeline

        Args:
            pdf_path: Path to PDF file
            book_id: Unique book identifier
            book_title: Book title
            authors: List of author names
            validate_only: If True, only validate chunks without uploading

        Returns:
            Ingestion result dict
        """
        logger.info("=" * 70)
        logger.info("TEXTBOOK INGESTION PIPELINE")
        logger.info("=" * 70)
        logger.info(f"Book ID: {book_id}")
        logger.info(f"PDF: {pdf_path}")
        logger.info(f"Validate only: {validate_only}")
        logger.info("")

        # Step 1: Extract text from PDF
        logger.info("Step 1: Extracting text from PDF...")
        pages = self.ingestion_service.extract_text_from_pdf(pdf_path)
        logger.info(f"✓ Extracted {len(pages)} pages")
        logger.info("")

        # Step 2: Create semantic chunks
        logger.info("Step 2: Creating semantic chunks...")
        book_metadata = {
            "book_id": book_id,
            "title": book_title,
            "authors": authors or [],
        }

        chunks = self.ingestion_service.create_semantic_chunks(pages, book_metadata)
        logger.info(f"✓ Created {len(chunks)} chunks")
        logger.info("")

        # Step 3: Validate chunk quality
        logger.info("Step 3: Validating chunk quality...")
        validation_report = self.ingestion_service.validate_chunk_quality(chunks)

        if validation_report["valid"]:
            logger.info("✓ Chunk quality validation passed")
        else:
            logger.warning("⚠ Chunk quality issues detected:")
            for issue in validation_report["issues"]:
                logger.warning(f"  - {issue}")

        logger.info(f"  Total chunks: {validation_report['total_chunks']}")
        logger.info(f"  Avg word count: {validation_report['avg_word_count']}")
        logger.info(f"  Min word count: {validation_report['min_word_count']}")
        logger.info(f"  Max word count: {validation_report['max_word_count']}")
        logger.info("")

        # Manual review recommendation
        if len(chunks) > 50:
            sample_size = 100
            logger.info(
                f"Recommendation: Manually review {sample_size} random chunks for quality"
            )
            logger.info(
                f"  Sample chunk IDs: {', '.join(c['chunk_id'] for c in chunks[:5])}"
            )
            logger.info("")

        if validate_only:
            logger.info("Validation complete (upload skipped)")
            return {
                "status": "validated",
                "chunks_created": len(chunks),
                "validation": validation_report,
            }

        # Step 4: Generate embeddings
        logger.info("Step 4: Generating embeddings...")
        chunks_with_embeddings = self._generate_embeddings(chunks)
        logger.info(f"✓ Generated {len(chunks_with_embeddings)} embeddings")
        logger.info("")

        # Step 5: Upload to Qdrant
        logger.info("Step 5: Uploading to Qdrant...")
        self.qdrant.ensure_collection()
        uploaded_count = self.qdrant.upsert_chunks(chunks_with_embeddings)
        logger.info(f"✓ Uploaded {uploaded_count} chunks to Qdrant")
        logger.info("")

        # Final summary
        logger.info("=" * 70)
        logger.info("INGESTION COMPLETE")
        logger.info("=" * 70)
        logger.info(f"Book ID: {book_id}")
        logger.info(f"Total chunks: {len(chunks)}")
        logger.info(f"Uploaded to Qdrant: {uploaded_count}")
        logger.info("")

        return {
            "status": "success",
            "book_id": book_id,
            "pages_extracted": len(pages),
            "chunks_created": len(chunks),
            "chunks_uploaded": uploaded_count,
            "validation": validation_report,
        }

    def _generate_embeddings(self, chunks: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Generate embeddings for all chunks using Cohere

        Args:
            chunks: List of chunk dicts

        Returns:
            Chunks with embeddings added
        """
        try:
            import cohere

            co = cohere.Client(self.cohere_api_key)

            # Extract texts
            texts = [chunk["text"] for chunk in chunks]

            # Generate embeddings in batches (Cohere limit: 96 texts per request)
            batch_size = 96
            all_embeddings = []

            for i in range(0, len(texts), batch_size):
                batch = texts[i : i + batch_size]
                logger.info(
                    f"  Generating embeddings for chunks {i+1}-{min(i+batch_size, len(texts))}..."
                )

                response = co.embed(
                    texts=batch,
                    model=self.embedding_model,
                    input_type="search_document",  # For indexing
                )

                all_embeddings.extend(response.embeddings)

            # Add embeddings to chunks
            for chunk, embedding in zip(chunks, all_embeddings):
                chunk["embedding"] = embedding

            return chunks

        except ImportError:
            logger.error("cohere package not installed. Run: pip install cohere")
            raise
        except Exception as e:
            logger.error(f"Embedding generation failed: {e}")
            raise


def main():
    parser = argparse.ArgumentParser(description="Ingest textbook PDF into RAG system")

    parser.add_argument("--pdf", required=True, help="Path to PDF file")
    parser.add_argument("--book-id", required=True, help="Unique book identifier")
    parser.add_argument("--title", help="Book title (default: filename)")
    parser.add_argument(
        "--authors", help="Comma-separated list of authors (default: empty)"
    )
    parser.add_argument(
        "--validate-only",
        action="store_true",
        help="Only validate chunks without uploading",
    )
    parser.add_argument(
        "--output-json", help="Save ingestion report to JSON file (optional)"
    )

    args = parser.parse_args()

    # Validate PDF exists
    pdf_path = Path(args.pdf)
    if not pdf_path.exists():
        logger.error(f"PDF file not found: {args.pdf}")
        sys.exit(1)

    # Parse book metadata
    book_title = args.title if args.title else pdf_path.stem
    authors = [a.strip() for a in args.authors.split(",")] if args.authors else []

    # Run ingestion
    try:
        ingestion = TextbookIngestion()

        result = ingestion.ingest_pdf(
            pdf_path=str(pdf_path),
            book_id=args.book_id,
            book_title=book_title,
            authors=authors,
            validate_only=args.validate_only,
        )

        # Save report if requested
        if args.output_json:
            with open(args.output_json, "w") as f:
                json.dump(result, f, indent=2)
            logger.info(f"Report saved to: {args.output_json}")

        sys.exit(0)

    except Exception as e:
        logger.error(f"Ingestion failed: {e}", exc_info=True)
        sys.exit(1)


if __name__ == "__main__":
    main()
