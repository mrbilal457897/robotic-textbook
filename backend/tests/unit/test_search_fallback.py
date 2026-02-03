"""
Unit tests for Search MCP Postgres fallback
Tests graceful degradation from vector search to full-text search
"""

import pytest
from unittest.mock import Mock, patch, MagicMock
from src.mcp.search import SearchMCP


@pytest.fixture
def mock_qdrant():
    """Mock Qdrant client"""
    with patch("src.mcp.search.get_qdrant") as mock:
        qdrant_instance = Mock()
        mock.return_value = qdrant_instance
        yield qdrant_instance


@pytest.fixture
def mock_postgres():
    """Mock Postgres client"""
    with patch("src.mcp.search.get_db") as mock:
        postgres_instance = Mock()
        mock.return_value = postgres_instance
        yield postgres_instance


@pytest.fixture
def search_mcp(mock_qdrant, mock_postgres):
    """Create SearchMCP instance with mocked dependencies"""
    return SearchMCP()


class TestVectorSearchPrimary:
    """Test that vector search is the primary method"""

    def test_uses_vector_search_when_available(self, search_mcp, mock_qdrant):
        """Should use Qdrant vector search when available"""
        # Mock successful vector search
        mock_results = [
            {
                "chunk_id": "chunk_001",
                "text": "Neural networks are computational models.",
                "metadata": {"book_id": "test-book"},
                "score": 0.85,
            }
        ]
        mock_qdrant.search.return_value = mock_results

        query_vector = [0.1] * 768
        results = search_mcp.search(
            query_vector=query_vector,
            query_text="What are neural networks?",
        )

        # Verify Qdrant was called
        mock_qdrant.search.assert_called_once()

        # Verify results match
        assert results == mock_results
        assert len(results) == 1

    def test_does_not_use_fallback_when_vector_search_succeeds(
        self, search_mcp, mock_qdrant, mock_postgres
    ):
        """Should not use Postgres fallback when vector search succeeds"""
        mock_qdrant.search.return_value = [{"chunk_id": "test", "score": 0.9}]

        query_vector = [0.1] * 768
        search_mcp.search(
            query_vector=query_vector,
            query_text="Test query",
        )

        # Verify Postgres was never called
        mock_postgres.execute_query.assert_not_called()


class TestPostgresFallback:
    """Test Postgres full-text search fallback"""

    def test_fallback_when_vector_search_fails(self, search_mcp, mock_qdrant, mock_postgres):
        """Should fall back to Postgres when vector search fails"""
        # Mock Qdrant failure
        mock_qdrant.search.side_effect = Exception("Qdrant unavailable")

        # Mock Postgres fallback success
        postgres_results = [
            {
                "chunk_id": "chunk_001",
                "text": "Neural networks are computational models.",
                "metadata": {"book_id": "test-book"},
                "score": 0.75,
            }
        ]
        mock_postgres.execute_query.return_value = postgres_results

        query_vector = [0.1] * 768
        results = search_mcp.search(
            query_vector=query_vector,
            query_text="What are neural networks?",
        )

        # Verify Postgres was called as fallback
        mock_postgres.execute_query.assert_called_once()

        # Verify results are marked as fallback
        assert len(results) == 1
        assert results[0]["is_fallback"] is True
        assert results[0]["chunk_id"] == "chunk_001"

    def test_fallback_requires_query_text(self, search_mcp, mock_qdrant):
        """Should not attempt fallback without query text"""
        # Mock Qdrant failure
        mock_qdrant.search.side_effect = Exception("Qdrant unavailable")

        query_vector = [0.1] * 768

        # Should raise original exception when query_text is not provided
        with pytest.raises(Exception, match="Qdrant unavailable"):
            search_mcp.search(
                query_vector=query_vector,
                query_text=None,  # No query text provided
            )

    def test_fallback_applies_book_filter(self, search_mcp, mock_qdrant, mock_postgres):
        """Should apply book_id filter in Postgres fallback"""
        # Mock Qdrant failure
        mock_qdrant.search.side_effect = Exception("Qdrant unavailable")

        # Mock Postgres success
        mock_postgres.execute_query.return_value = []

        query_vector = [0.1] * 768
        search_mcp.search(
            query_vector=query_vector,
            query_text="Test query",
            filters={"book_id": "intro-ai"},
        )

        # Verify Postgres query included book_id filter
        call_args = mock_postgres.execute_query.call_args
        query_sql = call_args[1]["query"]
        assert "metadata->>'book_id'" in query_sql

        # Verify book_id was passed as parameter
        params = call_args[1]["params"]
        assert "intro-ai" in params

    def test_fallback_applies_chapter_filter(self, search_mcp, mock_qdrant, mock_postgres):
        """Should apply chapter filter in Postgres fallback"""
        # Mock Qdrant failure
        mock_qdrant.search.side_effect = Exception("Qdrant unavailable")

        # Mock Postgres success
        mock_postgres.execute_query.return_value = []

        query_vector = [0.1] * 768
        search_mcp.search(
            query_vector=query_vector,
            query_text="Test query",
            filters={"book_id": "intro-ai", "chapter": "chapter-1"},
        )

        # Verify Postgres query included chapter filter
        call_args = mock_postgres.execute_query.call_args
        query_sql = call_args[1]["query"]
        assert "metadata->>'chapter'" in query_sql

        # Verify chapter was passed as parameter
        params = call_args[1]["params"]
        assert "chapter-1" in params

    def test_fallback_respects_top_k_limit(self, search_mcp, mock_qdrant, mock_postgres):
        """Should respect top_k limit in Postgres fallback"""
        # Mock Qdrant failure
        mock_qdrant.search.side_effect = Exception("Qdrant unavailable")

        # Mock Postgres success
        mock_postgres.execute_query.return_value = []

        query_vector = [0.1] * 768
        search_mcp.search(
            query_vector=query_vector,
            query_text="Test query",
            top_k=15,
        )

        # Verify LIMIT clause uses top_k
        call_args = mock_postgres.execute_query.call_args
        params = call_args[1]["params"]
        assert 15 in params  # top_k should be in params

    def test_fallback_returns_formatted_results(self, search_mcp, mock_qdrant, mock_postgres):
        """Should format Postgres results to match vector search output"""
        # Mock Qdrant failure
        mock_qdrant.search.side_effect = Exception("Qdrant unavailable")

        # Mock Postgres results
        postgres_results = [
            {
                "chunk_id": "chunk_001",
                "text": "Content about neural networks",
                "metadata": {"book_id": "ai-book", "chapter": "1"},
                "score": 0.654321,
            },
            {
                "chunk_id": "chunk_002",
                "text": "More content about networks",
                "metadata": {"book_id": "ai-book", "chapter": "1"},
                "score": 0.543210,
            },
        ]
        mock_postgres.execute_query.return_value = postgres_results

        query_vector = [0.1] * 768
        results = search_mcp.search(
            query_vector=query_vector,
            query_text="neural networks",
        )

        # Verify results structure
        assert len(results) == 2

        for i, result in enumerate(results):
            assert "chunk_id" in result
            assert "text" in result
            assert "metadata" in result
            assert "score" in result
            assert "is_fallback" in result
            assert result["is_fallback"] is True
            assert isinstance(result["score"], float)


class TestFallbackConfiguration:
    """Test fallback configuration"""

    def test_fallback_can_be_disabled(self, mock_qdrant, mock_postgres):
        """Should not use fallback when disabled via config"""
        with patch.dict("os.environ", {"ENABLE_POSTGRES_FALLBACK": "false"}):
            search_mcp = SearchMCP()

            # Mock Qdrant failure
            mock_qdrant.search.side_effect = Exception("Qdrant unavailable")

            query_vector = [0.1] * 768

            # Should raise exception without attempting fallback
            with pytest.raises(Exception, match="Qdrant unavailable"):
                search_mcp.search(
                    query_vector=query_vector,
                    query_text="Test query",
                )

            # Verify Postgres was never called
            mock_postgres.execute_query.assert_not_called()


class TestFallbackErrorHandling:
    """Test error handling in fallback scenarios"""

    def test_raises_original_error_when_fallback_fails(
        self, search_mcp, mock_qdrant, mock_postgres
    ):
        """Should raise original error when both vector search and fallback fail"""
        # Mock both failures
        mock_qdrant.search.side_effect = Exception("Qdrant unavailable")
        mock_postgres.execute_query.side_effect = Exception("Postgres also unavailable")

        query_vector = [0.1] * 768

        # Should raise the original Qdrant error
        with pytest.raises(Exception, match="Qdrant unavailable"):
            search_mcp.search(
                query_vector=query_vector,
                query_text="Test query",
            )

    def test_fallback_with_empty_results(self, search_mcp, mock_qdrant, mock_postgres):
        """Should handle empty Postgres results gracefully"""
        # Mock Qdrant failure
        mock_qdrant.search.side_effect = Exception("Qdrant unavailable")

        # Mock empty Postgres results
        mock_postgres.execute_query.return_value = []

        query_vector = [0.1] * 768
        results = search_mcp.search(
            query_vector=query_vector,
            query_text="No results query",
        )

        # Should return empty list
        assert results == []


class TestSearchByBookFallback:
    """Test fallback for search_by_book method"""

    def test_search_by_book_uses_fallback(self, search_mcp, mock_qdrant, mock_postgres):
        """search_by_book should use fallback when vector search fails"""
        # Mock Qdrant failure
        mock_qdrant.search.side_effect = Exception("Qdrant unavailable")

        # Mock Postgres success
        mock_postgres.execute_query.return_value = [
            {"chunk_id": "test", "text": "content", "metadata": {}, "score": 0.5}
        ]

        query_vector = [0.1] * 768
        results = search_mcp.search_by_book(
            query_vector=query_vector,
            book_id="test-book",
            query_text="Test query",
        )

        # Verify fallback was used
        assert len(results) == 1
        assert results[0]["is_fallback"] is True


class TestSearchByChapterFallback:
    """Test fallback for search_by_chapter method"""

    def test_search_by_chapter_uses_fallback(self, search_mcp, mock_qdrant, mock_postgres):
        """search_by_chapter should use fallback when vector search fails"""
        # Mock Qdrant failure
        mock_qdrant.search.side_effect = Exception("Qdrant unavailable")

        # Mock Postgres success
        mock_postgres.execute_query.return_value = [
            {"chunk_id": "test", "text": "content", "metadata": {}, "score": 0.5}
        ]

        query_vector = [0.1] * 768
        results = search_mcp.search_by_chapter(
            query_vector=query_vector,
            book_id="test-book",
            chapter="chapter-1",
            query_text="Test query",
        )

        # Verify fallback was used
        assert len(results) == 1
        assert results[0]["is_fallback"] is True
