"""
Unit tests for Retrieval Agent
Tests vector search, confidence filtering, and chunk retrieval
"""

import pytest
from unittest.mock import Mock, MagicMock, patch
from src.agents.retrieval import RetrievalAgent, get_retrieval_agent


@pytest.fixture
def mock_embeddings_mcp():
    """Mock EmbeddingsMCP instance"""
    mock = Mock()
    mock.generate_embedding.return_value = {
        "embedding": [0.1] * 1024,
        "model": "embed-english-v3.0",
        "input_type": "search_query",
        "dimensions": 1024,
    }
    return mock


@pytest.fixture
def mock_search_mcp():
    """Mock SearchMCP instance"""
    mock = Mock()
    mock.search.return_value = [
        {
            "chunk_id": "intro-ai_chunk_00001",
            "text": "Machine learning is a subset of AI...",
            "score": 0.85,
            "metadata": {"book_id": "intro-ai", "chapter": "1", "page": 10},
        },
        {
            "chunk_id": "intro-ai_chunk_00002",
            "text": "Neural networks are inspired by...",
            "score": 0.78,
            "metadata": {"book_id": "intro-ai", "chapter": "2", "page": 25},
        },
        {
            "chunk_id": "intro-ai_chunk_00003",
            "text": "Backpropagation is the key algorithm...",
            "score": 0.65,
            "metadata": {"book_id": "intro-ai", "chapter": "3", "page": 42},
        },
    ]
    return mock


@pytest.fixture
def mock_metadata_mcp():
    """Mock MetadataMCP instance"""
    mock = Mock()
    mock.get_chunks_with_context.return_value = [
        {
            "main_chunk": {
                "chunk_id": "intro-ai_chunk_00001",
                "text": "Machine learning is a subset of AI...",
                "metadata": {"book_id": "intro-ai"},
            },
            "context_before": [],
            "context_after": [],
        }
    ]
    return mock


@pytest.fixture
def retrieval_agent(mock_embeddings_mcp, mock_search_mcp, mock_metadata_mcp):
    """Fixture for Retrieval Agent with mocked dependencies"""
    with patch("src.agents.retrieval.get_embeddings_mcp", return_value=mock_embeddings_mcp), \
         patch("src.agents.retrieval.get_search_mcp", return_value=mock_search_mcp), \
         patch("src.agents.retrieval.get_metadata_mcp", return_value=mock_metadata_mcp):
        agent = RetrievalAgent()
        agent.confidence_threshold = 0.70
        return agent


class TestEmbeddingGeneration:
    """Test query embedding generation"""

    def test_embedding_generation_called(self, retrieval_agent, mock_embeddings_mcp):
        """Embedding generation should be called with correct input type"""
        retrieval_agent.retrieve(
            query="What is machine learning?",
            mode="book-only",
            filters={"book_id": "intro-ai"},
        )

        mock_embeddings_mcp.generate_embedding.assert_called_once_with(
            text="What is machine learning?",
            input_type="search_query",
        )

    def test_embedding_vector_used_for_search(self, retrieval_agent, mock_search_mcp):
        """Generated embedding should be passed to search"""
        retrieval_agent.retrieve(
            query="What is AI?",
            mode="book-only",
        )

        # Check that search was called with embedding vector
        call_args = mock_search_mcp.search.call_args
        assert "query_vector" in call_args.kwargs
        assert len(call_args.kwargs["query_vector"]) == 1024


class TestVectorSearch:
    """Test vector similarity search"""

    def test_search_with_filters(self, retrieval_agent, mock_search_mcp):
        """Search should apply metadata filters"""
        retrieval_agent.retrieve(
            query="What is AI?",
            mode="book-only",
            filters={"book_id": "intro-ai", "chapter": "1"},
        )

        # Check that filters were passed
        call_args = mock_search_mcp.search.call_args
        assert call_args.kwargs["filters"]["book_id"] == "intro-ai"
        assert call_args.kwargs["filters"]["chapter"] == "1"

    def test_search_top_k_parameter(self, retrieval_agent, mock_search_mcp):
        """Search should use configured top_k"""
        retrieval_agent.top_k_candidates = 15

        retrieval_agent.retrieve(
            query="What is AI?",
            mode="book-only",
        )

        call_args = mock_search_mcp.search.call_args
        assert call_args.kwargs["top_k"] == 15


class TestConfidenceFiltering:
    """Test confidence threshold validation"""

    def test_confidence_threshold_applied(self, retrieval_agent, mock_search_mcp):
        """Chunks below threshold should be filtered out"""
        # Mock search returns chunks with scores: 0.85, 0.78, 0.65
        # With threshold 0.70, should filter out the 0.65 chunk

        retrieval_agent.confidence_threshold = 0.70

        result = retrieval_agent.retrieve(
            query="What is AI?",
            mode="book-only",
        )

        # Should have 2 chunks (0.85, 0.78) after filtering
        assert result["metadata"]["after_confidence"] == 2

    def test_all_chunks_below_threshold(self, retrieval_agent, mock_search_mcp):
        """Should return no_results status if all chunks below threshold"""
        # Set very high threshold
        retrieval_agent.confidence_threshold = 0.90

        result = retrieval_agent.retrieve(
            query="What is AI?",
            mode="book-only",
        )

        assert result["status"] == "no_results"
        assert result["metadata"]["after_confidence"] == 0

    def test_refusal_reason_below_threshold(self, retrieval_agent):
        """Should provide refusal reason when filtered by confidence"""
        retrieval_agent.confidence_threshold = 0.90

        result = retrieval_agent.retrieve(
            query="What is AI?",
            mode="book-only",
        )

        assert "refusal_reason" in result
        assert result["refusal_reason"] == "below_confidence_threshold"


class TestModeFiltering:
    """Test mode-specific filtering"""

    def test_book_only_mode_validates_book_id(self, retrieval_agent, mock_search_mcp):
        """Book-only mode should validate chunks have book_id"""
        # Add a chunk without book_id
        mock_search_mcp.search.return_value.append({
            "chunk_id": "invalid_chunk",
            "text": "No metadata",
            "score": 0.80,
            "metadata": {},  # Missing book_id
        })

        result = retrieval_agent.retrieve(
            query="What is AI?",
            mode="book-only",
            filters={"book_id": "intro-ai"},
        )

        # Invalid chunk should be filtered out
        chunk_ids = [c["main_chunk"]["chunk_id"] for c in result["chunks"]]
        assert "invalid_chunk" not in chunk_ids

    def test_selected_text_mode_no_filtering(self, retrieval_agent):
        """Selected-text mode should defer filtering to Citation Agent"""
        result = retrieval_agent.retrieve(
            query="Explain this",
            mode="selected-text-only",
        )

        # Should not filter by book_id
        assert result["metadata"]["after_filtering"] >= 0


class TestContextRetrieval:
    """Test context window retrieval"""

    def test_context_window_disabled_by_default(self, retrieval_agent, mock_metadata_mcp):
        """Context window should be disabled by default"""
        retrieval_agent.retrieve(
            query="What is AI?",
            mode="book-only",
        )

        # Should not call get_chunks_with_context
        mock_metadata_mcp.get_chunks_with_context.assert_not_called()

    def test_context_window_enabled(self, retrieval_agent, mock_metadata_mcp):
        """Context window should retrieve surrounding chunks when enabled"""
        retrieval_agent.retrieve(
            query="What is AI?",
            mode="book-only",
            context_window=1,
        )

        # Should call get_chunks_with_context
        mock_metadata_mcp.get_chunks_with_context.assert_called_once()

        call_args = mock_metadata_mcp.get_chunks_with_context.call_args
        assert call_args.kwargs["context_window"] == 1


class TestRetrievalResult:
    """Test retrieval result structure"""

    def test_successful_retrieval_structure(self, retrieval_agent):
        """Successful retrieval should have correct structure"""
        result = retrieval_agent.retrieve(
            query="What is AI?",
            mode="book-only",
        )

        assert "status" in result
        assert "query" in result
        assert "mode" in result
        assert "chunks" in result
        assert "metadata" in result

        # Check metadata fields
        assert "candidates_found" in result["metadata"]
        assert "after_filtering" in result["metadata"]
        assert "after_confidence" in result["metadata"]
        assert "confidence_threshold" in result["metadata"]

    def test_no_results_status(self, retrieval_agent, mock_search_mcp):
        """No results should return proper status"""
        mock_search_mcp.search.return_value = []

        result = retrieval_agent.retrieve(
            query="Unknown topic",
            mode="book-only",
        )

        assert result["status"] == "no_results"
        assert "refusal_reason" in result


class TestConvenienceMethods:
    """Test convenience retrieval methods"""

    def test_retrieve_by_book(self, retrieval_agent, mock_search_mcp):
        """retrieve_by_book should apply book filter"""
        retrieval_agent.retrieve_by_book(
            query="What is AI?",
            book_id="intro-ai",
            chapter="1",
        )

        call_args = mock_search_mcp.search.call_args
        assert call_args.kwargs["filters"]["book_id"] == "intro-ai"
        assert call_args.kwargs["filters"]["chapter"] == "1"


class TestReranking:
    """Test reranking functionality"""

    def test_reranking_disabled_by_default(self, retrieval_agent):
        """Reranking should be disabled by default"""
        assert retrieval_agent.enable_reranking is False

    def test_reranking_fallback(self, retrieval_agent):
        """Reranking should fall back to vector scores when not implemented"""
        retrieval_agent.enable_reranking = True
        retrieval_agent.top_k_final = 2

        result = retrieval_agent.retrieve(
            query="What is AI?",
            mode="book-only",
        )

        # Should return top 2 chunks by vector score
        assert len(result["chunks"]) <= 2


class TestSingletonPattern:
    """Test global instance getter"""

    def test_get_retrieval_agent_returns_instance(self):
        """get_retrieval_agent() should return RetrievalAgent instance"""
        with patch("src.agents.retrieval.get_embeddings_mcp"), \
             patch("src.agents.retrieval.get_search_mcp"), \
             patch("src.agents.retrieval.get_metadata_mcp"):
            agent = get_retrieval_agent()

            assert isinstance(agent, RetrievalAgent)
