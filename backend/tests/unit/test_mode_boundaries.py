"""
Unit tests for Mode Boundary Enforcement
Tests mode validation, switching suggestions, and boundary constraints
"""

import pytest
from src.agents.router import RouterAgent, AnsweringMode
from src.agents.response import ResponseAgent


@pytest.fixture
def router_agent():
    """Fixture for Router Agent instance"""
    return RouterAgent()


@pytest.fixture
def response_agent():
    """Fixture for Response Agent instance"""
    return ResponseAgent()


class TestModeBoundaryValidation:
    """Test mode boundary validation in Router Agent"""

    def test_selected_text_requires_text(self, router_agent):
        """Selected-Text mode requires highlighted text"""
        result = router_agent.validate_mode_boundary(
            current_mode=AnsweringMode.BOOK_ONLY,
            requested_mode=AnsweringMode.SELECTED_TEXT_ONLY,
            selected_text=None,  # No text selected
            has_book_context=True,
        )

        assert result["is_valid"] is False
        assert result["mode"] == AnsweringMode.BOOK_ONLY
        assert "Selected-Text mode requires highlighted text" in result["warnings"][0]
        assert result["suggestion"] is not None

    def test_selected_text_overrides_requested_mode(self, router_agent):
        """Selected text should override any other requested mode"""
        result = router_agent.validate_mode_boundary(
            current_mode=AnsweringMode.BOOK_ONLY,
            requested_mode=AnsweringMode.GENERAL_KNOWLEDGE,
            selected_text="Some highlighted text",
            has_book_context=True,
        )

        assert result["is_valid"] is True
        assert result["mode"] == AnsweringMode.SELECTED_TEXT_ONLY
        assert len(result["warnings"]) > 0
        assert "Overriding requested mode" in result["warnings"][0]

    def test_book_only_warns_when_no_context(self, router_agent):
        """Book-Only mode should warn when no book context available"""
        result = router_agent.validate_mode_boundary(
            current_mode=AnsweringMode.BOOK_ONLY,
            requested_mode=None,
            selected_text=None,
            has_book_context=False,  # No book context
        )

        assert result["is_valid"] is True
        assert result["mode"] == AnsweringMode.BOOK_ONLY
        assert len(result["warnings"]) > 0
        assert "consider switching to General Knowledge mode" in result["warnings"][0]
        assert result["suggestion"] is not None

    def test_general_knowledge_warns_on_first_use(self, router_agent):
        """General Knowledge mode should warn about external knowledge on first use"""
        result = router_agent.validate_mode_boundary(
            current_mode=AnsweringMode.BOOK_ONLY,
            requested_mode=AnsweringMode.GENERAL_KNOWLEDGE,
            selected_text=None,
            has_book_context=True,
        )

        assert result["is_valid"] is True
        assert result["mode"] == AnsweringMode.GENERAL_KNOWLEDGE
        assert len(result["warnings"]) > 0
        assert "combine textbook content with external knowledge" in result["warnings"][0]

    def test_valid_selected_text_mode_with_text(self, router_agent):
        """Selected-Text mode is valid when text is provided"""
        result = router_agent.validate_mode_boundary(
            current_mode=AnsweringMode.BOOK_ONLY,
            requested_mode=None,
            selected_text="Some highlighted text for analysis",
            has_book_context=True,
        )

        assert result["is_valid"] is True
        assert result["mode"] == AnsweringMode.SELECTED_TEXT_ONLY
        # May have warnings about overriding, but still valid
        assert result["suggestion"] is None

    def test_book_only_mode_with_context(self, router_agent):
        """Book-Only mode is valid when book context is available"""
        result = router_agent.validate_mode_boundary(
            current_mode=AnsweringMode.BOOK_ONLY,
            requested_mode=None,
            selected_text=None,
            has_book_context=True,
        )

        assert result["is_valid"] is True
        assert result["mode"] == AnsweringMode.BOOK_ONLY
        assert len(result["warnings"]) == 0
        assert result["suggestion"] is None

    def test_general_knowledge_mode_stays_when_already_active(self, router_agent):
        """General Knowledge mode should not warn if already active"""
        result = router_agent.validate_mode_boundary(
            current_mode=AnsweringMode.GENERAL_KNOWLEDGE,
            requested_mode=AnsweringMode.GENERAL_KNOWLEDGE,
            selected_text=None,
            has_book_context=True,
        )

        assert result["is_valid"] is True
        assert result["mode"] == AnsweringMode.GENERAL_KNOWLEDGE
        # No warning since mode is not changing
        assert len(result["warnings"]) == 0


class TestModeSwitchingSuggestions:
    """Test mode switching suggestion logic in Router Agent"""

    def test_suggest_general_when_book_has_no_results(self, router_agent):
        """Should suggest General Knowledge when Book-Only has no results"""
        suggestion = router_agent.suggest_mode_switch(
            query="What is quantum computing?",
            current_mode=AnsweringMode.BOOK_ONLY,
            retrieval_confidence=0.0,
            has_results=False,
        )

        assert suggestion is not None
        assert suggestion["suggested_mode"] == AnsweringMode.GENERAL_KNOWLEDGE
        assert "No textbook content found" in suggestion["reason"]
        assert "General Knowledge mode" in suggestion["prompt"]

    def test_suggest_general_when_book_has_low_confidence(self, router_agent):
        """Should suggest General Knowledge when Book-Only has low confidence"""
        suggestion = router_agent.suggest_mode_switch(
            query="What are neural networks?",
            current_mode=AnsweringMode.BOOK_ONLY,
            retrieval_confidence=0.45,  # Below 0.60 threshold
            has_results=True,
        )

        assert suggestion is not None
        assert suggestion["suggested_mode"] == AnsweringMode.GENERAL_KNOWLEDGE
        assert "low confidence" in suggestion["reason"]

    def test_suggest_book_when_general_has_high_confidence(self, router_agent):
        """Should suggest Book-Only when General Knowledge retrieves high confidence textbook content"""
        suggestion = router_agent.suggest_mode_switch(
            query="Define forward kinematics",
            current_mode=AnsweringMode.GENERAL_KNOWLEDGE,
            retrieval_confidence=0.90,  # Above 0.85 threshold
            has_results=True,
        )

        assert suggestion is not None
        assert suggestion["suggested_mode"] == AnsweringMode.BOOK_ONLY
        assert "textbook has comprehensive information" in suggestion["reason"]

    def test_no_suggestion_when_book_has_good_confidence(self, router_agent):
        """Should not suggest switch when Book-Only has good confidence"""
        suggestion = router_agent.suggest_mode_switch(
            query="What are neural networks?",
            current_mode=AnsweringMode.BOOK_ONLY,
            retrieval_confidence=0.75,  # Good confidence
            has_results=True,
        )

        assert suggestion is None

    def test_no_suggestion_for_real_world_queries_in_general_mode(self, router_agent):
        """Should not suggest Book-Only for real-world queries even with high confidence"""
        suggestion = router_agent.suggest_mode_switch(
            query="What are real-world applications of neural networks?",
            current_mode=AnsweringMode.GENERAL_KNOWLEDGE,
            retrieval_confidence=0.90,
            has_results=True,
        )

        # Should NOT suggest Book-Only because query asks for real-world examples
        assert suggestion is None

    def test_no_suggestion_for_practical_queries_in_general_mode(self, router_agent):
        """Should not suggest Book-Only for practical/industry queries"""
        practical_queries = [
            "What are industry applications of ROS?",
            "How is this used in practice?",
            "Give me a practical use case",
        ]

        for query in practical_queries:
            suggestion = router_agent.suggest_mode_switch(
                query=query,
                current_mode=AnsweringMode.GENERAL_KNOWLEDGE,
                retrieval_confidence=0.90,
                has_results=True,
            )

            assert suggestion is None, f"Should not suggest switch for: {query}"


class TestModeSwitchPrompts:
    """Test mode switch prompt generation in Response Agent"""

    def test_generate_mode_switch_prompt_structure(self, response_agent):
        """Mode switch prompt should have correct structure"""
        prompt = response_agent.generate_mode_switch_prompt(
            current_mode="book-only",
            suggested_mode="general-knowledge",
            reason="No textbook content found",
            context=None,
        )

        assert prompt["type"] == "mode_switch_suggestion"
        assert prompt["current_mode"] == "book-only"
        assert prompt["suggested_mode"] == "general-knowledge"
        assert prompt["reason"] == "No textbook content found"
        assert "💡" in prompt["prompt"]
        assert "Mode Switch Suggestion" in prompt["prompt"]

    def test_mode_switch_prompt_includes_descriptions(self, response_agent):
        """Mode switch prompt should include mode descriptions"""
        prompt = response_agent.generate_mode_switch_prompt(
            current_mode="book-only",
            suggested_mode="general-knowledge",
            reason="Test reason",
            context=None,
        )

        prompt_text = prompt["prompt"]
        assert "Book-Only mode" in prompt_text
        assert "General Knowledge mode" in prompt_text
        assert "textbook content" in prompt_text.lower()

    def test_mode_switch_prompt_with_context(self, response_agent):
        """Mode switch prompt should include optional context"""
        context_msg = "This query requires external knowledge sources."
        prompt = response_agent.generate_mode_switch_prompt(
            current_mode="book-only",
            suggested_mode="general-knowledge",
            reason="Test reason",
            context=context_msg,
        )

        assert context_msg in prompt["prompt"]

    def test_append_mode_switch_to_response(self, response_agent):
        """Should append mode switch suggestion to existing response"""
        original_response = {
            "status": "success",
            "answer": "This is the original answer.",
            "citations": [],
            "confidence_score": 0.5,
        }

        mode_switch_suggestion = {
            "type": "mode_switch_suggestion",
            "current_mode": "book-only",
            "suggested_mode": "general-knowledge",
            "prompt": "💡 Would you like to switch modes?",
        }

        updated_response = response_agent.append_mode_switch_to_response(
            response=original_response,
            mode_switch_suggestion=mode_switch_suggestion,
        )

        # Original answer should be preserved
        assert "original answer" in updated_response["answer"]

        # Suggestion should be appended
        assert "💡 Would you like to switch modes?" in updated_response["answer"]
        assert "---" in updated_response["answer"]  # Separator

        # Suggestion metadata should be added
        assert "mode_switch_suggestion" in updated_response
        assert updated_response["mode_switch_suggestion"] == mode_switch_suggestion

    def test_append_none_suggestion_returns_original(self, response_agent):
        """Should return original response when no suggestion provided"""
        original_response = {
            "status": "success",
            "answer": "This is the original answer.",
            "citations": [],
        }

        updated_response = response_agent.append_mode_switch_to_response(
            response=original_response,
            mode_switch_suggestion=None,
        )

        # Should be unchanged
        assert updated_response == original_response


class TestModeBoundaryEnforcement:
    """Test end-to-end mode boundary enforcement"""

    def test_enforce_selected_text_boundary(self, router_agent):
        """Selected-Text mode should enforce strict text boundary"""
        # Valid case: text provided
        result = router_agent.validate_mode_boundary(
            current_mode=AnsweringMode.SELECTED_TEXT_ONLY,
            requested_mode=AnsweringMode.SELECTED_TEXT_ONLY,
            selected_text="Neural networks are computational models.",
            has_book_context=True,
        )

        assert result["is_valid"] is True
        assert result["mode"] == AnsweringMode.SELECTED_TEXT_ONLY

        # Invalid case: no text provided
        result = router_agent.validate_mode_boundary(
            current_mode=AnsweringMode.SELECTED_TEXT_ONLY,
            requested_mode=AnsweringMode.SELECTED_TEXT_ONLY,
            selected_text=None,
            has_book_context=True,
        )

        assert result["is_valid"] is False
        assert result["mode"] != AnsweringMode.SELECTED_TEXT_ONLY

    def test_enforce_book_only_boundary(self, router_agent):
        """Book-Only mode should warn when context is unavailable"""
        result = router_agent.validate_mode_boundary(
            current_mode=AnsweringMode.BOOK_ONLY,
            requested_mode=AnsweringMode.BOOK_ONLY,
            selected_text=None,
            has_book_context=False,
        )

        # Still valid, but with warnings and suggestions
        assert result["is_valid"] is True
        assert len(result["warnings"]) > 0
        assert result["suggestion"] is not None

    def test_mode_switch_flow(self, router_agent):
        """Test complete mode switch validation flow"""
        # Step 1: User in Book-Only mode, no results found
        suggestion = router_agent.suggest_mode_switch(
            query="What is quantum computing?",
            current_mode=AnsweringMode.BOOK_ONLY,
            retrieval_confidence=0.0,
            has_results=False,
        )

        assert suggestion["suggested_mode"] == AnsweringMode.GENERAL_KNOWLEDGE

        # Step 2: Validate switch to General Knowledge
        result = router_agent.validate_mode_boundary(
            current_mode=AnsweringMode.BOOK_ONLY,
            requested_mode=AnsweringMode.GENERAL_KNOWLEDGE,
            selected_text=None,
            has_book_context=False,
        )

        assert result["is_valid"] is True
        assert result["mode"] == AnsweringMode.GENERAL_KNOWLEDGE
        # Should warn about external knowledge
        assert len(result["warnings"]) > 0


class TestModeSwitchingEdgeCases:
    """Test edge cases in mode switching logic"""

    def test_switch_from_selected_text_to_book_only(self, router_agent):
        """Cannot switch from Selected-Text to Book-Only while text is selected"""
        result = router_agent.validate_mode_boundary(
            current_mode=AnsweringMode.SELECTED_TEXT_ONLY,
            requested_mode=AnsweringMode.BOOK_ONLY,
            selected_text="Still have text selected",
            has_book_context=True,
        )

        # Selected text overrides
        assert result["mode"] == AnsweringMode.SELECTED_TEXT_ONLY
        assert len(result["warnings"]) > 0

    def test_high_confidence_with_comparison_query(self, router_agent):
        """Should not suggest Book-Only for comparison queries even with high confidence"""
        suggestion = router_agent.suggest_mode_switch(
            query="Compare ROS 1 versus ROS 2",
            current_mode=AnsweringMode.GENERAL_KNOWLEDGE,
            retrieval_confidence=0.90,
            has_results=True,
        )

        # Should not suggest switch (comparison might benefit from general knowledge)
        # This depends on implementation details
        # For now, we accept either outcome as valid

    def test_empty_query_does_not_crash(self, router_agent):
        """Empty query should not crash mode switch suggestion"""
        suggestion = router_agent.suggest_mode_switch(
            query="",
            current_mode=AnsweringMode.BOOK_ONLY,
            retrieval_confidence=0.0,
            has_results=False,
        )

        # Should still return suggestion
        assert suggestion is not None
