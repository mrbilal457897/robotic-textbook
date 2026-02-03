"""
General Knowledge Agent
Implements dual-pass approach: textbook retrieval + general knowledge augmentation
"""

import os
import logging
from typing import List, Dict, Any, Optional
import google.generativeai as genai

from .retrieval import get_retrieval_agent
from .response import get_response_agent

logger = logging.getLogger(__name__)


class SourceType(str):
    """Source types for attribution"""

    TEXTBOOK = "textbook"
    GENERAL_KNOWLEDGE = "general_knowledge"


class GeneralKnowledgeAgent:
    """
    General Knowledge Agent for RAG pipeline
    Uses dual-pass approach: textbook-first, then augment with external knowledge
    """

    def __init__(self):
        self.retrieval_agent = get_retrieval_agent()
        self.response_agent = get_response_agent()

        # Gemini configuration
        self.gemini_api_key = os.getenv("GEMINI_API_KEY")
        self.model_name = os.getenv("GEMINI_MODEL", "gemini-2.0-flash-exp")

        if self.gemini_api_key:
            genai.configure(api_key=self.gemini_api_key)

        # Configuration
        self.textbook_weight = 0.7  # Prioritize textbook content
        self.general_weight = 0.3
        self.min_textbook_confidence = float(
            os.getenv("GK_MIN_TEXTBOOK_CONFIDENCE", "0.60")
        )

        logger.info(
            f"General Knowledge Agent initialized (textbook weight: {self.textbook_weight})"
        )

    def generate_answer(
        self,
        query: str,
        book_id: Optional[str] = None,
        chapter: Optional[str] = None,
        tone: str = "academic",
        intent: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Generate answer using dual-pass approach

        Args:
            query: User query
            book_id: Optional book filter
            chapter: Optional chapter filter
            tone: Response tone
            intent: Query intent

        Returns:
            Combined answer with source attribution
        """
        logger.info(f"Generating dual-pass answer for query: {query[:50]}...")

        # Pass 1: Retrieve from textbook
        textbook_result = self._first_pass_textbook(
            query=query, book_id=book_id, chapter=chapter
        )

        # Pass 2: Augment with general knowledge if needed
        combined_result = self._second_pass_general(
            query=query,
            textbook_result=textbook_result,
            tone=tone,
            intent=intent,
        )

        return combined_result

    def _first_pass_textbook(
        self,
        query: str,
        book_id: Optional[str],
        chapter: Optional[str],
    ) -> Dict[str, Any]:
        """
        First pass: Retrieve from textbook only

        Args:
            query: User query
            book_id: Book identifier
            chapter: Chapter identifier

        Returns:
            Textbook retrieval result
        """
        logger.info("Pass 1: Retrieving from textbook")

        # Build filters
        filters = {}
        if book_id:
            filters["book_id"] = book_id
        if chapter:
            filters["chapter"] = chapter

        # Retrieve from textbook
        retrieval_result = self.retrieval_agent.retrieve(
            query=query,
            mode="book-only",
            filters=filters,
            context_window=0,  # No context window for general mode
        )

        logger.info(
            f"Pass 1 complete: {len(retrieval_result.get('chunks', []))} chunks retrieved"
        )

        return retrieval_result

    def _second_pass_general(
        self,
        query: str,
        textbook_result: Dict[str, Any],
        tone: str,
        intent: Optional[str],
    ) -> Dict[str, Any]:
        """
        Second pass: Combine textbook results with general knowledge

        Args:
            query: User query
            textbook_result: First pass result
            tone: Response tone
            intent: Query intent

        Returns:
            Combined result with source labels
        """
        logger.info("Pass 2: Augmenting with general knowledge")

        # Extract textbook chunks
        textbook_chunks = textbook_result.get("chunks", [])
        has_textbook_content = len(textbook_chunks) > 0

        # Determine if we need general knowledge
        need_general_knowledge = self._should_use_general_knowledge(
            query=query,
            textbook_chunks=textbook_chunks,
            textbook_status=textbook_result.get("status"),
        )

        if not need_general_knowledge:
            # Pure textbook answer (textbook has sufficient content)
            logger.info("Textbook content sufficient; skipping general knowledge")
            return self._generate_textbook_only_response(
                query=query,
                chunks=textbook_chunks,
                tone=tone,
                intent=intent,
            )

        # Generate combined response
        if has_textbook_content:
            # Partial textbook + general knowledge
            logger.info("Combining textbook content with general knowledge")
            return self._generate_hybrid_response(
                query=query,
                textbook_chunks=textbook_chunks,
                tone=tone,
                intent=intent,
            )
        else:
            # Pure general knowledge (no textbook content found)
            logger.info("No textbook content; using pure general knowledge")
            return self._generate_general_only_response(
                query=query,
                tone=tone,
                intent=intent,
            )

    def _should_use_general_knowledge(
        self,
        query: str,
        textbook_chunks: List[Dict[str, Any]],
        textbook_status: str,
    ) -> bool:
        """
        Determine if general knowledge should be used

        Args:
            query: User query
            textbook_chunks: Retrieved textbook chunks
            textbook_status: Retrieval status

        Returns:
            True if general knowledge should be used
        """
        # No textbook content found
        if textbook_status == "no_results" or len(textbook_chunks) == 0:
            logger.debug("No textbook content → use general knowledge")
            return True

        # Low confidence textbook results
        avg_confidence = sum(
            chunk.get("main_chunk", chunk).get("score", 0.0)
            for chunk in textbook_chunks
        ) / len(textbook_chunks)

        if avg_confidence < self.min_textbook_confidence:
            logger.debug(
                f"Low textbook confidence ({avg_confidence:.2f}) → use general knowledge"
            )
            return True

        # Textbook content is sufficient
        return False

    def _generate_textbook_only_response(
        self,
        query: str,
        chunks: List[Dict[str, Any]],
        tone: str,
        intent: Optional[str],
    ) -> Dict[str, Any]:
        """
        Generate response from textbook only

        Args:
            query: User query
            chunks: Textbook chunks
            tone: Response tone
            intent: Query intent

        Returns:
            Response dict
        """
        # Use Response Agent to generate answer
        response = self.response_agent.generate_response(
            query=query,
            chunks=chunks,
            mode="book-only",
            tone=tone,
            intent=intent,
        )

        # Add source labeling
        labeled_answer = self._label_textbook_source(response["answer"])

        return {
            **response,
            "answer": labeled_answer,
            "mode": "general-knowledge",  # Mode is general, but answer is textbook-only
            "has_external_knowledge": False,
            "source_breakdown": {
                "textbook_sections": 1,
                "general_sections": 0,
            },
        }

    def _generate_hybrid_response(
        self,
        query: str,
        textbook_chunks: List[Dict[str, Any]],
        tone: str,
        intent: Optional[str],
    ) -> Dict[str, Any]:
        """
        Generate hybrid response (textbook + general knowledge)

        Args:
            query: User query
            textbook_chunks: Textbook chunks
            tone: Response tone
            intent: Query intent

        Returns:
            Hybrid response dict
        """
        # Generate textbook section
        textbook_response = self.response_agent.generate_response(
            query=query,
            chunks=textbook_chunks,
            mode="book-only",
            tone=tone,
            intent=intent,
        )

        # Generate general knowledge section
        general_section = self._generate_general_section(
            query=query,
            textbook_answer=textbook_response["answer"],
            tone=tone,
        )

        # Combine sections with clear labels
        combined_answer = self._combine_sections(
            textbook_section=textbook_response["answer"],
            general_section=general_section,
        )

        return {
            "status": "success",
            "answer": combined_answer,
            "citations": textbook_response.get("citations", []),
            "confidence_score": textbook_response.get("confidence_score", 0.0),
            "mode": "general-knowledge",
            "tone": tone,
            "chunks_used": len(textbook_chunks),
            "has_external_knowledge": True,
            "source_breakdown": {
                "textbook_sections": 1,
                "general_sections": 1,
            },
            "disclaimer": "This answer combines textbook content with general knowledge. Textbook sections are marked with [Textbook] and general knowledge with [General Knowledge].",
        }

    def _generate_general_only_response(
        self,
        query: str,
        tone: str,
        intent: Optional[str],
    ) -> Dict[str, Any]:
        """
        Generate response from general knowledge only

        Args:
            query: User query
            tone: Response tone
            intent: Query intent

        Returns:
            General knowledge response dict
        """
        # Generate answer using Gemini (no textbook context)
        general_answer = self._generate_general_section(
            query=query,
            textbook_answer=None,
            tone=tone,
        )

        # Label as general knowledge
        labeled_answer = self._label_general_source(general_answer)

        return {
            "status": "success",
            "answer": labeled_answer,
            "citations": [],
            "confidence_score": 0.0,  # No textbook grounding
            "mode": "general-knowledge",
            "tone": tone,
            "chunks_used": 0,
            "has_external_knowledge": True,
            "source_breakdown": {
                "textbook_sections": 0,
                "general_sections": 1,
            },
            "disclaimer": "This answer is based on general knowledge only. No textbook content was found for this query. Consider rephrasing your question or switching to Book-Only mode.",
        }

    def _generate_general_section(
        self,
        query: str,
        textbook_answer: Optional[str],
        tone: str,
    ) -> str:
        """
        Generate general knowledge section using Gemini

        Args:
            query: User query
            textbook_answer: Existing textbook answer (for context)
            tone: Response tone

        Returns:
            General knowledge section
        """
        # Build prompt
        if textbook_answer:
            prompt = f"""The user asked: "{query}"

The textbook provides this information:
{textbook_answer}

Please provide additional context, examples, or related information from general knowledge that would help the student understand this topic better. Do not repeat information already in the textbook answer.

Tone: {tone}
"""
        else:
            prompt = f"""The user asked: "{query}"

No textbook content was found for this query. Please provide a helpful answer based on general knowledge.

Tone: {tone}
"""

        # Call Gemini
        try:
            model = genai.GenerativeModel(self.model_name)
            response = model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=0.3,  # Lower temperature for consistency
                    max_output_tokens=500,  # Limit general knowledge section
                ),
            )

            return response.text.strip()

        except Exception as e:
            logger.error(f"Failed to generate general knowledge section: {e}")
            return "Unable to generate additional context at this time."

    def _label_textbook_source(self, text: str) -> str:
        """Add [Textbook] prefix to content"""
        return f"**[Textbook]**\n\n{text}"

    def _label_general_source(self, text: str) -> str:
        """Add [General Knowledge] prefix to content"""
        return f"**[General Knowledge]**\n\n{text}"

    def _combine_sections(
        self, textbook_section: str, general_section: str
    ) -> str:
        """
        Combine textbook and general knowledge sections

        Args:
            textbook_section: Textbook content
            general_section: General knowledge content

        Returns:
            Combined text with clear labels
        """
        combined = f"""**[Textbook]**

{textbook_section}

---

**[General Knowledge]**

{general_section}

---

*Note: This answer combines textbook content (above) with general knowledge to provide additional context.*
"""
        return combined.strip()


# Global instance
_general_knowledge_agent = None


def get_general_knowledge_agent() -> GeneralKnowledgeAgent:
    """Get or create global General Knowledge Agent instance"""
    global _general_knowledge_agent
    if _general_knowledge_agent is None:
        _general_knowledge_agent = GeneralKnowledgeAgent()
    return _general_knowledge_agent
