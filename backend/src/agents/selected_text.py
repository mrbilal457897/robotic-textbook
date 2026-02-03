"""
Selected-Text Agent
Handles highlight-to-ask queries by processing highlighted text directly without vector search
"""

import re
import logging
from typing import Dict, Any, Optional, List

logger = logging.getLogger(__name__)


class TextAction(str):
    """Available text actions for selected text"""

    EXPLAIN = "explain"
    SUMMARIZE = "summarize"
    EXAMPLE = "example"
    SIMPLIFY = "simplify"


class SelectedTextAgent:
    """
    Selected-Text Agent for RAG pipeline
    Processes highlighted text without vector search, ensuring strict scope isolation
    """

    def __init__(self):
        # Token estimation (rough): ~4 characters per token
        self.chars_per_token = 4
        self.min_tokens = 50
        self.max_tokens = 4000
        self.min_chars = self.min_tokens * self.chars_per_token  # 200 chars
        self.max_chars = self.max_tokens * self.chars_per_token  # 16000 chars

        logger.info(
            f"Selected-Text Agent initialized (min: {self.min_tokens} tokens, "
            f"max: {self.max_tokens} tokens)"
        )

    def process_selection(
        self,
        query: str,
        selected_text: str,
        action: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """
        Process highlighted text query

        Args:
            query: User query about the selected text
            selected_text: Highlighted text passage
            action: Optional action (explain, summarize, example, simplify)
            metadata: Optional metadata (book_id, chapter, page)

        Returns:
            Processing result with formatted context for Response Agent

        Raises:
            ValueError: If selection validation fails
        """
        logger.info(
            f"Processing selected text (length: {len(selected_text)} chars, action: {action})"
        )

        # Step 1: Validate selection
        validation_result = self.validate_selection(selected_text)

        if not validation_result["is_valid"]:
            logger.warning(
                f"Selection validation failed: {validation_result['error']}"
            )
            return {
                "status": "validation_error",
                "error": validation_result["error"],
                "error_code": validation_result["error_code"],
                "selected_text": selected_text,
                "query": query,
            }

        # Step 2: Estimate token count
        token_count = self._estimate_tokens(selected_text)

        # Step 3: Check context sufficiency
        context_sufficiency = self._check_context_sufficiency(
            query=query, selected_text=selected_text, action=action
        )

        if not context_sufficiency["is_sufficient"]:
            logger.warning(
                f"Insufficient context: {context_sufficiency['reason']}"
            )
            return {
                "status": "insufficient_context",
                "reason": context_sufficiency["reason"],
                "suggestion": context_sufficiency["suggestion"],
                "selected_text": selected_text,
                "query": query,
                "token_count": token_count,
            }

        # Step 4: Format context for Response Agent
        formatted_context = self._format_context(
            selected_text=selected_text, metadata=metadata
        )

        # Step 5: Determine effective action
        effective_action = action or self._infer_action_from_query(query)

        logger.info(
            f"Selected text processing successful (tokens: {token_count}, action: {effective_action})"
        )

        return {
            "status": "success",
            "context": formatted_context,
            "query": query,
            "action": effective_action,
            "token_count": token_count,
            "selected_text": selected_text,
            "metadata": metadata or {},
            "mode": "selected-text-only",
            "bypass_vector_search": True,  # CRITICAL: Flag to skip retrieval
        }

    def validate_selection(self, selected_text: str) -> Dict[str, Any]:
        """
        Validate selected text meets requirements

        Args:
            selected_text: Text to validate

        Returns:
            Validation result with is_valid flag and error details
        """
        # Check if empty
        if not selected_text or not selected_text.strip():
            return {
                "is_valid": False,
                "error": "No text selected. Please highlight a text passage first.",
                "error_code": "EMPTY_SELECTION",
            }

        # Estimate token count
        token_count = self._estimate_tokens(selected_text)

        # Check minimum length
        if token_count < self.min_tokens:
            return {
                "is_valid": False,
                "error": f"Selected text is too short (minimum: {self.min_tokens} tokens, ~{self.min_chars} characters). Please select a longer passage.",
                "error_code": "SELECTION_TOO_SHORT",
                "token_count": token_count,
            }

        # Check maximum length
        if token_count > self.max_tokens:
            return {
                "is_valid": False,
                "error": f"Selected text is too long (maximum: {self.max_tokens} tokens, ~{self.max_chars} characters). Please select a shorter passage.",
                "error_code": "SELECTION_TOO_LONG",
                "token_count": token_count,
            }

        # Check for suspicious content
        if self._contains_suspicious_content(selected_text):
            return {
                "is_valid": False,
                "error": "Selected text contains invalid characters or formatting. Please select plain text.",
                "error_code": "INVALID_CONTENT",
            }

        return {
            "is_valid": True,
            "token_count": token_count,
            "char_count": len(selected_text),
        }

    def _estimate_tokens(self, text: str) -> int:
        """
        Estimate token count from text

        Args:
            text: Input text

        Returns:
            Estimated token count
        """
        # Rough estimation: 1 token ≈ 4 characters
        # More accurate for English text would use tiktoken, but this is sufficient
        char_count = len(text)
        token_estimate = char_count / self.chars_per_token

        return int(token_estimate)

    def _check_context_sufficiency(
        self, query: str, selected_text: str, action: Optional[str]
    ) -> Dict[str, Any]:
        """
        Determine if selected text provides sufficient context to answer query

        Args:
            query: User query
            selected_text: Highlighted text
            action: Optional action

        Returns:
            Sufficiency result with is_sufficient flag and reasoning
        """
        # Extract keywords from query
        query_keywords = self._extract_keywords(query)

        # Check if selected text contains query-related terms
        text_lower = selected_text.lower()
        query_lower = query.lower()

        # Rule 1: If query asks about specific terms, check if they appear in selection
        definition_patterns = [
            r"\bwhat is\b",
            r"\bwhat are\b",
            r"\bdefine\b",
            r"\bdefinition\b",
        ]

        is_definition_query = any(
            re.search(pattern, query_lower) for pattern in definition_patterns
        )

        if is_definition_query:
            # Extract subject of definition query
            for keyword in query_keywords:
                if keyword.lower() not in text_lower and len(keyword) > 3:
                    return {
                        "is_sufficient": False,
                        "reason": f"The selected text does not contain information about '{keyword}'",
                        "suggestion": "Try selecting a passage that explicitly discusses this topic, or switch to Book-Only mode.",
                    }

        # Rule 2: Check if selection is just a single sentence for complex queries
        sentence_count = len(
            [s for s in re.split(r"[.!?]+", selected_text) if s.strip()]
        )

        if sentence_count == 1 and len(query.split()) > 5:
            # Complex query with single sentence selection
            if action not in ["summarize", "simplify"]:
                return {
                    "is_sufficient": False,
                    "reason": "The selected text is too brief to answer this question comprehensively",
                    "suggestion": "Try selecting a longer passage with more context, or switch to Book-Only mode.",
                }

        # Rule 3: For "example" action, check if text contains examples
        if action == "example":
            example_indicators = [
                "for example",
                "for instance",
                "such as",
                "e.g.",
                "consider",
                "imagine",
            ]
            has_examples = any(
                indicator in text_lower for indicator in example_indicators
            )

            if not has_examples and sentence_count < 3:
                return {
                    "is_sufficient": False,
                    "reason": "The selected text does not contain examples",
                    "suggestion": "Try selecting a passage with examples, or switch to Book-Only mode for broader examples.",
                }

        # Default: Assume sufficient context
        return {
            "is_sufficient": True,
            "reason": "Selected text appears to contain relevant context",
        }

    def _extract_keywords(self, query: str) -> List[str]:
        """
        Extract meaningful keywords from query

        Args:
            query: User query

        Returns:
            List of keywords
        """
        # Remove common stop words
        stop_words = {
            "what",
            "is",
            "are",
            "the",
            "a",
            "an",
            "in",
            "on",
            "at",
            "to",
            "for",
            "of",
            "and",
            "or",
            "but",
            "this",
            "that",
            "these",
            "those",
            "explain",
            "summarize",
            "simplify",
            "give",
            "me",
        }

        # Tokenize and filter
        words = re.findall(r"\b\w+\b", query.lower())
        keywords = [w for w in words if w not in stop_words and len(w) > 2]

        return keywords

    def _contains_suspicious_content(self, text: str) -> bool:
        """
        Check for suspicious or invalid content

        Args:
            text: Text to check

        Returns:
            True if suspicious content detected
        """
        # Check for excessive control characters (except newlines, tabs)
        control_char_count = sum(
            1 for c in text if ord(c) < 32 and c not in ["\n", "\r", "\t"]
        )

        if control_char_count > len(text) * 0.01:  # More than 1% control chars
            return True

        # Check for script injection patterns
        injection_patterns = [
            r"<\s*script\s*>",
            r"javascript:",
            r"onerror\s*=",
            r"onclick\s*=",
        ]

        text_lower = text.lower()
        for pattern in injection_patterns:
            if re.search(pattern, text_lower):
                logger.warning(f"Suspicious content detected: {pattern}")
                return True

        return False

    def _format_context(
        self, selected_text: str, metadata: Optional[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """
        Format selected text as context for Response Agent

        Args:
            selected_text: Text to format
            metadata: Optional metadata

        Returns:
            Formatted context dict compatible with Response Agent
        """
        # Create pseudo-chunk structure compatible with Response Agent
        chunk = {
            "chunk_id": "selected_text",
            "text": selected_text,
            "score": 1.0,  # Perfect match (user explicitly selected this)
            "metadata": metadata or {},
            "source": "user_selection",
        }

        # Format as single-chunk context (no before/after context needed)
        formatted_context = [
            {
                "main_chunk": chunk,
                "context_before": [],
                "context_after": [],
            }
        ]

        return formatted_context

    def _infer_action_from_query(self, query: str) -> str:
        """
        Infer action from query text if not explicitly provided

        Args:
            query: User query

        Returns:
            Inferred action (explain, summarize, example, simplify)
        """
        query_lower = query.lower()

        # Check for action keywords
        if any(kw in query_lower for kw in ["summarize", "summary", "tldr"]):
            return TextAction.SUMMARIZE

        if any(
            kw in query_lower for kw in ["example", "examples", "show me", "illustrate"]
        ):
            return TextAction.EXAMPLE

        if any(
            kw in query_lower
            for kw in ["simplify", "simpler", "easier", "eli5", "simple terms"]
        ):
            return TextAction.SIMPLIFY

        # Default: Explain
        return TextAction.EXPLAIN


# Global instance
_selected_text_agent = None


def get_selected_text_agent() -> SelectedTextAgent:
    """Get or create global Selected-Text Agent instance"""
    global _selected_text_agent
    if _selected_text_agent is None:
        _selected_text_agent = SelectedTextAgent()
    return _selected_text_agent
