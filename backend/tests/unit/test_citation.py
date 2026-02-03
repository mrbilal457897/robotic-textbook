"""
Unit tests for Citation Agent
Tests citation validation, formatting, and hallucination detection
"""

import pytest
from unittest.mock import Mock, patch
from src.agents.citation import CitationAgent, get_citation_agent


@pytest.fixture
def mock_metadata_mcp():
    """Mock MetadataMCP instance"""
    mock = Mock()
    mock.get_batch_metadata.return_value = [
        {
            "chunk_id": "intro-ai_chunk_00001",
            "text": "Machine learning is a subset of artificial intelligence...",
            "metadata": {
                "book_id": "intro-ai",
                "chapter": "1",
                "page": 10,
            },
        },
        {
            "chunk_id": "intro-ai_chunk_00002",
            "text": "Neural networks are computational models...",
            "metadata": {
                "book_id": "intro-ai",
                "chapter": "2",
                "page": 25,
            },
        },
    ]
    return mock


@pytest.fixture
def citation_agent(mock_metadata_mcp):
    """Fixture for Citation Agent with mocked dependencies"""
    with patch("src.agents.citation.get_metadata_mcp", return_value=mock_metadata_mcp):
        return CitationAgent()


@pytest.fixture
def sample_chunks():
    """Sample source chunks for testing"""
    return [
        {
            "main_chunk": {
                "chunk_id": "intro-ai_chunk_00001",
                "text": "Machine learning is a subset of AI...",
                "metadata": {"book_id": "intro-ai", "chapter": "1", "page": 10},
            },
            "context_before": [],
            "context_after": [],
        },
        {
            "main_chunk": {
                "chunk_id": "intro-ai_chunk_00002",
                "text": "Neural networks are inspired by biology...",
                "metadata": {"book_id": "intro-ai", "chapter": "2", "page": 25},
            },
            "context_before": [],
            "context_after": [],
        },
    ]


class TestCitationValidation:
    """Test citation validation logic"""

    def test_valid_citations(self, citation_agent, sample_chunks):
        """All citations should be valid when referencing source chunks"""
        response_text = (
            "Machine learning is a subset of AI [intro-ai_chunk_00001]. "
            "Neural networks are computational models [intro-ai_chunk_00002]."
        )

        result = citation_agent.validate_citations(
            response_text=response_text,
            source_chunks=sample_chunks,
            mode="book-only",
        )

        assert result["valid"] is True
        assert result["total_citations"] == 2
        assert len(result["invalid_citations"]) == 0

    def test_invalid_citation_detected(self, citation_agent, sample_chunks):
        """Invalid citation should be detected"""
        response_text = (
            "Machine learning is important [intro-ai_chunk_00001]. "
            "This is an unsourced claim [intro-ai_chunk_99999]."
        )

        result = citation_agent.validate_citations(
            response_text=response_text,
            source_chunks=sample_chunks,
            mode="book-only",
        )

        assert result["valid"] is False
        assert "intro-ai_chunk_99999" in result["invalid_citations"]

    def test_citation_coverage_calculation(self, citation_agent, sample_chunks):
        """Citation coverage should be calculated correctly"""
        response_text = "Machine learning is important [intro-ai_chunk_00001]."

        result = citation_agent.validate_citations(
            response_text=response_text,
            source_chunks=sample_chunks,
            mode="book-only",
        )

        # 1 citation out of 2 source chunks = 0.5 coverage
        assert result["citation_coverage"] == 0.5

    def test_no_citations_in_response(self, citation_agent, sample_chunks):
        """Response with no citations should be valid but have zero coverage"""
        response_text = "Machine learning is important."

        result = citation_agent.validate_citations(
            response_text=response_text,
            source_chunks=sample_chunks,
            mode="book-only",
        )

        assert result["valid"] is True  # No invalid citations
        assert result["total_citations"] == 0
        assert result["citation_coverage"] == 0.0


class TestCitationFormatting:
    """Test citation formatting"""

    def test_inline_format(self, citation_agent):
        """Inline format should use [chunk_id]"""
        citations = [
            {
                "chunk_id": "intro-ai_chunk_00001",
                "book_id": "intro-ai",
                "chapter": "1",
                "page": 10,
            }
        ]

        formatted = citation_agent.format_citations(citations, format_style="inline")

        assert formatted[0]["display"] == "[intro-ai_chunk_00001]"

    def test_footnote_format(self, citation_agent):
        """Footnote format should use numbered references"""
        citations = [
            {"chunk_id": "intro-ai_chunk_00001"},
            {"chunk_id": "intro-ai_chunk_00002"},
        ]

        formatted = citation_agent.format_citations(citations, format_style="footnote")

        assert formatted[0]["display"] == "[1]"
        assert formatted[1]["display"] == "[2]"

    def test_endnote_format(self, citation_agent):
        """Endnote format should include book, chapter, and page"""
        citations = [
            {
                "chunk_id": "intro-ai_chunk_00001",
                "book_id": "intro-ai",
                "chapter": "1",
                "page": 10,
            }
        ]

        formatted = citation_agent.format_citations(citations, format_style="endnote")

        assert "[intro-ai" in formatted[0]["display"]
        assert "Ch1" in formatted[0]["display"]
        assert "p10" in formatted[0]["display"]

    def test_index_added_to_citations(self, citation_agent):
        """Formatting should add index to each citation"""
        citations = [
            {"chunk_id": "chunk_001"},
            {"chunk_id": "chunk_002"},
        ]

        formatted = citation_agent.format_citations(citations)

        assert formatted[0]["index"] == 1
        assert formatted[1]["index"] == 2


class TestCitationEnrichment:
    """Test citation enrichment with metadata"""

    def test_enrich_with_metadata(self, citation_agent, mock_metadata_mcp):
        """Citations should be enriched with full metadata"""
        citations = [
            {"chunk_id": "intro-ai_chunk_00001"},
            {"chunk_id": "intro-ai_chunk_00002"},
        ]

        enriched = citation_agent.enrich_citations(citations)

        # Check that full_text and metadata were added
        assert "full_text" in enriched[0]
        assert "metadata" in enriched[0]

        # Verify MCP was called
        mock_metadata_mcp.get_batch_metadata.assert_called_once()

    def test_enrich_handles_missing_chunks(self, citation_agent, mock_metadata_mcp):
        """Enrichment should handle missing chunks gracefully"""
        citations = [
            {"chunk_id": "intro-ai_chunk_00001"},
            {"chunk_id": "nonexistent_chunk"},
        ]

        enriched = citation_agent.enrich_citations(citations)

        # Should return all citations even if some are missing
        assert len(enriched) == 2


class TestSelectedTextConstraintValidation:
    """Test selected-text-only mode constraint validation"""

    def test_valid_selected_text_constraint(self, citation_agent):
        """Citations within selected text should be valid"""
        selected_text = "Machine learning is a subset of AI. Neural networks are computational models."
        response_text = "Machine learning is important [intro-ai_chunk_00001]."
        citations = [
            {
                "chunk_id": "intro-ai_chunk_00001",
                "text": "Machine learning is a subset of AI",
            }
        ]

        result = citation_agent.verify_selected_text_constraint(
            response_text=response_text,
            selected_text=selected_text,
            citations=citations,
        )

        assert result["valid"] is True
        assert len(result["violations"]) == 0

    def test_invalid_selected_text_constraint(self, citation_agent):
        """Citations outside selected text should be detected as violations"""
        selected_text = "Machine learning is important."
        response_text = "Neural networks are models [intro-ai_chunk_00002]."
        citations = [
            {
                "chunk_id": "intro-ai_chunk_00002",
                "text": "Neural networks are inspired by biology",
            }
        ]

        result = citation_agent.verify_selected_text_constraint(
            response_text=response_text,
            selected_text=selected_text,
            citations=citations,
        )

        assert result["valid"] is False
        assert len(result["violations"]) > 0


class TestHallucinationDetection:
    """Test hallucination detection"""

    def test_uncited_claims_detected(self, citation_agent, sample_chunks):
        """Sentences without citations should be flagged"""
        response_text = (
            "Machine learning is important [intro-ai_chunk_00001]. "
            "This is an uncited claim that could be hallucination. "
            "Neural networks are powerful [intro-ai_chunk_00002]."
        )

        result = citation_agent.detect_hallucination(
            response_text=response_text,
            source_chunks=sample_chunks,
        )

        # Should detect uncited sentence
        assert result["detected"] is True
        assert any(issue["type"] == "uncited_claims" for issue in result["issues"])

    def test_excessive_elaboration_detected(self, citation_agent, sample_chunks):
        """Response much longer than source should be flagged"""
        short_source = [
            {
                "main_chunk": {
                    "chunk_id": "intro-ai_chunk_00001",
                    "text": "AI is important.",
                }
            }
        ]

        long_response = "Artificial intelligence is extremely important. " * 50

        result = citation_agent.detect_hallucination(
            response_text=long_response,
            source_chunks=short_source,
        )

        assert result["detected"] is True
        assert any(
            issue["type"] == "excessive_elaboration" for issue in result["issues"]
        )

    def test_no_hallucination(self, citation_agent, sample_chunks):
        """Well-cited response should not be flagged"""
        response_text = (
            "Machine learning is a subset of AI [intro-ai_chunk_00001]. "
            "Neural networks are inspired by biology [intro-ai_chunk_00002]."
        )

        result = citation_agent.detect_hallucination(
            response_text=response_text,
            source_chunks=sample_chunks,
        )

        assert result["detected"] is False
        assert len(result["issues"]) == 0


class TestCitationExtraction:
    """Test citation ID extraction from text"""

    def test_extract_citation_ids(self, citation_agent):
        """Should extract all citation IDs from text"""
        text = (
            "This is a claim [intro-ai_chunk_00001]. "
            "Another claim [intro-ai_chunk_00002]. "
            "Repeated citation [intro-ai_chunk_00001]."
        )

        ids = citation_agent._extract_citation_ids(text)

        # Should return unique IDs in order
        assert ids == ["intro-ai_chunk_00001", "intro-ai_chunk_00002"]

    def test_extract_no_citations(self, citation_agent):
        """Should return empty list when no citations"""
        text = "This text has no citations."

        ids = citation_agent._extract_citation_ids(text)

        assert ids == []


class TestSentenceSplitting:
    """Test sentence splitting utility"""

    def test_split_into_sentences(self, citation_agent):
        """Should split text into sentences correctly"""
        text = "First sentence. Second sentence! Third sentence?"

        sentences = citation_agent._split_into_sentences(text)

        assert len(sentences) == 3
        assert "First sentence" in sentences[0]

    def test_filter_empty_sentences(self, citation_agent):
        """Should filter out empty sentences"""
        text = "First sentence.  Second sentence."

        sentences = citation_agent._split_into_sentences(text)

        # Should not include empty strings
        assert all(s.strip() for s in sentences)


class TestMetaSentenceDetection:
    """Test meta-sentence detection"""

    def test_detect_question_prefix(self, citation_agent):
        """Should detect meta-text like 'Question:'"""
        sentence = "Question: What is machine learning?"

        is_meta = citation_agent._is_meta_sentence(sentence)

        assert is_meta is True

    def test_detect_summary_prefix(self, citation_agent):
        """Should detect summary meta-text"""
        sentence = "In summary, machine learning is important."

        is_meta = citation_agent._is_meta_sentence(sentence)

        assert is_meta is True

    def test_normal_sentence_not_meta(self, citation_agent):
        """Normal sentences should not be detected as meta"""
        sentence = "Machine learning is a subset of AI."

        is_meta = citation_agent._is_meta_sentence(sentence)

        assert is_meta is False


class TestSingletonPattern:
    """Test global instance getter"""

    def test_get_citation_agent_returns_instance(self):
        """get_citation_agent() should return CitationAgent instance"""
        with patch("src.agents.citation.get_metadata_mcp"):
            agent = get_citation_agent()

            assert isinstance(agent, CitationAgent)
