/**
 * Tests for useQuiz Hook
 * Testing quiz state management, scoring, and progression
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { useQuiz, QuizData } from './useQuiz';

global.fetch = jest.fn();

const mockQuizData: QuizData = {
  quizId: 'test-quiz-1',
  moduleId: 'module-01',
  title: 'Test Quiz',
  questions: [
    {
      id: 'q1',
      type: 'multiple-choice',
      text: 'What is 2 + 2?',
      options: ['3', '4', '5', '6'],
      correctAnswer: 1,
      explanation: 'The answer is 4',
      difficulty: 'easy',
    },
    {
      id: 'q2',
      type: 'true-false',
      text: 'The sky is blue?',
      options: ['True', 'False'],
      correctAnswer: 0,
      explanation: 'Yes, the sky is blue',
      difficulty: 'easy',
    },
    {
      id: 'q3',
      type: 'multiple-choice',
      text: 'What is the capital of France?',
      options: ['London', 'Berlin', 'Paris', 'Madrid'],
      correctAnswer: 2,
      explanation: 'Paris is the capital of France',
      difficulty: 'medium',
    },
  ],
};

describe('useQuiz', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockReset();
  });

  describe('Quiz Loading', () => {
    it('should load quiz data successfully', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockQuizData,
      });

      const { result } = renderHook(() => useQuiz('/quizzes/test-quiz.json'));

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.quizData).toEqual(mockQuizData);
      expect(result.current.error).toBeNull();
      expect(result.current.userAnswers).toHaveLength(3);
    });

    it('should handle fetch error gracefully', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        statusText: 'Not Found',
      });

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const { result } = renderHook(() => useQuiz('/quizzes/missing-quiz.json'));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.quizData).toBeNull();
      expect(result.current.error).toContain('Failed to load quiz');
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it('should handle JSON parse error', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error('Invalid JSON');
        },
      });

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const { result } = renderHook(() => useQuiz('/quizzes/invalid.json'));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe('Invalid JSON');
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe('Quiz State Management', () => {
    it('should initialize with intro state', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockQuizData,
      });

      const { result } = renderHook(() => useQuiz('/quizzes/test.json'));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.quizState).toBe('intro');
    });

    it('should transition to answering state when started', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockQuizData,
      });

      const { result } = renderHook(() => useQuiz('/quizzes/test.json'));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.startQuiz();
      });

      expect(result.current.quizState).toBe('answering');
      expect(result.current.currentQuestionIndex).toBe(0);
    });

    it('should transition to results state when submitted', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockQuizData,
      });

      const { result } = renderHook(() => useQuiz('/quizzes/test.json'));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.startQuiz();
      });

      act(() => {
        result.current.submitQuiz();
      });

      expect(result.current.quizState).toBe('results');
      expect(result.current.score).not.toBeNull();
      expect(result.current.passed).not.toBeNull();
    });
  });

  describe('Answer Selection', () => {
    it('should record selected answers', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockQuizData,
      });

      const { result } = renderHook(() => useQuiz('/quizzes/test.json'));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.startQuiz();
      });

      act(() => {
        result.current.selectAnswer('q1', 1);
      });

      const answer = result.current.userAnswers.find((a) => a.questionId === 'q1');
      expect(answer?.selectedAnswer).toBe(1);
    });

    it('should update existing answer when changed', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockQuizData,
      });

      const { result } = renderHook(() => useQuiz('/quizzes/test.json'));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.startQuiz();
      });

      act(() => {
        result.current.selectAnswer('q1', 1);
      });

      act(() => {
        result.current.selectAnswer('q1', 2);
      });

      const answer = result.current.userAnswers.find((a) => a.questionId === 'q1');
      expect(answer?.selectedAnswer).toBe(2);
    });
  });

  describe('Question Navigation', () => {
    it('should navigate to next question', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockQuizData,
      });

      const { result } = renderHook(() => useQuiz('/quizzes/test.json'));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.startQuiz();
      });

      expect(result.current.currentQuestionIndex).toBe(0);

      act(() => {
        result.current.nextQuestion();
      });

      expect(result.current.currentQuestionIndex).toBe(1);
      expect(result.current.currentQuestion?.id).toBe('q2');
    });

    it('should not go beyond last question', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockQuizData,
      });

      const { result } = renderHook(() => useQuiz('/quizzes/test.json'));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.startQuiz();
      });

      // Go to last question
      act(() => {
        result.current.nextQuestion();
        result.current.nextQuestion();
      });

      expect(result.current.currentQuestionIndex).toBe(2);

      // Try to go further
      act(() => {
        result.current.nextQuestion();
      });

      expect(result.current.currentQuestionIndex).toBe(2);
    });

    it('should navigate to previous question', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockQuizData,
      });

      const { result } = renderHook(() => useQuiz('/quizzes/test.json'));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.startQuiz();
      });

      act(() => {
        result.current.nextQuestion();
      });

      expect(result.current.currentQuestionIndex).toBe(1);

      act(() => {
        result.current.previousQuestion();
      });

      expect(result.current.currentQuestionIndex).toBe(0);
    });

    it('should not go before first question', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockQuizData,
      });

      const { result } = renderHook(() => useQuiz('/quizzes/test.json'));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.startQuiz();
      });

      expect(result.current.currentQuestionIndex).toBe(0);

      act(() => {
        result.current.previousQuestion();
      });

      expect(result.current.currentQuestionIndex).toBe(0);
    });
  });

  describe('Quiz Submission and Scoring', () => {
    it('should calculate score after submission', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockQuizData,
      });

      const { result } = renderHook(() => useQuiz('/quizzes/test.json'));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.startQuiz();
      });

      // Answer all questions correctly
      act(() => {
        result.current.selectAnswer('q1', 1);
        result.current.selectAnswer('q2', 0);
        result.current.selectAnswer('q3', 2);
      });

      act(() => {
        result.current.submitQuiz();
      });

      expect(result.current.score).not.toBeNull();
      expect(result.current.passed).not.toBeNull();
      expect(result.current.resultBreakdown).not.toBeNull();
    });

    it('should save quiz results to localStorage', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockQuizData,
      });

      const { result } = renderHook(() => useQuiz('/quizzes/test.json'));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.startQuiz();
      });

      act(() => {
        result.current.selectAnswer('q1', 1);
      });

      act(() => {
        result.current.submitQuiz();
      });

      const stored = localStorage.getItem('quizResults');
      expect(stored).not.toBeNull();

      const results = JSON.parse(stored!);
      expect(results['test-quiz-1']).toBeDefined();
      expect(results['test-quiz-1'].quizId).toBe('test-quiz-1');
    });
  });

  describe('Quiz Reset', () => {
    it('should reset quiz state', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockQuizData,
      });

      const { result } = renderHook(() => useQuiz('/quizzes/test.json'));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.startQuiz();
      });

      act(() => {
        result.current.selectAnswer('q1', 1);
        result.current.selectAnswer('q2', 0);
      });

      act(() => {
        result.current.submitQuiz();
      });

      act(() => {
        result.current.resetQuiz();
      });

      expect(result.current.quizState).toBe('answering');
      expect(result.current.currentQuestionIndex).toBe(0);
      expect(result.current.score).toBeNull();
      expect(result.current.passed).toBeNull();
      expect(result.current.userAnswers.every((a) => a.selectedAnswer === null)).toBe(true);
    });
  });

  describe('Progress Tracking', () => {
    it('should calculate progress correctly', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockQuizData,
      });

      const { result } = renderHook(() => useQuiz('/quizzes/test.json'));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.startQuiz();
      });

      expect(result.current.getProgress()).toBe(0);

      act(() => {
        result.current.selectAnswer('q1', 1);
      });

      expect(result.current.getProgress()).toBe(33);

      act(() => {
        result.current.selectAnswer('q2', 0);
      });

      expect(result.current.getProgress()).toBe(67);

      act(() => {
        result.current.selectAnswer('q3', 2);
      });

      expect(result.current.getProgress()).toBe(100);
    });
  });

  describe('Error Handling', () => {
    it('should handle localStorage save errors gracefully', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockQuizData,
      });

      const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
      setItemSpy.mockImplementation(() => {
        throw new Error('localStorage error');
      });

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const { result } = renderHook(() => useQuiz('/quizzes/test.json'));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.startQuiz();
      });

      act(() => {
        result.current.submitQuiz();
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to save quiz results:',
        expect.any(Error)
      );

      setItemSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });
  });
});
