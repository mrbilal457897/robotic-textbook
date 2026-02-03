"""
Content Ingestion Service
PDF text extraction, semantic chunking, and metadata extraction
"""

import os
import re
from typing import List, Dict, Any, Optional, Tuple
from pathlib import Path
import logging

logger = logging.getLogger(__name__)


class ContentIngestionService:
    """Handles textbook content ingestion and chunking"""

    def __init__(self):
        # Chunking configuration from environment
        self.chunk_size_words = int(os.getenv("CHUNK_SIZE_WORDS", "750"))
        self.chunk_overlap_words = int(os.getenv("CHUNK_OVERLAP_WORDS", "100"))
        self.chunk_min_size = int(os.getenv("CHUNK_MIN_SIZE_WORDS", "200"))
        self.chunk_max_size = int(os.getenv("CHUNK_MAX_SIZE_WORDS", "1000"))

    # ============================================
    # PDF Text Extraction
    # ============================================

    def extract_text_from_pdf(self, pdf_path: str) -> List[Dict[str, Any]]:
        """
        Extract text from PDF with page-level metadata

        Args:
            pdf_path: Path to PDF file

        Returns:
            List of page dicts with text and metadata
        """
        try:
            import PyPDF2

            pages = []

            with open(pdf_path, "rb") as file:
                pdf_reader = PyPDF2.PdfReader(file)
                total_pages = len(pdf_reader.pages)

                logger.info(f"Extracting text from {pdf_path} ({total_pages} pages)")

                for page_num in range(total_pages):
                    page = pdf_reader.pages[page_num]
                    text = page.extract_text()

                    # Clean extracted text
                    text = self._clean_extracted_text(text)

                    pages.append(
                        {
                            "page_number": page_num + 1,
                            "text": text,
                            "char_count": len(text),
                            "word_count": len(text.split()),
                        }
                    )

                logger.info(
                    f"Extracted {len(pages)} pages, "
                    f"{sum(p['word_count'] for p in pages):,} words"
                )

            return pages

        except ImportError:
            logger.error("PyPDF2 not installed. Run: pip install PyPDF2")
            raise
        except Exception as e:
            logger.error(f"PDF extraction failed: {e}")
            raise

    def _clean_extracted_text(self, text: str) -> str:
        """
        Clean extracted PDF text

        Args:
            text: Raw extracted text

        Returns:
            Cleaned text
        """
        # Remove excessive whitespace
        text = re.sub(r"\s+", " ", text)

        # Remove page headers/footers (common patterns)
        text = re.sub(r"Page \d+ of \d+", "", text, flags=re.IGNORECASE)
        text = re.sub(r"^\d+\s*$", "", text, flags=re.MULTILINE)

        # Fix hyphenation across lines
        text = re.sub(r"(\w+)-\s+(\w+)", r"\1\2", text)

        return text.strip()

    # ============================================
    # Semantic Chunking
    # ============================================

    def create_semantic_chunks(
        self,
        pages: List[Dict[str, Any]],
        book_metadata: Dict[str, Any],
    ) -> List[Dict[str, Any]]:
        """
        Create semantic chunks from pages with metadata

        Args:
            pages: List of page dicts from extract_text_from_pdf
            book_metadata: Book metadata (title, authors, etc.)

        Returns:
            List of chunk dicts
        """
        chunks = []
        chunk_id = 0

        # Combine pages into continuous text
        full_text = "\n\n".join(page["text"] for page in pages)

        # Detect chapters and sections
        structure = self._detect_structure(full_text, pages)

        # Split text into sentences
        sentences = self._split_into_sentences(full_text)

        # Create chunks with overlap
        current_chunk = []
        current_word_count = 0
        current_page = 1
        current_chapter = structure.get("chapters", [{}])[0].get("title", "Introduction")

        for sentence in sentences:
            words = sentence.split()
            word_count = len(words)

            # Check if adding this sentence exceeds max size
            if current_word_count + word_count > self.chunk_max_size:
                # Save current chunk if it meets minimum size
                if current_word_count >= self.chunk_min_size:
                    chunk_text = " ".join(current_chunk)
                    chunks.append(
                        self._create_chunk_dict(
                            chunk_id=chunk_id,
                            text=chunk_text,
                            book_metadata=book_metadata,
                            chapter=current_chapter,
                            page=current_page,
                        )
                    )
                    chunk_id += 1

                    # Create overlap: keep last N words for next chunk
                    overlap_words = int(current_word_count * 0.15)  # 15% overlap
                    overlap_text = " ".join(current_chunk[-overlap_words:])
                    current_chunk = overlap_text.split()
                    current_word_count = len(current_chunk)

                else:
                    # Chunk too small, continue accumulating
                    current_chunk.extend(words)
                    current_word_count += word_count
            else:
                current_chunk.extend(words)
                current_word_count += word_count

            # Check if we've reached target chunk size
            if current_word_count >= self.chunk_size_words:
                chunk_text = " ".join(current_chunk)
                chunks.append(
                    self._create_chunk_dict(
                        chunk_id=chunk_id,
                        text=chunk_text,
                        book_metadata=book_metadata,
                        chapter=current_chapter,
                        page=current_page,
                    )
                )
                chunk_id += 1

                # Create overlap for next chunk
                overlap_words = self.chunk_overlap_words
                overlap_text = " ".join(current_chunk[-overlap_words:])
                current_chunk = overlap_text.split()
                current_word_count = len(current_chunk)

        # Add final chunk if remaining text meets minimum size
        if current_word_count >= self.chunk_min_size:
            chunk_text = " ".join(current_chunk)
            chunks.append(
                self._create_chunk_dict(
                    chunk_id=chunk_id,
                    text=chunk_text,
                    book_metadata=book_metadata,
                    chapter=current_chapter,
                    page=current_page,
                )
            )

        logger.info(
            f"Created {len(chunks)} chunks "
            f"(avg {sum(len(c['text'].split()) for c in chunks) // len(chunks)} words/chunk)"
        )

        return chunks

    def _split_into_sentences(self, text: str) -> List[str]:
        """
        Split text into sentences

        Args:
            text: Input text

        Returns:
            List of sentences
        """
        # Simple sentence splitting (handles common abbreviations)
        sentence_endings = re.compile(r"(?<!\w\.\w.)(?<![A-Z][a-z]\.)(?<=\.|\?|!)\s")
        sentences = sentence_endings.split(text)

        return [s.strip() for s in sentences if s.strip()]

    def _detect_structure(
        self, full_text: str, pages: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Detect document structure (chapters, sections)

        Args:
            full_text: Full document text
            pages: Page metadata

        Returns:
            Structure dict with chapters and sections
        """
        structure = {"chapters": [], "sections": []}

        # Detect chapters (common patterns)
        chapter_pattern = re.compile(
            r"^(Chapter\s+\d+|CHAPTER\s+\d+|Section\s+\d+)[\s:.]+(.+)$",
            re.MULTILINE | re.IGNORECASE,
        )

        for match in chapter_pattern.finditer(full_text):
            structure["chapters"].append(
                {"title": match.group(0).strip(), "position": match.start()}
            )

        if not structure["chapters"]:
            # Default chapter if none detected
            structure["chapters"].append({"title": "Main Content", "position": 0})

        logger.info(f"Detected {len(structure['chapters'])} chapters")

        return structure

    def _create_chunk_dict(
        self,
        chunk_id: int,
        text: str,
        book_metadata: Dict[str, Any],
        chapter: str,
        page: int,
    ) -> Dict[str, Any]:
        """
        Create chunk dictionary with metadata

        Args:
            chunk_id: Chunk identifier
            text: Chunk text
            book_metadata: Book metadata
            chapter: Chapter name
            page: Page number

        Returns:
            Chunk dict
        """
        return {
            "chunk_id": f"{book_metadata['book_id']}_chunk_{chunk_id:05d}",
            "text": text,
            "word_count": len(text.split()),
            "char_count": len(text),
            "metadata": {
                "book_id": book_metadata["book_id"],
                "book_title": book_metadata.get("title", ""),
                "authors": book_metadata.get("authors", []),
                "chapter": chapter,
                "page": page,
                "chunk_index": chunk_id,
            },
        }

    # ============================================
    # Chunk Quality Validation
    # ============================================

    def validate_chunk_quality(self, chunks: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Validate chunk quality metrics

        Args:
            chunks: List of chunks

        Returns:
            Validation report dict
        """
        if not chunks:
            return {"valid": False, "error": "No chunks provided"}

        # Calculate metrics
        word_counts = [chunk["word_count"] for chunk in chunks]
        avg_word_count = sum(word_counts) / len(word_counts)
        min_word_count = min(word_counts)
        max_word_count = max(word_counts)

        # Validation checks
        issues = []

        # Check minimum size
        too_small = [c for c in chunks if c["word_count"] < self.chunk_min_size]
        if too_small:
            issues.append(
                f"{len(too_small)} chunks below minimum size ({self.chunk_min_size} words)"
            )

        # Check maximum size
        too_large = [c for c in chunks if c["word_count"] > self.chunk_max_size]
        if too_large:
            issues.append(
                f"{len(too_large)} chunks exceed maximum size ({self.chunk_max_size} words)"
            )

        # Check for empty chunks
        empty_chunks = [c for c in chunks if not c["text"].strip()]
        if empty_chunks:
            issues.append(f"{len(empty_chunks)} empty chunks detected")

        # Check for duplicate chunks
        unique_texts = set(c["text"] for c in chunks)
        if len(unique_texts) < len(chunks):
            issues.append(
                f"{len(chunks) - len(unique_texts)} duplicate chunks detected"
            )

        report = {
            "valid": len(issues) == 0,
            "total_chunks": len(chunks),
            "avg_word_count": round(avg_word_count, 1),
            "min_word_count": min_word_count,
            "max_word_count": max_word_count,
            "issues": issues,
        }

        if report["valid"]:
            logger.info(f"Chunk quality validation passed: {report}")
        else:
            logger.warning(f"Chunk quality issues detected: {report}")

        return report


# Global ingestion service instance
_ingestion_service: Optional[ContentIngestionService] = None


def get_ingestion_service() -> ContentIngestionService:
    """Get or create the global ingestion service instance"""
    global _ingestion_service
    if _ingestion_service is None:
        _ingestion_service = ContentIngestionService()
    return _ingestion_service
