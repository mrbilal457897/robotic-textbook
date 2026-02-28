/**
 * useQuiz Hook
 * Manages quiz state, scoring, and progression
 */

import { useEffect, useState } from 'react';
import { calculateScore, getResultBreakdown, isPassed } from '@utils/quizScoring';

export interface Question {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  // Internal fields added during loading
  id?: string;
}

export interface QuizData {
  questions: Question[];
  // Derived from path
  quizId?: string;
  moduleId?: string;
}

export interface UserAnswer {
  questionId: string;
  selectedAnswer: number | null;
}

export type QuizState = 'intro' | 'answering' | 'results';

interface UseQuizReturn {
  quizData: QuizData | null;
  isLoading: boolean;
  error: string | null;
  currentQuestionIndex: number;
  currentQuestion: Question | null;
  userAnswers: UserAnswer[];
  quizState: QuizState;
  score: number | null;
  passed: boolean | null;
  resultBreakdown: ReturnType<typeof getResultBreakdown> | null;
  startQuiz: () => void;
  selectAnswer: (questionId: string, answerIndex: number) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  submitQuiz: () => void;
  resetQuiz: () => void;
  getProgress: () => number;
}

/**
 * Hook for managing quiz state and logic
 * @param quizPath - Path to quiz JSON file
 * @returns Quiz state and control functions
 */
export function useQuiz(quizPath: string): UseQuizReturn {
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [quizState, setQuizState] = useState<QuizState>('intro');
  const [score, setScore] = useState<number | null>(null);
  const [passed, setPassed] = useState<boolean | null>(null);
  const [resultBreakdown, setResultBreakdown] = useState<ReturnType<
    typeof getResultBreakdown
  > | null>(null);

  // Load quiz data
  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const response = await fetch(quizPath);
        if (!response.ok) {
          throw new Error(`Failed to load quiz: ${response.statusText}`);
        }
        const rawData = await response.json();

        // Handle new format: just an array of questions
        let questions: Question[];
        if (Array.isArray(rawData)) {
          questions = rawData;
        } else if (rawData.questions) {
          // Backward compatibility with old format
          questions = rawData.questions;
        } else {
          throw new Error('Invalid quiz format');
        }

        // Add IDs to questions if missing
        questions = questions.map((q, index) => ({
          ...q,
          id: q.id || `q${index + 1}`,
        }));

        // Extract quiz metadata from path
        const pathParts = quizPath.split('/');
        const fileName = pathParts[pathParts.length - 1];
        const quizId = fileName.replace('.json', '');
        const moduleId = fileName.includes('module-')
          ? fileName.match(/module-\d+/)?.[0] || quizId
          : quizId;

        const quizData: QuizData = {
          questions,
          quizId,
          moduleId,
        };

        setQuizData(quizData);

        // Initialize user answers
        const initialAnswers: UserAnswer[] = questions.map(q => ({
          questionId: q.id!,
          selectedAnswer: null,
        }));
        setUserAnswers(initialAnswers);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('Failed to load quiz:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadQuiz();
  }, [quizPath]);

  const currentQuestion = quizData?.questions[currentQuestionIndex] || null;

  const startQuiz = () => {
    setQuizState('answering');
    setCurrentQuestionIndex(0);
    setScore(null);
    setPassed(null);
    setResultBreakdown(null);
  };

  const selectAnswer = (questionId: string, answerIndex: number) => {
    setUserAnswers(prev =>
      prev.map(answer =>
        answer.questionId === questionId ? { ...answer, selectedAnswer: answerIndex } : answer
      )
    );
  };

  const nextQuestion = () => {
    if (quizData && currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const submitQuiz = () => {
    if (!quizData) return;

    const calculatedScore = calculateScore(userAnswers, quizData.questions as any);
    const hasPassed = isPassed(calculatedScore);
    const breakdown = getResultBreakdown(userAnswers, quizData.questions as any);

    setScore(calculatedScore);
    setPassed(hasPassed);
    setResultBreakdown(breakdown);
    setQuizState('results');

    // Auto-save to localStorage for authenticated users
    const quizResult = {
      quizId: quizData.quizId,
      moduleId: quizData.moduleId,
      score: calculatedScore,
      passed: hasPassed,
      timestamp: new Date().toISOString(),
      answers: userAnswers,
    };

    try {
      const existingResults = JSON.parse(localStorage.getItem('quizResults') || '{}');
      existingResults[quizData.quizId] = quizResult;
      localStorage.setItem('quizResults', JSON.stringify(existingResults));
    } catch (err) {
      console.error('Failed to save quiz results:', err);
    }
  };

  const resetQuiz = () => {
    if (!quizData) return;

    setCurrentQuestionIndex(0);
    setQuizState('answering');
    setScore(null);
    setPassed(null);
    setResultBreakdown(null);

    // Reset answers
    const resetAnswers: UserAnswer[] = quizData.questions.map(q => ({
      questionId: q.id!,
      selectedAnswer: null,
    }));
    setUserAnswers(resetAnswers);
  };

  const getProgress = (): number => {
    if (!quizData) return 0;
    const answeredCount = userAnswers.filter(a => a.selectedAnswer !== null).length;
    return Math.round((answeredCount / quizData.questions.length) * 100);
  };

  return {
    quizData,
    isLoading,
    error,
    currentQuestionIndex,
    currentQuestion,
    userAnswers,
    quizState,
    score,
    passed,
    resultBreakdown,
    startQuiz,
    selectAnswer,
    nextQuestion,
    previousQuestion,
    submitQuiz,
    resetQuiz,
    getProgress,
  };
}
