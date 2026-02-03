"""
Unit tests for General Knowledge Agent
Tests dual-pass approach, source labeling, and mode boundary enforcement
"""

import pytest
from unittest.mock import Mock, patch, MagicMock
from src.agents.general_knowledge import (
    GeneralKnowledgeAgent,
    SourceType,
    get_general_knowledge_agent,
)


@pytest.fixture
def general_knowledge_agent():
    """Fixture for General Knowledge Agent instance"""
    with patch("src.agents.general_knowledge.get_retrieval_agent"), \
         patch("src.agents.general_knowledge.get_response_agent"), \
         patch("src.agents.general_knowledge.genai.configure"):
        agent = GeneralKnowledgeAgent()
        return agent


@pytest.fixture
def mock_textbook_chunks():
    """Mock textbook chunks for testing"""
    return [
        {
            "main_chunk": {
                "chunk_id": "chunk_001",
                "text": "Neural networks are computational models inspired by the brain.",
                "score": 0.85,
                "metadata": {"book_id": "test-book", "chapter": "1"},
            },
            "context_before": [],
            "context_after": [],
        },
        {
            "main_chunk": {
                "chunk_id": "chunk_002",
                "text": "They consist of interconnected layers of neurons.",
                "score": 0.78,
                "metadata": {"book_id": "test-book", "chapter": "1"},
            },
            "context_before": [],
            "context_after": [],
        },
    ]


class TestDualPassApproach:
    """Test dual-pass retrieval approach"""

    def test_first_pass_retrieves_from_textbook(self, general_knowledge_agent):
        """First pass should retrieve from textbook only"""
        # Mock retrieval agent
        mock_result = {
            "status": "success",
            "chunks": [{"main_chunk": {"chunk_id": "test", "score": 0.8}}],
        }
        general_knowledge_agent.retrieval_agent.retrieve = Mock(return_value=mock_result)

        result = general_knowledge_agent._first_pass_textbook(
            query="What is AI?",
            book_id="test-book",
            chapter="1",
        )

        # Verify retrieval was called with correct mode
        general_knowledge_agent.retrieval_agent.retrieve.assert_called_once()
        call_args = general_knowledge_agent.retrieval_agent.retrieve.call_args
        assert call_args[1]["mode"] == "book-only"
        assert result == mock_result

    def test_second_pass_combines_with_general_knowledge(
        self, general_knowledge_agent, mock_textbook_chunks
    ):
        """Second pass should combine textbook with general knowledge when needed"""
        textbook_result = {
            "status": "success",
            "chunks": mock_textbook_chunks,
        }

        # Mock should use general knowledge (low confidence)
        general_knowledge_agent._should_use_general_knowledge = Mock(return_value=True)
        general_knowledge_agent._generate_hybrid_response = Mock(
            return_value={
                "answer": "Combined answer",
                "has_external_knowledge": True,
            }
        )

        result = general_knowledge_agent._second_pass_general(
            query="What is AI?",
            textbook_result=textbook_result,
            tone="academic",
            intent="question",
        )

        # Verify hybrid response was generated
        assert result["has_external_knowledge"] is True
        general_knowledge_agent._generate_hybrid_response.assert_called_once()

    def test_textbook_only_when_sufficient(
        self, general_knowledge_agent, mock_textbook_chunks
    ):
        """Should use textbook only when content is sufficient"""
        textbook_result = {
            "status": "success",
            "chunks": mock_textbook_chunks,
        }

        # Mock should NOT use general knowledge (high confidence)
        general_knowledge_agent._should_use_general_knowledge = Mock(return_value=False)
        general_knowledge_agent._generate_textbook_only_response = Mock(
            return_value={
                "answer": "Textbook answer",
                "has_external_knowledge": False,
            }
        )

        result = general_knowledge_agent._second_pass_general(
            query="What is AI?",
            textbook_result=textbook_result,
            tone="academic",
            intent="question",
        )

        # Verify textbook-only response was generated
        assert result["has_external_knowledge"] is False
        general_knowledge_agent._generate_textbook_only_response.assert_called_once()


class TestDecisionLogic:
    """Test decision logic for when to use general knowledge"""

    def test_use_general_knowledge_when_no_results(self, general_knowledge_agent):
        """Should use general knowledge when no textbook results"""
        should_use = general_knowledge_agent._should_use_general_knowledge(
            query="What is AI?",
            textbook_chunks=[],
            textbook_status="no_results",
        )

        assert should_use is True

    def test_use_general_knowledge_when_low_confidence(
        self, general_knowledge_agent
    ):
        """Should use general knowledge when textbook confidence is low"""
        low_confidence_chunks = [
            {
                "main_chunk": {
                    "chunk_id": "chunk_001",
                    "score": 0.55,  # Below 0.60 threshold
                }
            },
            {
                "main_chunk": {
                    "chunk_id": "chunk_002",
                    "score": 0.58,  # Below 0.60 threshold
                }
            },
        ]

        should_use = general_knowledge_agent._should_use_general_knowledge(
            query="What is AI?",
            textbook_chunks=low_confidence_chunks,
            textbook_status="success",
        )

        assert should_use is True

    def test_do_not_use_general_knowledge_when_high_confidence(
        self, general_knowledge_agent, mock_textbook_chunks
    ):
        """Should not use general knowledge when textbook confidence is high"""
        should_use = general_knowledge_agent._should_use_general_knowledge(
            query="What is AI?",
            textbook_chunks=mock_textbook_chunks,  # High scores (0.85, 0.78)
            textbook_status="success",
        )

        assert should_use is False


class TestSourceLabeling:
    """Test source labeling functionality"""

    def test_label_textbook_source(self, general_knowledge_agent):
        """Should add [Textbook] prefix"""
        text = "Neural networks are computational models."
        labeled = general_knowledge_agent._label_textbook_source(text)

        assert "**[Textbook]**" in labeled
        assert text in labeled

    def test_label_general_source(self, general_knowledge_agent):
        """Should add [General Knowledge] prefix"""
        text = "AI has many real-world applications."
        labeled = general_knowledge_agent._label_general_source(text)

        assert "**[General Knowledge]**" in labeled
        assert text in labeled

    def test_combine_sections_with_labels(self, general_knowledge_agent):
        """Should combine sections with clear labels and separator"""
        textbook_section = "From the textbook: Neural networks..."
        general_section = "Additional context: AI is widely used..."

        combined = general_knowledge_agent._combine_sections(
            textbook_section=textbook_section,
            general_section=general_section,
        )

        # Verify both labels present
        assert "**[Textbook]**" in combined
        assert "**[General Knowledge]**" in combined

        # Verify both sections present
        assert textbook_section in combined
        assert general_section in combined

        # Verify separator present
        assert "---" in combined

        # Verify note present
        assert "note:" in combined.lower()


class TestResponseGeneration:
    """Test response generation for different scenarios"""

    def test_textbook_only_response(
        self, general_knowledge_agent, mock_textbook_chunks
    ):
        """Should generate textbook-only response correctly"""
        # Mock response agent
        mock_response = {
            "answer": "Neural networks are computational models.",
            "citations": [{"chunk_id": "chunk_001"}],
            "confidence_score": 0.85,
        }
        general_knowledge_agent.response_agent.generate_response = Mock(
            return_value=mock_response
        )

        result = general_knowledge_agent._generate_textbook_only_response(
            query="What are neural networks?",
            chunks=mock_textbook_chunks,
            tone="academic",
            intent="definition",
        )

        # Verify response structure
        assert result["has_external_knowledge"] is False
        assert result["mode"] == "general-knowledge"
        assert result["source_breakdown"]["textbook_sections"] == 1
        assert result["source_breakdown"]["general_sections"] == 0
        assert "**[Textbook]**" in result["answer"]

    def test_general_only_response(self, general_knowledge_agent):
        """Should generate general-only response correctly"""
        # Mock Gemini response
        with patch("src.agents.general_knowledge.genai.GenerativeModel") as mock_model:
            mock_instance = MagicMock()
            mock_instance.generate_content.return_value.text = "AI is artificial intelligence."
            mock_model.return_value = mock_instance

            result = general_knowledge_agent._generate_general_only_response(
                query="What is AI?",
                tone="academic",
                intent="definition",
            )

            # Verify response structure
            assert result["has_external_knowledge"] is True
            assert result["mode"] == "general-knowledge"
            assert result["source_breakdown"]["textbook_sections"] == 0
            assert result["source_breakdown"]["general_sections"] == 1
            assert result["chunks_used"] == 0
            assert "**[General Knowledge]**" in result["answer"]
            assert "disclaimer" in result

    def test_hybrid_response_structure(
        self, general_knowledge_agent, mock_textbook_chunks
    ):
        """Should generate hybrid response correctly"""
        # Mock response agent
        mock_textbook_response = {
            "answer": "Textbook content about neural networks.",
            "citations": [{"chunk_id": "chunk_001"}],
            "confidence_score": 0.75,
        }
        general_knowledge_agent.response_agent.generate_response = Mock(
            return_value=mock_textbook_response
        )

        # Mock general section generation
        general_knowledge_agent._generate_general_section = Mock(
            return_value="Additional context from general knowledge."
        )

        result = general_knowledge_agent._generate_hybrid_response(
            query="What are neural networks?",
            textbook_chunks=mock_textbook_chunks,
            tone="academic",
            intent="definition",
        )

        # Verify hybrid structure
        assert result["has_external_knowledge"] is True
        assert result["source_breakdown"]["textbook_sections"] == 1
        assert result["source_breakdown"]["general_sections"] == 1
        assert "**[Textbook]**" in result["answer"]
        assert "**[General Knowledge]**" in result["answer"]
        assert "disclaimer" in result


class TestGeneralSectionGeneration:
    """Test generation of general knowledge section"""

    def test_generate_general_section_with_textbook(self, general_knowledge_agent):
        """Should generate complementary general knowledge section"""
        with patch("src.agents.general_knowledge.genai.GenerativeModel") as mock_model:
            mock_instance = MagicMock()
            mock_instance.generate_content.return_value.text = (
                "Real-world applications include image recognition."
            )
            mock_model.return_value = mock_instance

            result = general_knowledge_agent._generate_general_section(
                query="What are neural network applications?",
                textbook_answer="Neural networks can classify images.",
                tone="academic",
            )

            # Verify Gemini was called
            mock_instance.generate_content.assert_called_once()
            assert "Real-world applications" in result

    def test_generate_general_section_without_textbook(self, general_knowledge_agent):
        """Should generate standalone general knowledge answer"""
        with patch("src.agents.general_knowledge.genai.GenerativeModel") as mock_model:
            mock_instance = MagicMock()
            mock_instance.generate_content.return_value.text = (
                "AI refers to artificial intelligence systems."
            )
            mock_model.return_value = mock_instance

            result = general_knowledge_agent._generate_general_section(
                query="What is AI?",
                textbook_answer=None,
                tone="beginner-friendly",
            )

            # Verify standalone answer
            assert "AI refers to" in result

    def test_handle_gemini_error_gracefully(self, general_knowledge_agent):
        """Should handle Gemini API errors gracefully"""
        with patch("src.agents.general_knowledge.genai.GenerativeModel") as mock_model:
            mock_model.side_effect = Exception("API Error")

            result = general_knowledge_agent._generate_general_section(
                query="What is AI?",
                textbook_answer=None,
                tone="academic",
            )

            # Should return fallback message
            assert "Unable to generate" in result


class TestEndToEndFlow:
    """Test complete end-to-end dual-pass flow"""

    def test_complete_dual_pass_flow(
        self, general_knowledge_agent, mock_textbook_chunks
    ):
        """Should execute complete dual-pass flow"""
        # Mock first pass (textbook retrieval)
        general_knowledge_agent._first_pass_textbook = Mock(
            return_value={
                "status": "success",
                "chunks": mock_textbook_chunks,
            }
        )

        # Mock second pass decision (use hybrid)
        general_knowledge_agent._second_pass_general = Mock(
            return_value={
                "answer": "Combined answer with labels",
                "has_external_knowledge": True,
                "mode": "general-knowledge",
            }
        )

        result = general_knowledge_agent.generate_answer(
            query="What are neural networks?",
            book_id="test-book",
            chapter="1",
            tone="academic",
        )

        # Verify both passes were executed
        general_knowledge_agent._first_pass_textbook.assert_called_once()
        general_knowledge_agent._second_pass_general.assert_called_once()
        assert result["mode"] == "general-knowledge"


class TestGlobalInstance:
    """Test global instance management"""

    def test_get_general_knowledge_agent_singleton(self):
        """Should return same instance"""
        with patch("src.agents.general_knowledge.get_retrieval_agent"), \
             patch("src.agents.general_knowledge.get_response_agent"), \
             patch("src.agents.general_knowledge.genai.configure"):
            agent1 = get_general_knowledge_agent()
            agent2 = get_general_knowledge_agent()

            assert agent1 is agent2

    def test_get_general_knowledge_agent_initialized(self):
        """Should return initialized instance"""
        with patch("src.agents.general_knowledge.get_retrieval_agent"), \
             patch("src.agents.general_knowledge.get_response_agent"), \
             patch("src.agents.general_knowledge.genai.configure"):
            agent = get_general_knowledge_agent()

            assert isinstance(agent, GeneralKnowledgeAgent)
            assert agent.textbook_weight == 0.7
            assert agent.general_weight == 0.3
