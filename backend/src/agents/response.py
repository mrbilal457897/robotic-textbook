"""
Response Agent
Generates answers from retrieved chunks with tone support and citation formatting
"""

import os
from typing import List, Dict, Any, Optional
from enum import Enum
import logging

logger = logging.getLogger(__name__)


class ToneMode(str, Enum):
    """Response tone modes"""

    ACADEMIC = "academic"
    BEGINNER_FRIENDLY = "beginner-friendly"
    CONCISE = "concise"


class ResponseAgent:
    """
    Response Agent for RAG pipeline
    Generates answers with inline citations and tone control
    """

    def __init__(self):
        self.gemini_api_key = os.getenv("GEMINI_API_KEY")
        self.model_name = os.getenv("GEMINI_CHAT_MODEL") or os.getenv("GEMINI_MODEL", "gemini-2.0-flash-exp")

        if not self.gemini_api_key:
            logger.warning("GEMINI_API_KEY not set; response generation will fail")

        logger.info(f"Response Agent initialized (model: {self.model_name})")

    def generate_response(
        self,
        query: str,
        chunks: List[Dict[str, Any]],
        mode: str,
        tone: str = "academic",
        intent: Optional[str] = None,
        action: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Generate response from retrieved chunks

        Args:
            query: User query
            chunks: Retrieved chunks with context
            mode: Answering mode (book-only, selected-text-only, general-knowledge)
            tone: Response tone (academic, beginner-friendly, concise)
            intent: Query intent (question, definition, example, etc.)
            action: Text action for selected-text mode (explain, summarize, example, simplify)

        Returns:
            Response dict with answer, citations, and confidence
        """
        logger.info(
            f"Generating response (mode: {mode}, tone: {tone}, action: {action}, chunks: {len(chunks)})"
        )

        # Handle empty chunks (no context found)
        if not chunks:
            return self._generate_refusal_response(query, mode)

        # Build context from chunks
        context_text = self._build_context(chunks)

        # Build system prompt based on mode, tone, intent, and action
        system_prompt = self._build_system_prompt(mode, tone, intent, action)

        # Build user message
        user_message = self._build_user_message(query, context_text)

        # Generate response using Gemini
        try:
            response_text = self._call_gemini(system_prompt, user_message)

            # Extract citations from response
            citations = self._extract_citations(response_text, chunks)

            # Calculate confidence score
            confidence_score = self._calculate_confidence(chunks, citations)

            # Detect key terms for glossary highlighting (T127)
            key_terms = self._detect_key_terms(response_text)

            return {
                "status": "success",
                "answer": response_text,
                "citations": citations,
                "confidence_score": confidence_score,
                "mode": mode,
                "tone": tone,
                "chunks_used": len(chunks),
                "key_terms": key_terms,  # T127: Add key terms for frontend highlighting
            }

        except Exception as e:
            logger.error(f"Response generation failed: {e}", exc_info=True)

            # Provide specific error messages based on exception type
            if "quota" in str(e).lower() or "rate limit" in str(e).lower():
                error_msg = "I'm currently experiencing high demand. Please try again in a few moments."
            elif "timeout" in str(e).lower():
                error_msg = "The response took too long to generate. Please try a simpler question or try again."
            elif "authentication" in str(e).lower() or "api key" in str(e).lower():
                error_msg = "There's a configuration issue with the AI service. Please contact support."
            elif "connection" in str(e).lower() or "network" in str(e).lower():
                error_msg = "I'm having trouble connecting to the AI service. Please check your internet connection and try again."
            else:
                error_msg = "I encountered an unexpected error while generating your response. Please try rephrasing your question or try again."

            return {
                "status": "error",
                "error": str(e),
                "answer": error_msg,
                "citations": [],
                "confidence_score": 0.0,
            }

    def _build_context(self, chunks: List[Dict[str, Any]]) -> str:
        """
        Build context text from chunks

        Args:
            chunks: List of chunk dicts with main_chunk and context

        Returns:
            Formatted context string
        """
        context_parts = []

        for i, chunk_data in enumerate(chunks):
            main_chunk = chunk_data.get("main_chunk", chunk_data)

            chunk_id = main_chunk.get("chunk_id", f"chunk_{i}")
            chunk_text = main_chunk.get("text", "")

            # Include context before (if available)
            context_before = chunk_data.get("context_before", [])
            if context_before:
                for ctx_chunk in context_before:
                    context_parts.append(f"[Context] {ctx_chunk.get('text', '')}")

            # Main chunk with citation ID
            context_parts.append(f"[{chunk_id}] {chunk_text}")

            # Include context after (if available)
            context_after = chunk_data.get("context_after", [])
            if context_after:
                for ctx_chunk in context_after:
                    context_parts.append(f"[Context] {ctx_chunk.get('text', '')}")

            # Separator between chunks
            if i < len(chunks) - 1:
                context_parts.append("\n---\n")

        return "\n\n".join(context_parts)

    def _build_system_prompt(
        self, mode: str, tone: str, intent: Optional[str], action: Optional[str] = None
    ) -> str:
        """
        Build system prompt based on mode, tone, intent, and action

        Args:
            mode: Answering mode
            tone: Response tone
            intent: Query intent
            action: Text action (for selected-text mode)

        Returns:
            System prompt string
        """
        base_prompt = "You are a textbook chatbot assistant. Your role is to answer questions based on the provided context."

        # Mode-specific instructions
        if mode == "book-only":
            mode_instructions = """
CRITICAL: You MUST answer ONLY using the context provided below. Do NOT use any external knowledge.
If the context does not contain the answer, respond: "I couldn't find information about [topic] in this textbook."
"""
        elif mode == "selected-text-only":
            mode_instructions = """
CRITICAL: You MUST answer ONLY using the selected text highlighted by the user.
Do NOT introduce information from other textbook sections or external sources.
The context below represents the highlighted text.
"""
        elif mode == "general-knowledge":
            mode_instructions = """
You may use both the textbook context provided AND general knowledge.
Clearly label textbook content with "[Textbook]" prefix and general knowledge with "[General Knowledge]" prefix.
Prioritize textbook content when available.
"""
        else:
            mode_instructions = ""

        # Tone-specific instructions
        if tone == "academic":
            tone_instructions = """
Tone: Academic and formal. Use precise terminology and detailed explanations.
Assume the reader has technical background knowledge.
"""
        elif tone == "beginner-friendly":
            tone_instructions = """
Tone: Beginner-friendly and accessible. Use simple language and clear analogies.
Explain technical terms and avoid jargon. Assume the reader is new to the subject.
"""
        elif tone == "concise":
            tone_instructions = """
Tone: Concise and to-the-point. Provide brief, direct answers.
Limit responses to 2-3 sentences unless more detail is explicitly requested.
"""
        else:
            tone_instructions = "Tone: Clear and informative."

        # Intent-specific instructions
        intent_instructions = ""
        if intent == "definition":
            intent_instructions = "\nFocus on providing a clear definition of the term or concept."
        elif intent == "example":
            intent_instructions = "\nProvide concrete examples to illustrate the concept."
        elif intent == "summary":
            intent_instructions = "\nProvide a concise summary of the key points."
        elif intent == "simplify":
            intent_instructions = (
                "\nRephrase the content in simpler, more accessible language."
            )

        # Action-specific instructions (for selected-text mode)
        action_instructions = ""
        if action == "explain":
            action_instructions = """
ACTION: Explain
Provide a detailed explanation of the selected text. Break down complex concepts,
explain the meaning, and clarify any technical terms used in the passage.
"""
        elif action == "summarize":
            action_instructions = """
ACTION: Summarize
Provide a concise summary of the selected text. Extract the main ideas and key points,
condensing the content while preserving the essential information.
Aim for 2-3 sentences maximum.
"""
        elif action == "example":
            action_instructions = """
ACTION: Provide Example
Generate concrete examples to illustrate the concepts in the selected text.
If the text already contains examples, expand on them or provide similar ones.
Use real-world scenarios when possible to make concepts tangible.
"""
        elif action == "simplify":
            action_instructions = """
ACTION: Simplify
Rephrase the selected text in simpler, more accessible language.
Use everyday terms instead of jargon, provide analogies, and break down complex sentences.
Assume the reader has no prior knowledge of the subject.
"""

        # Citation instructions
        citation_instructions = """
CITATIONS: Include inline citations for all factual claims using the format [chunk_id] where chunk_id appears in the context.
Example: "Neural networks use backpropagation [intro-ai_chunk_00042] to update weights."
"""

        # Combine all parts
        full_prompt = f"""{base_prompt}

{mode_instructions}

{tone_instructions}
{intent_instructions}
{action_instructions}

{citation_instructions}

Now answer the user's question based on the context provided.
"""

        return full_prompt.strip()

    def _build_user_message(self, query: str, context: str) -> str:
        """
        Build user message with query and context

        Args:
            query: User query
            context: Formatted context text

        Returns:
            User message string
        """
        return f"""Context:
{context}

Question: {query}"""

    def _call_gemini(self, system_prompt: str, user_message: str, max_retries: int = 3) -> str:
        """
        Call Gemini API to generate response with exponential backoff retry

        Args:
            system_prompt: System instructions
            user_message: User query with context
            max_retries: Maximum number of retry attempts (default: 3)

        Returns:
            Generated response text

        Raises:
            Exception: If all retries fail
        """
        import time
        import random

        last_exception = None

        for attempt in range(max_retries):
            try:
                import google.generativeai as genai

                genai.configure(api_key=self.gemini_api_key)

                model = genai.GenerativeModel(
                    model_name=self.model_name,
                    system_instruction=system_prompt,
                )

                response = model.generate_content(user_message)

                # Success - return immediately
                if attempt > 0:
                    logger.info(f"Gemini API call succeeded on attempt {attempt + 1}")

                return response.text

            except ImportError:
                logger.error(
                    "google-generativeai package not installed. Run: pip install google-generativeai"
                )
                raise  # Don't retry import errors

            except Exception as e:
                last_exception = e
                logger.warning(f"Gemini API call failed (attempt {attempt + 1}/{max_retries}): {e}")

                # Don't retry on final attempt
                if attempt == max_retries - 1:
                    break

                # Exponential backoff with jitter
                # Base delay: 2^attempt seconds (1s, 2s, 4s)
                # Jitter: +/- 25% randomization
                base_delay = 2 ** attempt
                jitter = base_delay * 0.25 * (2 * random.random() - 1)
                delay = base_delay + jitter

                logger.info(f"Retrying in {delay:.2f} seconds...")
                time.sleep(delay)

        # All retries exhausted
        logger.error(f"Gemini API call failed after {max_retries} attempts: {last_exception}")
        raise last_exception

    def _extract_citations(
        self, response_text: str, chunks: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """
        Extract citation references from response text

        Args:
            response_text: Generated response
            chunks: Source chunks

        Returns:
            List of citation dicts
        """
        import re

        citations = []

        # Extract all [chunk_id] patterns
        citation_pattern = r"\[([a-zA-Z0-9_-]+)\]"
        matches = re.findall(citation_pattern, response_text)

        # Build chunk lookup
        chunk_lookup = {}
        for chunk_data in chunks:
            main_chunk = chunk_data.get("main_chunk", chunk_data)
            chunk_id = main_chunk.get("chunk_id")
            if chunk_id:
                chunk_lookup[chunk_id] = main_chunk

        # Create citation objects
        seen_ids = set()
        for chunk_id in matches:
            if chunk_id in chunk_lookup and chunk_id not in seen_ids:
                chunk = chunk_lookup[chunk_id]
                metadata = chunk.get("metadata", {})

                citations.append(
                    {
                        "chunk_id": chunk_id,
                        "book_id": metadata.get("book_id"),
                        "chapter": metadata.get("chapter"),
                        "page": metadata.get("page"),
                        "text": chunk.get("text", "")[:200],  # First 200 chars
                    }
                )

                seen_ids.add(chunk_id)

        logger.info(f"Extracted {len(citations)} citations from response")

        return citations

    def _calculate_confidence(
        self, chunks: List[Dict[str, Any]], citations: List[Dict[str, Any]]
    ) -> float:
        """
        Calculate confidence score for response

        Args:
            chunks: Source chunks
            citations: Extracted citations

        Returns:
            Confidence score (0.0 - 1.0)
        """
        if not chunks:
            return 0.0

        # Extract main chunks
        main_chunks = [chunk_data.get("main_chunk", chunk_data) for chunk_data in chunks]

        # Average similarity score from chunks
        scores = [chunk.get("score", 0.0) for chunk in main_chunks]
        avg_score = sum(scores) / len(scores) if scores else 0.0

        # Citation coverage (bonus for using multiple sources)
        citation_coverage = min(len(citations) / max(len(chunks), 1), 1.0)

        # Weighted combination
        confidence = (avg_score * 0.8) + (citation_coverage * 0.2)

        return round(confidence, 2)

    def _generate_refusal_response(self, query: str, mode: str) -> Dict[str, Any]:
        """
        Generate refusal response when no context is available

        Args:
            query: User query
            mode: Answering mode

        Returns:
            Refusal response dict
        """
        if mode == "book-only":
            message = f"I couldn't find information about '{query}' in this textbook. Try switching to General Knowledge mode for a broader answer."
        elif mode == "selected-text-only":
            message = "The selected text doesn't contain enough information to answer your question. Please select a different passage or ask in Book-Only mode."
        else:
            message = (
                "I couldn't find relevant information to answer your question."
            )

        return {
            "status": "no_content",
            "answer": message,
            "citations": [],
            "confidence_score": 0.0,
            "mode": mode,
            "chunks_used": 0,
        }

    def generate_mode_switch_prompt(
        self,
        current_mode: str,
        suggested_mode: str,
        reason: str,
        context: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Generate mode switching prompt when a different mode is more appropriate

        Args:
            current_mode: Current answering mode
            suggested_mode: Suggested mode to switch to
            reason: Reason for suggestion
            context: Optional context about the query

        Returns:
            Mode switch prompt dict
        """
        mode_descriptions = {
            "book-only": "**Book-Only mode** - Answers strictly from textbook content",
            "selected-text-only": "**Selected-Text mode** - Answers based only on highlighted text",
            "general-knowledge": "**General Knowledge mode** - Combines textbook with broader knowledge sources",
        }

        current_desc = mode_descriptions.get(
            current_mode, "the current mode"
        )
        suggested_desc = mode_descriptions.get(
            suggested_mode, "the suggested mode"
        )

        prompt = f"""💡 **Mode Switch Suggestion**

{reason}

You're currently using {current_desc}.

Would you like to switch to {suggested_desc}?
"""

        if context:
            prompt += f"\n{context}"

        return {
            "type": "mode_switch_suggestion",
            "current_mode": current_mode,
            "suggested_mode": suggested_mode,
            "reason": reason,
            "prompt": prompt,
        }

    def append_mode_switch_to_response(
        self, response: Dict[str, Any], mode_switch_suggestion: Optional[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Append mode switch suggestion to existing response

        Args:
            response: Existing response dict
            mode_switch_suggestion: Mode switch suggestion (if any)

        Returns:
            Updated response dict
        """
        if not mode_switch_suggestion:
            return response

        # Append suggestion to answer
        original_answer = response.get("answer", "")
        suggestion_prompt = mode_switch_suggestion.get("prompt", "")

        updated_answer = f"""{original_answer}

---

{suggestion_prompt}"""

        response["answer"] = updated_answer
        response["mode_switch_suggestion"] = mode_switch_suggestion

        return response

    def _detect_key_terms(self, response_text: str) -> List[Dict[str, Any]]:
        """
        Detect key technical terms in response text for glossary highlighting (T127)

        Args:
            response_text: Generated response text

        Returns:
            List of detected key terms with positions and definitions
        """
        import re
        import json
        from pathlib import Path

        # Load glossary (cache in instance variable)
        if not hasattr(self, "_glossary"):
            try:
                # Try to load from frontend/public/glossary.json
                glossary_path = Path(__file__).parent.parent.parent.parent / "frontend" / "public" / "glossary.json"

                if not glossary_path.exists():
                    # Fallback: try relative to current file
                    glossary_path = Path(__file__).parent.parent.parent / "glossary.json"

                if glossary_path.exists():
                    with open(glossary_path, 'r', encoding='utf-8') as f:
                        glossary_data = json.load(f)
                        self._glossary = glossary_data.get("terms", [])
                        logger.info(f"Loaded glossary with {len(self._glossary)} terms")
                else:
                    logger.warning("Glossary file not found, key term detection disabled")
                    self._glossary = []
            except Exception as e:
                logger.error(f"Failed to load glossary: {e}")
                self._glossary = []

        if not self._glossary:
            return []

        detected_terms = []
        text_lower = response_text.lower()

        # Build a set of terms to check (term + aliases)
        terms_to_check = []
        for term_data in self._glossary:
            term = term_data["term"]
            aliases = term_data.get("aliases", [])

            # Add main term and aliases
            terms_to_check.append({
                "search_term": term,
                "canonical_term": term,
                "definition": term_data["definition"],
                "category": term_data.get("category", "General")
            })

            for alias in aliases:
                terms_to_check.append({
                    "search_term": alias,
                    "canonical_term": term,
                    "definition": term_data["definition"],
                    "category": term_data.get("category", "General")
                })

        # Sort by length (longest first) to match longer terms before shorter ones
        # This prevents "ROS" from matching when "ROS 2" is present
        terms_to_check.sort(key=lambda x: len(x["search_term"]), reverse=True)

        # Track positions already matched to avoid overlaps
        matched_positions = set()

        for term_info in terms_to_check:
            search_term = term_info["search_term"]

            # Use word boundary regex to match whole words/phrases
            # Handle terms with special characters and spaces
            escaped_term = re.escape(search_term)
            pattern = r'\b' + escaped_term + r'\b'

            for match in re.finditer(pattern, response_text, re.IGNORECASE):
                start_pos = match.start()
                end_pos = match.end()

                # Check if this position overlaps with already matched terms
                if any(start_pos < pos < end_pos or pos < start_pos < pos + length
                       for pos, length in matched_positions):
                    continue

                # Add to detected terms
                detected_terms.append({
                    "term": term_info["canonical_term"],
                    "matched_text": match.group(),
                    "definition": term_info["definition"],
                    "category": term_info["category"],
                    "start_pos": start_pos,
                    "end_pos": end_pos
                })

                # Mark this position as matched
                matched_positions.add((start_pos, end_pos - start_pos))

        # Sort by position in text
        detected_terms.sort(key=lambda x: x["start_pos"])

        logger.info(f"Detected {len(detected_terms)} key terms in response")

        return detected_terms


# Global instance
_response_agent = None


def get_response_agent() -> ResponseAgent:
    """Get or create global Response Agent instance"""
    global _response_agent
    if _response_agent is None:
        _response_agent = ResponseAgent()
    return _response_agent
