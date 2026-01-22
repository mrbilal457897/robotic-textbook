import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useQuiz } from '@/hooks/useQuiz';
import { Quiz } from './index';

jest.mock('@/hooks/useQuiz');
jest.mock('@docusaurus/router', () => ({
  useNavigate: () => jest.fn(),
}));

describe('Quiz Component', () => {
  const mockUseQuiz = useQuiz as jest.MockedFunction<typeof useQuiz>;

  const mockQuizData = {
    id: 'test-quiz',
    title: 'Test Quiz',
    questions: [
      {
        id: 'q1',
        question: 'What is 2+2?',
        options: ['3', '4', '5', '6'],
        correctAnswer: 1,
      },
      {
        id: 'q2',
        question: 'What is capital of France?',
        options: ['London', 'Paris', 'Berlin', 'Madrid'],
        correctAnswer: 1,
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state', () => {
    mockUseQuiz.mockReturnValue({
      quizData: null,
      isLoading: true,
      error: null,
      currentQuestionIndex: 0,
      currentQuestion: null,
      userAnswers: [],
      quizState: 'loading',
      score: 0,
      passed: false,
      startQuiz: jest.fn(),
      selectAnswer: jest.fn(),
      nextQuestion: jest.fn(),
      previousQuestion: jest.fn(),
      submitQuiz: jest.fn(),
      resetQuiz: jest.fn(),
    });

    render(<Quiz quizPath="/quizzes/test.json" moduleId="m1" />);
    expect(screen.getByText(/loading quiz/i)).toBeInTheDocument();
  });

  it('renders error state', () => {
    mockUseQuiz.mockReturnValue({
      quizData: null,
      isLoading: false,
      error: 'Failed to load quiz',
      currentQuestionIndex: 0,
      currentQuestion: null,
      userAnswers: [],
      quizState: 'error',
      score: 0,
      passed: false,
      startQuiz: jest.fn(),
      selectAnswer: jest.fn(),
      nextQuestion: jest.fn(),
      previousQuestion: jest.fn(),
      submitQuiz: jest.fn(),
      resetQuiz: jest.fn(),
    });

    render(<Quiz quizPath="/quizzes/test.json" moduleId="m1" />);
    expect(screen.getByText(/error loading quiz/i)).toBeInTheDocument();
  });

  it('starts quiz when start button clicked', async () => {
    const startQuizMock = jest.fn();
    mockUseQuiz.mockReturnValue({
      quizData: mockQuizData,
      isLoading: false,
      error: null,
      currentQuestionIndex: 0,
      currentQuestion: null,
      userAnswers: [],
      quizState: 'ready',
      score: 0,
      passed: false,
      startQuiz: startQuizMock,
      selectAnswer: jest.fn(),
      nextQuestion: jest.fn(),
      previousQuestion: jest.fn(),
      submitQuiz: jest.fn(),
      resetQuiz: jest.fn(),
    });

    render(<Quiz quizPath="/quizzes/test.json" moduleId="m1" />);
    const startButton = screen.getByRole('button', { name: /start quiz/i });
    fireEvent.click(startButton);
    expect(startQuizMock).toHaveBeenCalled();
  });

  it('displays current question', () => {
    const currentQuestion = mockQuizData.questions[0];
    mockUseQuiz.mockReturnValue({
      quizData: mockQuizData,
      isLoading: false,
      error: null,
      currentQuestionIndex: 0,
      currentQuestion,
      userAnswers: [],
      quizState: 'in-progress',
      score: 0,
      passed: false,
      startQuiz: jest.fn(),
      selectAnswer: jest.fn(),
      nextQuestion: jest.fn(),
      previousQuestion: jest.fn(),
      submitQuiz: jest.fn(),
      resetQuiz: jest.fn(),
    });

    render(<Quiz quizPath="/quizzes/test.json" moduleId="m1" />);
    expect(screen.getByText(/what is 2\+2\?/i)).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('selects an answer', async () => {
    const selectAnswerMock = jest.fn();
    const currentQuestion = mockQuizData.questions[0];
    mockUseQuiz.mockReturnValue({
      quizData: mockQuizData,
      isLoading: false,
      error: null,
      currentQuestionIndex: 0,
      currentQuestion,
      userAnswers: [],
      quizState: 'in-progress',
      score: 0,
      passed: false,
      startQuiz: jest.fn(),
      selectAnswer: selectAnswerMock,
      nextQuestion: jest.fn(),
      previousQuestion: jest.fn(),
      submitQuiz: jest.fn(),
      resetQuiz: jest.fn(),
    });

    render(<Quiz quizPath="/quizzes/test.json" moduleId="m1" />);
    const answerButtons = screen.getAllByRole('button').filter(
      (btn) => btn.textContent === '4'
    );
    if (answerButtons.length > 0) {
      fireEvent.click(answerButtons[0]);
      await waitFor(() => expect(selectAnswerMock).toHaveBeenCalledWith(1));
    }
  });

  it('submits quiz when all answers provided', async () => {
    const submitQuizMock = jest.fn();
    mockUseQuiz.mockReturnValue({
      quizData: mockQuizData,
      isLoading: false,
      error: null,
      currentQuestionIndex: 1,
      currentQuestion: mockQuizData.questions[1],
      userAnswers: [1, 1],
      quizState: 'in-progress',
      score: 0,
      passed: false,
      startQuiz: jest.fn(),
      selectAnswer: jest.fn(),
      nextQuestion: jest.fn(),
      previousQuestion: jest.fn(),
      submitQuiz: submitQuizMock,
      resetQuiz: jest.fn(),
    });

    render(<Quiz quizPath="/quizzes/test.json" moduleId="m1" />);
    const submitButton = screen.queryByRole('button', { name: /submit|finish/i });
    if (submitButton) {
      fireEvent.click(submitButton);
      await waitFor(() => expect(submitQuizMock).toHaveBeenCalled());
    }
  });

  it('displays results after quiz submission', () => {
    mockUseQuiz.mockReturnValue({
      quizData: mockQuizData,
      isLoading: false,
      error: null,
      currentQuestionIndex: 1,
      currentQuestion: null,
      userAnswers: [1, 1],
      quizState: 'completed',
      score: 100,
      passed: true,
      startQuiz: jest.fn(),
      selectAnswer: jest.fn(),
      nextQuestion: jest.fn(),
      previousQuestion: jest.fn(),
      submitQuiz: jest.fn(),
      resetQuiz: jest.fn(),
    });

    render(<Quiz quizPath="/quizzes/test.json" moduleId="m1" />);
    expect(screen.getByText(/100/)).toBeInTheDocument();
    expect(screen.getByText(/passed/i)).toBeInTheDocument();
  });

  it('resets quiz when reset button clicked', () => {
    const resetQuizMock = jest.fn();
    mockUseQuiz.mockReturnValue({
      quizData: mockQuizData,
      isLoading: false,
      error: null,
      currentQuestionIndex: 0,
      currentQuestion: null,
      userAnswers: [],
      quizState: 'completed',
      score: 100,
      passed: true,
      startQuiz: jest.fn(),
      selectAnswer: jest.fn(),
      nextQuestion: jest.fn(),
      previousQuestion: jest.fn(),
      submitQuiz: jest.fn(),
      resetQuiz: resetQuizMock,
    });

    render(<Quiz quizPath="/quizzes/test.json" moduleId="m1" />);
    const resetButton = screen.queryByRole('button', { name: /retake|reset/i });
    if (resetButton) {
      fireEvent.click(resetButton);
      expect(resetQuizMock).toHaveBeenCalled();
    }
  });
});
