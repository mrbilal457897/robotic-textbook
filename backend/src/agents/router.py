"""
Router Agent
Handles intent detection, mode determination, and request routing for RAG pipeline
"""

import re
from typing import Dict, Any, Optional, List
from enum import Enum
import logging

logger = logging.getLogger(__name__)


class AnsweringMode(str, Enum):
    """Answering modes with strict knowledge boundary enforcement"""

    BOOK_ONLY = "book-only"
    SELECTED_TEXT_ONLY = "selected-text-only"
    GENERAL_KNOWLEDGE = "general-knowledge"


class QueryIntent(str, Enum):
    """Detected query intents"""

    QUESTION = "question"
    DEFINITION = "definition"
    EXAMPLE = "example"
    EXPLANATION = "explanation"
    SUMMARY = "summary"
    SIMPLIFY = "simplify"
    COMPARISON = "comparison"


class RouterAgent:
    """
    Router Agent for RAG pipeline
    Determines answering mode and detects intent
    """

    def __init__(self):
        self.definition_keywords = [
            "what is",
            "what are",
            "define",
            "definition of",
            "meaning of",
            "explain what",
        ]

        self.example_keywords = [
            "example",
            "examples",
            "give me an example",
            "show me",
            "demonstrate",
            "illustrate",
        ]

        self.summary_keywords = [
            "summarize",
            "summary",
            "briefly",
            "in short",
            "tldr",
            "key points",
        ]

        self.simplify_keywords = [
            "simplify",
            "simpler",
            "easier",
            "explain like",
            "eli5",
            "in simple terms",
        ]

        self.comparison_keywords = [
            "compare",
            "difference between",
            "versus",
            "vs",
            "contrast",
            "similar",
        ]

        logger.info("Router Agent initialized")

    def route_request(
        self,
        query: str,
        mode: Optional[AnsweringMode] = None,
        selected_text: Optional[str] = None,
        book_id: Optional[str] = None,
        chapter: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Route a user request through the RAG pipeline

        Args:
            query: User query text
            mode: Explicit answering mode (if specified by user)
            selected_text: Highlighted text (if any)
            book_id: Book identifier for filtering
            chapter: Chapter identifier for filtering

        Returns:
            Routing decision dict with mode, intent, filters, and metadata
        """
        # Step 1: Determine mode
        determined_mode = self._determine_mode(mode, selected_text)

        # Step 2: Detect intent
        detected_intent = self._detect_intent(query, selected_text)

        # Step 3: Normalize query
        normalized_query = self._normalize_query(query)

        # Step 4: Apply constraints
        filters = self._build_filters(
            mode=determined_mode,
            book_id=book_id,
            chapter=chapter,
            selected_text=selected_text,
        )

        # Step 5: Build routing decision
        routing_decision = {
            "mode": determined_mode.value,
            "intent": detected_intent.value,
            "query": {
                "original": query,
                "normalized": normalized_query,
            },
            "filters": filters,
            "metadata": {
                "has_selected_text": selected_text is not None,
                "book_id": book_id,
                "chapter": chapter,
            },
        }

        logger.info(
            f"Routing decision: mode={determined_mode.value}, intent={detected_intent.value}"
        )

        return routing_decision

    def _determine_mode(
        self, explicit_mode: Optional[AnsweringMode], selected_text: Optional[str]
    ) -> AnsweringMode:
        """
        Determine answering mode based on context

        Priority:
        1. Selected-Text-Only if text is highlighted
        2. Explicit mode from user
        3. Book-Only (default)
        """
        if selected_text:
            return AnsweringMode.SELECTED_TEXT_ONLY

        if explicit_mode:
            return explicit_mode

        return AnsweringMode.BOOK_ONLY

    def _detect_intent(
        self, query: str, selected_text: Optional[str] = None
    ) -> QueryIntent:
        """
        Detect user intent from query text

        Args:
            query: User query
            selected_text: Highlighted text (affects intent detection)

        Returns:
            Detected QueryIntent
        """
        query_lower = query.lower().strip()

        # Priority 1: Definition keywords
        if any(kw in query_lower for kw in self.definition_keywords):
            return QueryIntent.DEFINITION

        # Priority 2: Simplify keywords (often explicit)
        if any(kw in query_lower for kw in self.simplify_keywords):
            return QueryIntent.SIMPLIFY

        # Priority 3: Summary keywords
        if any(kw in query_lower for kw in self.summary_keywords):
            return QueryIntent.SUMMARY

        # Priority 4: Example keywords
        if any(kw in query_lower for kw in self.example_keywords):
            return QueryIntent.EXAMPLE

        # Priority 5: Comparison keywords
        if any(kw in query_lower for kw in self.comparison_keywords):
            return QueryIntent.COMPARISON

        # Priority 6: Explanation (default for "explain", "why", "how")
        explanation_patterns = [r"\bexplain\b", r"\bhow\b", r"\bwhy\b"]
        if any(re.search(pattern, query_lower) for pattern in explanation_patterns):
            return QueryIntent.EXPLANATION

        # Default: Generic question
        return QueryIntent.QUESTION

    def _normalize_query(self, query: str) -> str:
        """
        Normalize query text for processing

        Steps:
        - Strip leading/trailing whitespace
        - Normalize multiple spaces to single space
        - Remove control characters
        - Preserve punctuation and case
        """
        # Remove control characters
        query = re.sub(r"[\x00-\x1f\x7f-\x9f]", "", query)

        # Normalize whitespace
        query = re.sub(r"\s+", " ", query)

        # Strip edges
        query = query.strip()

        return query

    def _build_filters(
        self,
        mode: AnsweringMode,
        book_id: Optional[str],
        chapter: Optional[str],
        selected_text: Optional[str],
    ) -> Dict[str, Any]:
        """
        Build metadata filters for vector search

        Args:
            mode: Answering mode
            book_id: Book identifier
            chapter: Chapter identifier
            selected_text: Highlighted text

        Returns:
            Filter dict for Qdrant
        """
        filters = {}

        if mode == AnsweringMode.BOOK_ONLY:
            # Filter by book_id (required for book-only mode)
            if book_id:
                filters["book_id"] = book_id

            # Optional chapter filter
            if chapter:
                filters["chapter"] = chapter

        elif mode == AnsweringMode.SELECTED_TEXT_ONLY:
            # For selected text mode, downstream agent will handle text matching
            # No vector search filters needed (text matching happens after retrieval)
            filters["selected_text_mode"] = True
            filters["selected_text_length"] = (
                len(selected_text) if selected_text else 0
            )

        elif mode == AnsweringMode.GENERAL_KNOWLEDGE:
            # No filters for general mode (allows external knowledge)
            # Optionally filter by book_id if provided for textbook-first approach
            if book_id:
                filters["book_id"] = book_id
            filters["allow_external"] = True

        return filters

    def validate_request(
        self,
        query: str,
        selected_text: Optional[str] = None,
        max_query_length: int = 2000,
        max_selected_text_length: int = 8000,
    ) -> tuple[bool, Optional[str]]:
        """
        Validate request parameters

        Args:
            query: User query
            selected_text: Highlighted text
            max_query_length: Maximum query length
            max_selected_text_length: Maximum selected text length

        Returns:
            (is_valid, error_message)
        """
        # Check query length
        if not query or len(query.strip()) == 0:
            return (False, "Query cannot be empty")

        if len(query) > max_query_length:
            return (
                False,
                f"Query exceeds maximum length of {max_query_length} characters",
            )

        # Check selected text length
        if selected_text and len(selected_text) > max_selected_text_length:
            return (
                False,
                f"Selected text exceeds maximum length of {max_selected_text_length} characters",
            )

        # Check for prompt injection patterns
        if self._detect_prompt_injection(query):
            return (False, "Invalid query: potential prompt injection detected")

        return (True, None)

    def _detect_prompt_injection(self, text: str) -> bool:
        """
        Detect potential prompt injection attempts

        Returns:
            True if injection detected, False otherwise
        """
        injection_patterns = [
            r"ignore\s+(all\s+)?(previous|above)\s+instructions",
            r"disregard\s+(all\s+)?(previous|prior)\s+instructions",
            r"<\s*script\s*>",
            r"system\s*:\s*you\s+are",
            r"new\s+instructions?:",
        ]

        text_lower = text.lower()

        for pattern in injection_patterns:
            if re.search(pattern, text_lower):
                logger.warning(f"Prompt injection detected: pattern={pattern}")
                return True

        return False

    def validate_mode_boundary(
        self,
        current_mode: AnsweringMode,
        requested_mode: Optional[AnsweringMode],
        selected_text: Optional[str] = None,
        has_book_context: bool = True,
    ) -> Dict[str, Any]:
        """
        Validate mode boundary constraints and mode switching

        Args:
            current_mode: Current answering mode
            requested_mode: User-requested mode (if switching)
            selected_text: Highlighted text (if any)
            has_book_context: Whether book context is available

        Returns:
            Validation result dict with:
            - is_valid: bool
            - mode: validated mode to use
            - warnings: list of warning messages
            - suggestion: optional suggestion for better mode
        """
        warnings = []
        suggestion = None

        # Determine the mode to use
        if selected_text:
            # Selected text overrides all other modes
            mode_to_use = AnsweringMode.SELECTED_TEXT_ONLY
            if requested_mode and requested_mode != AnsweringMode.SELECTED_TEXT_ONLY:
                warnings.append(
                    "Selected text detected. Overriding requested mode to Selected-Text-Only."
                )
        elif requested_mode:
            mode_to_use = requested_mode
        else:
            mode_to_use = current_mode

        # Validate mode-specific constraints
        if mode_to_use == AnsweringMode.SELECTED_TEXT_ONLY:
            if not selected_text:
                return {
                    "is_valid": False,
                    "mode": AnsweringMode.BOOK_ONLY,
                    "warnings": [
                        "Selected-Text mode requires highlighted text. Falling back to Book-Only mode."
                    ],
                    "suggestion": "Please highlight text in the textbook to use Selected-Text mode.",
                }

        elif mode_to_use == AnsweringMode.BOOK_ONLY:
            if not has_book_context:
                warnings.append(
                    "Book-Only mode requires book context. If the question is not in the textbook, consider switching to General Knowledge mode."
                )
                suggestion = (
                    "💡 Tip: Use General Knowledge mode to supplement textbook content with broader context."
                )

        elif mode_to_use == AnsweringMode.GENERAL_KNOWLEDGE:
            # Warn about using general knowledge mode
            if current_mode != AnsweringMode.GENERAL_KNOWLEDGE:
                warnings.append(
                    "General Knowledge mode will combine textbook content with external knowledge. "
                    "Answers will be labeled to distinguish [Textbook] from [General Knowledge] sources."
                )

        return {
            "is_valid": True,
            "mode": mode_to_use,
            "warnings": warnings,
            "suggestion": suggestion,
        }

    def suggest_mode_switch(
        self,
        query: str,
        current_mode: AnsweringMode,
        retrieval_confidence: float,
        has_results: bool,
    ) -> Optional[Dict[str, Any]]:
        """
        Suggest mode switch based on query and retrieval results

        Args:
            query: User query
            current_mode: Current answering mode
            retrieval_confidence: Confidence score from retrieval
            has_results: Whether retrieval found results

        Returns:
            Mode switch suggestion dict or None if no switch needed
        """
        query_lower = query.lower()

        # Book-Only mode with no results → suggest General Knowledge
        if current_mode == AnsweringMode.BOOK_ONLY and not has_results:
            return {
                "suggested_mode": AnsweringMode.GENERAL_KNOWLEDGE,
                "reason": "No textbook content found for this query.",
                "prompt": "💡 Would you like to switch to **General Knowledge mode** to get an answer based on broader knowledge sources?",
            }

        # Book-Only mode with low confidence → suggest General Knowledge
        if (
            current_mode == AnsweringMode.BOOK_ONLY
            and has_results
            and retrieval_confidence < 0.60
        ):
            return {
                "suggested_mode": AnsweringMode.GENERAL_KNOWLEDGE,
                "reason": "Textbook content has low confidence for this query.",
                "prompt": "💡 The textbook has limited information on this topic. Would you like to switch to **General Knowledge mode** for additional context?",
            }

        # General Knowledge mode with high textbook confidence → suggest Book-Only
        if (
            current_mode == AnsweringMode.GENERAL_KNOWLEDGE
            and has_results
            and retrieval_confidence >= 0.85
        ):
            # Detect queries asking for examples or real-world applications
            real_world_keywords = [
                "real-world",
                "practical",
                "industry",
                "application",
                "use case",
                "in practice",
            ]
            if not any(kw in query_lower for kw in real_world_keywords):
                return {
                    "suggested_mode": AnsweringMode.BOOK_ONLY,
                    "reason": "The textbook has comprehensive information on this topic.",
                    "prompt": "💡 This question is well-covered in the textbook. Would you like to use **Book-Only mode** for a focused answer?",
                }

        # No suggestion needed
        return None


# Global instance
_router_agent = None


def get_router_agent() -> RouterAgent:
    """Get or create global Router Agent instance"""
    global _router_agent
    if _router_agent is None:
        _router_agent = RouterAgent()
    return _router_agent
