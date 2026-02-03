"""
Citation Agent
Validates and formats citations in RAG responses
"""

import re
from typing import List, Dict, Any, Optional
import logging

from ..mcp.metadata import get_metadata_mcp

logger = logging.getLogger(__name__)


class CitationAgent:
    """
    Citation Agent for RAG pipeline
    Validates citations and ensures proper source attribution
    """

    def __init__(self):
        self.metadata_mcp = get_metadata_mcp()
        logger.info("Citation Agent initialized")

    def validate_citations(
        self,
        response_text: str,
        source_chunks: List[Dict[str, Any]],
        mode: str,
    ) -> Dict[str, Any]:
        """
        Validate that all citations in response match source chunks

        Args:
            response_text: Generated response text
            source_chunks: Chunks used to generate response
            mode: Answering mode

        Returns:
            Validation result with valid/invalid citations
        """
        logger.info(f"Validating citations (mode: {mode})")

        # Extract citation IDs from response
        cited_ids = self._extract_citation_ids(response_text)

        # Build source chunk ID set
        source_ids = set()
        for chunk_data in source_chunks:
            main_chunk = chunk_data.get("main_chunk", chunk_data)
            chunk_id = main_chunk.get("chunk_id")
            if chunk_id:
                source_ids.add(chunk_id)

        # Validate each citation
        valid_citations = []
        invalid_citations = []

        for cited_id in cited_ids:
            if cited_id in source_ids:
                valid_citations.append(cited_id)
            else:
                invalid_citations.append(cited_id)
                logger.warning(f"Invalid citation detected: {cited_id}")

        # Calculate coverage
        citation_coverage = (
            len(cited_ids) / len(source_ids) if source_ids else 0.0
        )

        validation_result = {
            "valid": len(invalid_citations) == 0,
            "total_citations": len(cited_ids),
            "valid_citations": valid_citations,
            "invalid_citations": invalid_citations,
            "citation_coverage": round(citation_coverage, 2),
            "source_chunks": len(source_ids),
        }

        logger.info(
            f"Citation validation: {len(valid_citations)} valid, {len(invalid_citations)} invalid"
        )

        return validation_result

    def format_citations(
        self,
        citations: List[Dict[str, Any]],
        format_style: str = "inline",
    ) -> List[Dict[str, Any]]:
        """
        Format citations according to specified style

        Args:
            citations: List of citation dicts
            format_style: Citation format (inline, footnote, endnote)

        Returns:
            Formatted citations
        """
        formatted_citations = []

        for i, citation in enumerate(citations):
            chunk_id = citation.get("chunk_id")
            book_id = citation.get("book_id")
            chapter = citation.get("chapter")
            page = citation.get("page")

            if format_style == "inline":
                # Format: [chunk_id]
                display = f"[{chunk_id}]"

            elif format_style == "footnote":
                # Format: [1], [2], etc.
                display = f"[{i+1}]"

            elif format_style == "endnote":
                # Format: [Book: Chapter X, Page Y]
                display = f"[{book_id}"
                if chapter:
                    display += f": Ch{chapter}"
                if page:
                    display += f", p{page}"
                display += "]"

            else:
                # Default to inline
                display = f"[{chunk_id}]"

            formatted_citation = {
                **citation,
                "display": display,
                "index": i + 1,
            }

            formatted_citations.append(formatted_citation)

        logger.info(f"Formatted {len(formatted_citations)} citations ({format_style})")

        return formatted_citations

    def enrich_citations(
        self, citations: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """
        Enrich citations with additional metadata from Qdrant

        Args:
            citations: List of citation dicts

        Returns:
            Enriched citations with full metadata
        """
        chunk_ids = [c["chunk_id"] for c in citations if c.get("chunk_id")]

        if not chunk_ids:
            return citations

        # Batch fetch metadata
        try:
            metadata_list = self.metadata_mcp.get_batch_metadata(chunk_ids)

            # Create lookup
            metadata_lookup = {m["chunk_id"]: m for m in metadata_list}

            # Enrich citations
            enriched_citations = []
            for citation in citations:
                chunk_id = citation.get("chunk_id")

                if chunk_id and chunk_id in metadata_lookup:
                    full_metadata = metadata_lookup[chunk_id]

                    enriched_citation = {
                        **citation,
                        "full_text": full_metadata.get("text", ""),
                        "metadata": full_metadata.get("metadata", {}),
                    }

                    enriched_citations.append(enriched_citation)
                else:
                    enriched_citations.append(citation)

            logger.info(f"Enriched {len(enriched_citations)} citations")

            return enriched_citations

        except Exception as e:
            logger.error(f"Failed to enrich citations: {e}")
            return citations

    def verify_selected_text_constraint(
        self,
        response_text: str,
        selected_text: str,
        citations: List[Dict[str, Any]],
    ) -> Dict[str, Any]:
        """
        Verify that response respects selected-text-only constraint

        Args:
            response_text: Generated response
            selected_text: User-selected text
            citations: Citations in response

        Returns:
            Verification result
        """
        logger.info("Verifying selected-text-only constraint")

        # Check if citations reference only selected text chunks
        # This requires matching citation text against selected_text

        violations = []

        for citation in citations:
            citation_text = citation.get("text", "")

            # Check if citation text appears in selected text
            if citation_text and citation_text not in selected_text:
                violations.append(
                    {
                        "chunk_id": citation.get("chunk_id"),
                        "reason": "citation_outside_selected_text",
                    }
                )

        verification_result = {
            "valid": len(violations) == 0,
            "violations": violations,
            "selected_text_length": len(selected_text),
            "response_length": len(response_text),
        }

        if violations:
            logger.warning(
                f"Selected-text constraint violations: {len(violations)}"
            )

        return verification_result

    def detect_hallucination(
        self,
        response_text: str,
        source_chunks: List[Dict[str, Any]],
    ) -> Dict[str, Any]:
        """
        Detect potential hallucination in response

        Args:
            response_text: Generated response
            source_chunks: Source chunks

        Returns:
            Hallucination detection result
        """
        logger.info("Running hallucination detection")

        # Build source text corpus
        source_text = ""
        for chunk_data in source_chunks:
            main_chunk = chunk_data.get("main_chunk", chunk_data)
            source_text += main_chunk.get("text", "") + " "

        # Simple heuristic checks
        issues = []

        # Check 1: Response contains uncited facts (sentences without citations)
        sentences = self._split_into_sentences(response_text)
        uncited_sentences = []

        for sentence in sentences:
            # Skip if sentence has citation
            if not re.search(r"\[[a-zA-Z0-9_-]+\]", sentence):
                # Check if sentence is question or meta-text
                if not self._is_meta_sentence(sentence):
                    uncited_sentences.append(sentence)

        if uncited_sentences:
            issues.append(
                {
                    "type": "uncited_claims",
                    "count": len(uncited_sentences),
                    "examples": uncited_sentences[:3],
                }
            )

        # Check 2: Response significantly longer than source (possible elaboration)
        if len(response_text) > len(source_text) * 1.5:
            issues.append(
                {
                    "type": "excessive_elaboration",
                    "response_length": len(response_text),
                    "source_length": len(source_text),
                }
            )

        hallucination_result = {
            "detected": len(issues) > 0,
            "issues": issues,
            "confidence": 1.0 - (len(issues) * 0.2),  # Reduce confidence per issue
        }

        if issues:
            logger.warning(f"Hallucination detected: {len(issues)} issues")

        return hallucination_result

    def _extract_citation_ids(self, text: str) -> List[str]:
        """
        Extract citation IDs from text

        Args:
            text: Text containing citations

        Returns:
            List of unique citation IDs
        """
        citation_pattern = r"\[([a-zA-Z0-9_-]+)\]"
        matches = re.findall(citation_pattern, text)

        # Return unique IDs (preserve order)
        seen = set()
        unique_ids = []
        for match in matches:
            if match not in seen:
                unique_ids.append(match)
                seen.add(match)

        return unique_ids

    def _split_into_sentences(self, text: str) -> List[str]:
        """
        Split text into sentences

        Args:
            text: Input text

        Returns:
            List of sentences
        """
        # Simple sentence splitting
        sentence_pattern = r"[.!?]+\s+"
        sentences = re.split(sentence_pattern, text)

        # Filter empty sentences
        return [s.strip() for s in sentences if s.strip()]

    def _is_meta_sentence(self, sentence: str) -> bool:
        """
        Check if sentence is meta-text (questions, transitions)

        Args:
            sentence: Input sentence

        Returns:
            True if meta-text
        """
        meta_patterns = [
            r"^\s*Question:",
            r"^\s*Answer:",
            r"^\s*In summary",
            r"^\s*To summarize",
            r"^\s*Let me explain",
            r"^\s*I couldn't find",
        ]

        for pattern in meta_patterns:
            if re.search(pattern, sentence, re.IGNORECASE):
                return True

        return False


# Global instance
_citation_agent = None


def get_citation_agent() -> CitationAgent:
    """Get or create global Citation Agent instance"""
    global _citation_agent
    if _citation_agent is None:
        _citation_agent = CitationAgent()
    return _citation_agent
