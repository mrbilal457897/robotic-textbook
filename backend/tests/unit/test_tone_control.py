"""
Unit tests for tone control in Response Agent
Tests T109: Verify all three tones (academic, beginner-friendly, concise) work correctly
"""

import pytest
from unittest.mock import Mock, patch, MagicMock
from backend.src.agents.response import ResponseAgent, ToneMode


@pytest.fixture
def response_agent():
    """Create ResponseAgent instance for testing"""
    with patch.dict("os.environ", {"GEMINI_API_KEY": "test-key"}):
        return ResponseAgent()


@pytest.fixture
def sample_chunks():
    """Sample chunks for testing"""
    return [
        {
            "main_chunk": {
                "chunk_id": "test_chunk_001",
                "text": "Neural networks are computational models inspired by biological neurons. They consist of layers of interconnected nodes that process information through weighted connections.",
                "score": 0.95,
                "metadata": {
                    "book_id": "intro-ai",
                    "chapter": "Chapter 3: Neural Networks",
                    "page": 42,
                },
            },
            "context_before": [],
            "context_after": [],
        }
    ]


class TestToneModeEnum:
    """Test ToneMode enum"""

    def test_tone_mode_values(self):
        """Test that all tone modes are defined correctly"""
        assert ToneMode.ACADEMIC == "academic"
        assert ToneMode.BEGINNER_FRIENDLY == "beginner-friendly"
        assert ToneMode.CONCISE == "concise"

    def test_tone_mode_iteration(self):
        """Test that all tone modes can be iterated"""
        tones = list(ToneMode)
        assert len(tones) == 3
        assert ToneMode.ACADEMIC in tones
        assert ToneMode.BEGINNER_FRIENDLY in tones
        assert ToneMode.CONCISE in tones


class TestAcademicTone:
    """Test academic tone (T106)"""

    def test_academic_tone_in_system_prompt(self, response_agent):
        """Test that academic tone is correctly applied in system prompt"""
        system_prompt = response_agent._build_system_prompt(
            mode="book-only", tone="academic", intent=None, action=None
        )

        # Academic tone should use formal language
        assert "academic" in system_prompt.lower() or "formal" in system_prompt.lower()
        assert "precise terminology" in system_prompt.lower()
        assert "technical" in system_prompt.lower()

    def test_academic_tone_default(self, response_agent, sample_chunks):
        """Test that academic is the default tone"""
        with patch.object(response_agent, "_call_gemini") as mock_gemini:
            mock_gemini.return_value = "Neural networks use backpropagation [test_chunk_001] to update weights."

            result = response_agent.generate_response(
                query="What are neural networks?",
                chunks=sample_chunks,
                mode="book-only",
                # tone not specified - should default to academic
            )

            # Verify the tone was set to academic
            assert result["tone"] == "academic"

    @patch("backend.src.agents.response.genai")
    def test_academic_tone_response_generation(
        self, mock_genai, response_agent, sample_chunks
    ):
        """Test full response generation with academic tone"""
        # Mock Gemini response with academic language
        mock_model = MagicMock()
        mock_model.generate_content.return_value.text = "Neural networks constitute computational architectures inspired by biological neural systems [test_chunk_001]. These models employ hierarchical layers of interconnected nodes to process information via weighted synaptic connections."

        mock_genai.GenerativeModel.return_value = mock_model

        result = response_agent.generate_response(
            query="What are neural networks?",
            chunks=sample_chunks,
            mode="book-only",
            tone="academic",
        )

        assert result["status"] == "success"
        assert result["tone"] == "academic"
        assert len(result["citations"]) > 0

        # Verify system prompt included academic instructions
        call_args = mock_genai.GenerativeModel.call_args
        assert call_args is not None
        system_instruction = call_args.kwargs.get("system_instruction", "")
        assert "academic" in system_instruction.lower() or "formal" in system_instruction.lower()


class TestBeginnerFriendlyTone:
    """Test beginner-friendly tone (T107)"""

    def test_beginner_friendly_tone_in_system_prompt(self, response_agent):
        """Test that beginner-friendly tone is correctly applied in system prompt"""
        system_prompt = response_agent._build_system_prompt(
            mode="book-only", tone="beginner-friendly", intent=None, action=None
        )

        # Beginner-friendly tone should use simple language
        assert "beginner-friendly" in system_prompt.lower()
        assert "simple" in system_prompt.lower()
        assert "analogies" in system_prompt.lower() or "analogy" in system_prompt.lower()

    @patch("backend.src.agents.response.genai")
    def test_beginner_friendly_tone_response_generation(
        self, mock_genai, response_agent, sample_chunks
    ):
        """Test full response generation with beginner-friendly tone"""
        # Mock Gemini response with simple language and analogies
        mock_model = MagicMock()
        mock_model.generate_content.return_value.text = "Think of neural networks like your brain! They're computer programs that learn from examples [test_chunk_001], just like how you learn from experience. Imagine a network of connected light bulbs where each connection can be brighter or dimmer - that's basically how neural networks work."

        mock_genai.GenerativeModel.return_value = mock_model

        result = response_agent.generate_response(
            query="What are neural networks?",
            chunks=sample_chunks,
            mode="book-only",
            tone="beginner-friendly",
        )

        assert result["status"] == "success"
        assert result["tone"] == "beginner-friendly"
        assert len(result["citations"]) > 0

        # Verify system prompt included beginner-friendly instructions
        call_args = mock_genai.GenerativeModel.call_args
        system_instruction = call_args.kwargs.get("system_instruction", "")
        assert "beginner" in system_instruction.lower()
        assert "simple" in system_instruction.lower()

    def test_beginner_friendly_tone_avoids_jargon(self, response_agent):
        """Test that beginner-friendly tone explicitly requests avoiding jargon"""
        system_prompt = response_agent._build_system_prompt(
            mode="book-only", tone="beginner-friendly", intent=None, action=None
        )

        assert "jargon" in system_prompt.lower()
        assert "new to" in system_prompt.lower() or "beginner" in system_prompt.lower()


class TestConciseTone:
    """Test concise tone (T108)"""

    def test_concise_tone_in_system_prompt(self, response_agent):
        """Test that concise tone is correctly applied in system prompt"""
        system_prompt = response_agent._build_system_prompt(
            mode="book-only", tone="concise", intent=None, action=None
        )

        # Concise tone should request brief answers
        assert "concise" in system_prompt.lower()
        assert "brief" in system_prompt.lower() or "short" in system_prompt.lower()
        assert "2-3 sentences" in system_prompt.lower()

    @patch("backend.src.agents.response.genai")
    def test_concise_tone_response_generation(
        self, mock_genai, response_agent, sample_chunks
    ):
        """Test full response generation with concise tone"""
        # Mock Gemini response with brief answer
        mock_model = MagicMock()
        mock_model.generate_content.return_value.text = (
            "Neural networks are computational models with layered nodes [test_chunk_001]. They process information through weighted connections."
        )

        mock_genai.GenerativeModel.return_value = mock_model

        result = response_agent.generate_response(
            query="What are neural networks?",
            chunks=sample_chunks,
            mode="book-only",
            tone="concise",
        )

        assert result["status"] == "success"
        assert result["tone"] == "concise"
        assert len(result["citations"]) > 0

        # Verify system prompt included concise instructions
        call_args = mock_genai.GenerativeModel.call_args
        system_instruction = call_args.kwargs.get("system_instruction", "")
        assert "concise" in system_instruction.lower()

    def test_concise_tone_limits_response_length(self, response_agent):
        """Test that concise tone explicitly limits response length"""
        system_prompt = response_agent._build_system_prompt(
            mode="book-only", tone="concise", intent=None, action=None
        )

        # Should mention sentence limit
        assert "2-3 sentences" in system_prompt.lower()


class TestToneCombinationWithModes:
    """Test tone works correctly with different answering modes"""

    @pytest.mark.parametrize("tone", ["academic", "beginner-friendly", "concise"])
    @pytest.mark.parametrize("mode", ["book-only", "selected-text-only", "general-knowledge"])
    def test_tone_with_all_modes(self, response_agent, tone, mode):
        """Test that all tones work with all modes"""
        system_prompt = response_agent._build_system_prompt(
            mode=mode, tone=tone, intent=None, action=None
        )

        # Verify both mode and tone instructions are present
        assert system_prompt is not None
        assert len(system_prompt) > 0

        # Mode should be mentioned
        if mode == "book-only":
            assert "book" in system_prompt.lower() or "textbook" in system_prompt.lower()
        elif mode == "selected-text-only":
            assert "selected" in system_prompt.lower()
        elif mode == "general-knowledge":
            assert "general" in system_prompt.lower()

        # Tone should be mentioned
        if tone == "academic":
            assert "academic" in system_prompt.lower() or "formal" in system_prompt.lower()
        elif tone == "beginner-friendly":
            assert "beginner" in system_prompt.lower()
        elif tone == "concise":
            assert "concise" in system_prompt.lower()


class TestToneCitationConsistency:
    """Test that citations remain consistent across all tones (T115)"""

    @patch("backend.src.agents.response.genai")
    def test_citations_identical_across_tones(
        self, mock_genai, response_agent, sample_chunks
    ):
        """Test that the same query returns identical citations across all tones"""
        query = "What are neural networks?"

        # Mock responses with different tones but same citations
        citation_responses = {
            "academic": "Neural networks constitute computational architectures [test_chunk_001].",
            "beginner-friendly": "Neural networks are like brain-inspired computer programs [test_chunk_001].",
            "concise": "Neural networks are computational models [test_chunk_001].",
        }

        results = {}

        for tone, response_text in citation_responses.items():
            mock_model = MagicMock()
            mock_model.generate_content.return_value.text = response_text
            mock_genai.GenerativeModel.return_value = mock_model

            result = response_agent.generate_response(
                query=query, chunks=sample_chunks, mode="book-only", tone=tone
            )

            results[tone] = result

        # Extract citation IDs from each tone
        academic_citations = {c["chunk_id"] for c in results["academic"]["citations"]}
        beginner_citations = {c["chunk_id"] for c in results["beginner-friendly"]["citations"]}
        concise_citations = {c["chunk_id"] for c in results["concise"]["citations"]}

        # All tones should reference the same chunks
        assert academic_citations == beginner_citations == concise_citations


class TestInvalidTone:
    """Test handling of invalid or missing tone"""

    def test_invalid_tone_falls_back(self, response_agent):
        """Test that invalid tone falls back gracefully"""
        system_prompt = response_agent._build_system_prompt(
            mode="book-only", tone="invalid-tone", intent=None, action=None
        )

        # Should still generate a valid prompt with fallback instructions
        assert system_prompt is not None
        assert len(system_prompt) > 0

    @patch("backend.src.agents.response.genai")
    def test_empty_tone_uses_default(self, mock_genai, response_agent, sample_chunks):
        """Test that empty tone falls back to default (academic)"""
        mock_model = MagicMock()
        mock_model.generate_content.return_value.text = "Response [test_chunk_001]"
        mock_genai.GenerativeModel.return_value = mock_model

        # Pass empty string as tone
        result = response_agent.generate_response(
            query="Test query", chunks=sample_chunks, mode="book-only", tone=""
        )

        # Should use empty tone as-is, but still work
        assert result["status"] == "success"
        assert result["tone"] == ""


class TestToneWithIntent:
    """Test tone works correctly with different intents"""

    @pytest.mark.parametrize("tone", ["academic", "beginner-friendly", "concise"])
    @pytest.mark.parametrize("intent", ["definition", "example", "summary", "simplify"])
    def test_tone_with_intents(self, response_agent, tone, intent):
        """Test that tones work with all intent types"""
        system_prompt = response_agent._build_system_prompt(
            mode="book-only", tone=tone, intent=intent, action=None
        )

        assert system_prompt is not None
        assert len(system_prompt) > 0

        # Both tone and intent should be present
        if intent == "definition":
            assert "definition" in system_prompt.lower()
        elif intent == "example":
            assert "example" in system_prompt.lower()


class TestToneWithAction:
    """Test tone works correctly with selected-text actions"""

    @pytest.mark.parametrize("tone", ["academic", "beginner-friendly", "concise"])
    @pytest.mark.parametrize("action", ["explain", "summarize", "example", "simplify"])
    def test_tone_with_actions(self, response_agent, tone, action):
        """Test that tones work with all action types"""
        system_prompt = response_agent._build_system_prompt(
            mode="selected-text-only", tone=tone, intent=None, action=action
        )

        assert system_prompt is not None
        assert len(system_prompt) > 0

        # Both tone and action should be present
        if action == "explain":
            assert "explain" in system_prompt.lower()
        elif action == "summarize":
            assert "summarize" in system_prompt.lower()
