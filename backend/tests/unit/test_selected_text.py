"""
Unit tests for Selected-Text Agent
Tests selection validation, context sufficiency, and zero vector search enforcement
"""

import pytest
from src.agents.selected_text import (
    SelectedTextAgent,
    TextAction,
    get_selected_text_agent,
)


@pytest.fixture
def selected_text_agent():
    """Fixture for Selected-Text Agent instance"""
    return SelectedTextAgent()


class TestSelectionValidation:
    """Test selection validation logic"""

    def test_empty_selection_rejected(self, selected_text_agent):
        """Empty selection should be rejected"""
        result = selected_text_agent.validate_selection("")

        assert result["is_valid"] is False
        assert result["error_code"] == "EMPTY_SELECTION"
        assert "No text selected" in result["error"]

    def test_whitespace_only_rejected(self, selected_text_agent):
        """Whitespace-only selection should be rejected"""
        result = selected_text_agent.validate_selection("   \n\t  ")

        assert result["is_valid"] is False
        assert result["error_code"] == "EMPTY_SELECTION"

    def test_selection_too_short_rejected(self, selected_text_agent):
        """Selection below minimum token count should be rejected"""
        # Create text with ~30 tokens (below 50 minimum)
        short_text = "This is a very short text passage."

        result = selected_text_agent.validate_selection(short_text)

        assert result["is_valid"] is False
        assert result["error_code"] == "SELECTION_TOO_SHORT"
        assert "too short" in result["error"].lower()
        assert "token_count" in result

    def test_selection_too_long_rejected(self, selected_text_agent):
        """Selection above maximum token count should be rejected"""
        # Create text with ~4500 tokens (above 4000 maximum)
        # Rough estimate: 1 token ≈ 4 characters
        long_text = "word " * 5000  # ~20,000 characters = ~5000 tokens

        result = selected_text_agent.validate_selection(long_text)

        assert result["is_valid"] is False
        assert result["error_code"] == "SELECTION_TOO_LONG"
        assert "too long" in result["error"].lower()
        assert "token_count" in result

    def test_valid_selection_minimum_boundary(self, selected_text_agent):
        """Selection at minimum boundary should pass"""
        # Create text with exactly ~50 tokens (200 characters)
        valid_text = "word " * 50  # ~250 characters = ~62 tokens

        result = selected_text_agent.validate_selection(valid_text)

        assert result["is_valid"] is True
        assert "token_count" in result
        assert result["token_count"] >= 50

    def test_valid_selection_maximum_boundary(self, selected_text_agent):
        """Selection at maximum boundary should pass"""
        # Create text with exactly ~4000 tokens (16,000 characters)
        valid_text = "word " * 3200  # ~16,000 characters = ~4000 tokens

        result = selected_text_agent.validate_selection(valid_text)

        assert result["is_valid"] is True
        assert "token_count" in result
        assert result["token_count"] <= 4000

    def test_valid_selection_typical_paragraph(self, selected_text_agent):
        """Typical paragraph selection should pass"""
        paragraph = """
        Neural networks are computational models inspired by the human brain.
        They consist of interconnected nodes (neurons) organized in layers.
        Each connection has a weight that adjusts during training.
        The network learns by adjusting these weights to minimize errors
        between predicted and actual outputs. This process is called backpropagation.
        """

        result = selected_text_agent.validate_selection(paragraph)

        assert result["is_valid"] is True
        assert result["token_count"] > 0
        assert result["char_count"] == len(paragraph)

    def test_suspicious_content_script_tag(self, selected_text_agent):
        """Script tags should be detected as suspicious"""
        malicious_text = """
        This is some text with <script>alert('xss')</script> injection.
        """ * 20  # Make it long enough to pass length check

        result = selected_text_agent.validate_selection(malicious_text)

        assert result["is_valid"] is False
        assert result["error_code"] == "INVALID_CONTENT"

    def test_suspicious_content_javascript_protocol(self, selected_text_agent):
        """JavaScript protocol should be detected as suspicious"""
        malicious_text = """
        Click here: javascript:void(0) to continue.
        """ * 20

        result = selected_text_agent.validate_selection(malicious_text)

        assert result["is_valid"] is False
        assert result["error_code"] == "INVALID_CONTENT"


class TestProcessSelection:
    """Test process_selection method"""

    def test_successful_processing(self, selected_text_agent):
        """Valid selection should be processed successfully"""
        selected_text = """
        Reinforcement learning is a type of machine learning where an agent
        learns to make decisions by interacting with an environment.
        The agent receives rewards or penalties based on its actions,
        and learns to maximize cumulative reward over time.
        """

        query = "What is reinforcement learning?"

        result = selected_text_agent.process_selection(
            query=query, selected_text=selected_text
        )

        assert result["status"] == "success"
        assert result["mode"] == "selected-text-only"
        assert result["bypass_vector_search"] is True
        assert "context" in result
        assert "action" in result
        assert result["token_count"] > 0

    def test_validation_error_propagation(self, selected_text_agent):
        """Validation errors should be propagated"""
        short_text = "Too short."

        result = selected_text_agent.process_selection(
            query="Explain this", selected_text=short_text
        )

        assert result["status"] == "validation_error"
        assert "error" in result
        assert "error_code" in result

    def test_explicit_action_used(self, selected_text_agent):
        """Explicit action should be used when provided"""
        selected_text = "Neural networks consist of layers of neurons. " * 10

        result = selected_text_agent.process_selection(
            query="What is this?",
            selected_text=selected_text,
            action=TextAction.SUMMARIZE,
        )

        assert result["status"] == "success"
        assert result["action"] == TextAction.SUMMARIZE

    def test_inferred_action_summarize(self, selected_text_agent):
        """Summarize action should be inferred from query"""
        selected_text = "Neural networks consist of layers of neurons. " * 10

        result = selected_text_agent.process_selection(
            query="Can you summarize this?", selected_text=selected_text
        )

        assert result["status"] == "success"
        assert result["action"] == TextAction.SUMMARIZE

    def test_inferred_action_simplify(self, selected_text_agent):
        """Simplify action should be inferred from query"""
        selected_text = "Neural networks consist of layers of neurons. " * 10

        result = selected_text_agent.process_selection(
            query="Explain this in simpler terms", selected_text=selected_text
        )

        assert result["status"] == "success"
        assert result["action"] == TextAction.SIMPLIFY

    def test_inferred_action_example(self, selected_text_agent):
        """Example action should be inferred from query"""
        selected_text = "Neural networks consist of layers of neurons. " * 10

        result = selected_text_agent.process_selection(
            query="Give me an example", selected_text=selected_text
        )

        assert result["status"] == "success"
        assert result["action"] == TextAction.EXAMPLE

    def test_default_action_explain(self, selected_text_agent):
        """Default action should be explain"""
        selected_text = """
        Neural networks consist of layers of neurons arranged in a hierarchical structure.
        Each layer processes information and passes it to the next layer.
        The connections between neurons have weights that are adjusted during training.
        This allows the network to learn patterns in data.
        """

        result = selected_text_agent.process_selection(
            query="Explain neural networks", selected_text=selected_text
        )

        assert result["status"] == "success"
        assert result["action"] == TextAction.EXPLAIN

    def test_metadata_included(self, selected_text_agent):
        """Metadata should be included in result"""
        selected_text = "Neural networks consist of layers of neurons. " * 10
        metadata = {
            "book_id": "phys-ai-textbook",
            "chapter": 3,
            "page": 42,
        }

        result = selected_text_agent.process_selection(
            query="Explain this",
            selected_text=selected_text,
            metadata=metadata,
        )

        assert result["status"] == "success"
        assert result["metadata"] == metadata


class TestContextSufficiency:
    """Test context sufficiency detection"""

    def test_definition_query_term_present(self, selected_text_agent):
        """Definition query with term in selection should pass"""
        selected_text = """
        Backpropagation is an algorithm used to train neural networks.
        It works by computing gradients of the loss function with respect
        to each weight in the network.
        """

        query = "What is backpropagation?"

        result = selected_text_agent._check_context_sufficiency(
            query=query, selected_text=selected_text, action=None
        )

        assert result["is_sufficient"] is True

    def test_definition_query_term_missing(self, selected_text_agent):
        """Definition query with term not in selection should fail"""
        selected_text = """
        Gradient descent is an optimization algorithm.
        It iteratively adjusts parameters to minimize a loss function.
        """

        query = "What is backpropagation?"  # Not mentioned in text

        result = selected_text_agent._check_context_sufficiency(
            query=query, selected_text=selected_text, action=None
        )

        assert result["is_sufficient"] is False
        assert "suggestion" in result

    def test_single_sentence_simple_query(self, selected_text_agent):
        """Single sentence with simple query should pass"""
        selected_text = "Neural networks are inspired by the human brain."

        query = "Summarize this"

        result = selected_text_agent._check_context_sufficiency(
            query=query, selected_text=selected_text, action=TextAction.SUMMARIZE
        )

        assert result["is_sufficient"] is True

    def test_single_sentence_complex_query(self, selected_text_agent):
        """Single sentence with complex query should fail"""
        selected_text = "Neural networks are inspired by the human brain."

        query = "Explain the architecture and training process of neural networks"

        result = selected_text_agent._check_context_sufficiency(
            query=query, selected_text=selected_text, action=None
        )

        assert result["is_sufficient"] is False

    def test_example_action_with_examples(self, selected_text_agent):
        """Example action with examples in text should pass"""
        selected_text = """
        Neural networks have many applications. For example, they are used
        in image recognition and natural language processing. Another example
        is autonomous vehicle control.
        """

        query = "Give me examples"

        result = selected_text_agent._check_context_sufficiency(
            query=query, selected_text=selected_text, action=TextAction.EXAMPLE
        )

        assert result["is_sufficient"] is True

    def test_example_action_without_examples(self, selected_text_agent):
        """Example action without examples in text should fail"""
        selected_text = "Neural networks are computational models."

        query = "Give me examples"

        result = selected_text_agent._check_context_sufficiency(
            query=query, selected_text=selected_text, action=TextAction.EXAMPLE
        )

        assert result["is_sufficient"] is False


class TestContextFormatting:
    """Test context formatting for Response Agent"""

    def test_context_structure(self, selected_text_agent):
        """Formatted context should match Response Agent expectations"""
        selected_text = "Neural networks are computational models."
        metadata = {"book_id": "test-book", "chapter": 1}

        context = selected_text_agent._format_context(selected_text, metadata)

        assert isinstance(context, list)
        assert len(context) == 1
        assert "main_chunk" in context[0]
        assert "context_before" in context[0]
        assert "context_after" in context[0]

    def test_chunk_properties(self, selected_text_agent):
        """Main chunk should have required properties"""
        selected_text = "Neural networks are computational models."
        metadata = {"book_id": "test-book", "chapter": 1}

        context = selected_text_agent._format_context(selected_text, metadata)

        main_chunk = context[0]["main_chunk"]

        assert main_chunk["chunk_id"] == "selected_text"
        assert main_chunk["text"] == selected_text
        assert main_chunk["score"] == 1.0
        assert main_chunk["metadata"] == metadata
        assert main_chunk["source"] == "user_selection"

    def test_no_surrounding_context(self, selected_text_agent):
        """Context before/after should be empty"""
        selected_text = "Neural networks are computational models."

        context = selected_text_agent._format_context(selected_text, None)

        assert context[0]["context_before"] == []
        assert context[0]["context_after"] == []


class TestZeroVectorSearchEnforcement:
    """Test that vector search is never triggered (T092)"""

    def test_bypass_flag_always_true(self, selected_text_agent):
        """Bypass vector search flag should always be True"""
        selected_text = "Neural networks are computational models. " * 10

        result = selected_text_agent.process_selection(
            query="Explain this", selected_text=selected_text
        )

        assert result["bypass_vector_search"] is True

    def test_no_embedding_generation(self, selected_text_agent):
        """No embedding generation should occur"""
        # This test verifies by checking that the result doesn't contain
        # any embedding-related fields that would indicate vector search
        selected_text = "Neural networks are computational models. " * 10

        result = selected_text_agent.process_selection(
            query="Explain this", selected_text=selected_text
        )

        # Verify no vector search artifacts
        assert "embedding" not in result
        assert "similarity_score" not in result
        assert "vector_search_results" not in result

    def test_mode_always_selected_text_only(self, selected_text_agent):
        """Mode should always be selected-text-only"""
        selected_text = "Neural networks are computational models. " * 10

        result = selected_text_agent.process_selection(
            query="Explain this", selected_text=selected_text
        )

        assert result["mode"] == "selected-text-only"


class TestKeywordExtraction:
    """Test keyword extraction from queries"""

    def test_extract_meaningful_keywords(self, selected_text_agent):
        """Should extract meaningful keywords"""
        query = "What is the difference between supervised and unsupervised learning?"

        keywords = selected_text_agent._extract_keywords(query)

        assert "difference" in keywords
        assert "supervised" in keywords
        assert "unsupervised" in keywords
        assert "learning" in keywords

    def test_filter_stop_words(self, selected_text_agent):
        """Should filter out stop words"""
        query = "What is the difference between supervised and unsupervised learning?"

        keywords = selected_text_agent._extract_keywords(query)

        # Stop words should be filtered
        assert "what" not in keywords
        assert "is" not in keywords
        assert "the" not in keywords
        assert "and" not in keywords

    def test_filter_short_words(self, selected_text_agent):
        """Should filter out short words"""
        query = "What is AI in ML?"

        keywords = selected_text_agent._extract_keywords(query)

        # Short words (≤2 chars) should be filtered
        assert "in" not in keywords
        assert "is" not in keywords
        # AI and ML might be filtered or included depending on implementation


class TestTokenEstimation:
    """Test token estimation"""

    def test_estimate_tokens_typical_text(self, selected_text_agent):
        """Should estimate tokens for typical text"""
        text = "This is a sample text with approximately twenty-five words to test the token estimation function accurately."

        tokens = selected_text_agent._estimate_tokens(text)

        # Rough estimate: 1 token ≈ 4 characters
        # This text is ~105 characters, so ~26 tokens
        assert 20 <= tokens <= 35

    def test_estimate_tokens_short_text(self, selected_text_agent):
        """Should estimate tokens for short text"""
        text = "Short text"

        tokens = selected_text_agent._estimate_tokens(text)

        assert tokens > 0
        assert tokens < 10

    def test_estimate_tokens_long_text(self, selected_text_agent):
        """Should estimate tokens for long text"""
        text = "word " * 1000  # ~5000 characters = ~1250 tokens

        tokens = selected_text_agent._estimate_tokens(text)

        assert 1000 <= tokens <= 1500


class TestGlobalInstance:
    """Test global instance management"""

    def test_get_selected_text_agent_singleton(self):
        """Should return same instance"""
        agent1 = get_selected_text_agent()
        agent2 = get_selected_text_agent()

        assert agent1 is agent2

    def test_get_selected_text_agent_initialized(self):
        """Should return initialized instance"""
        agent = get_selected_text_agent()

        assert isinstance(agent, SelectedTextAgent)
        assert agent.min_tokens == 50
        assert agent.max_tokens == 4000
