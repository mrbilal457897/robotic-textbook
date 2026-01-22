import { calculateScore, isPassed, getResultBreakdown } from './quizScoring';
import { QuizAnswer, Question } from '../types';

describe('quizScoring', () => {
  const mockQuestions: Question[] = [
    {
      id: 'q1',
      type: 'multiple-choice',
      text: 'What is ROS?',
      options: ['Robot OS', 'Robotic Operating System', 'Remote OS', 'Real-time OS'],
      correctAnswer: 1,
      explanation: 'ROS stands for Robot Operating System',
      difficulty: 'easy',
    },
    {
      id: 'q2',
      type: 'true-false',
      text: 'ROS 2 is better than ROS 1',
      options: ['True', 'False'],
      correctAnswer: 0,
      explanation: 'ROS 2 has many improvements over ROS 1',
      difficulty: 'medium',
    },
    {
      id: 'q3',
      type: 'multiple-choice',
      text: 'What is a node in ROS?',
      options: ['A process', 'A file', 'A library', 'A message'],
      correctAnswer: 0,
      explanation: 'A node is a lightweight process in ROS',
      difficulty: 'medium',
    },
  ];

  describe('calculateScore', () => {
    it('should calculate 0% for all wrong answers', () => {
      const answers: QuizAnswer[] = [
        { questionId: 'q1', selectedAnswer: 0 },
        { questionId: 'q2', selectedAnswer: 1 },
        { questionId: 'q3', selectedAnswer: 1 },
      ];
      expect(calculateScore(answers, mockQuestions)).toBe(0);
    });

    it('should calculate 100% for all correct answers', () => {
      const answers: QuizAnswer[] = [
        { questionId: 'q1', selectedAnswer: 1 },
        { questionId: 'q2', selectedAnswer: 0 },
        { questionId: 'q3', selectedAnswer: 0 },
      ];
      expect(calculateScore(answers, mockQuestions)).toBe(100);
    });

    it('should calculate 66% for 2 out of 3 correct', () => {
      const answers: QuizAnswer[] = [
        { questionId: 'q1', selectedAnswer: 1 },
        { questionId: 'q2', selectedAnswer: 0 },
        { questionId: 'q3', selectedAnswer: 1 },
      ];
      expect(calculateScore(answers, mockQuestions)).toBe(67);
    });

    it('should return 0 for empty questions array', () => {
      const answers: QuizAnswer[] = [];
      expect(calculateScore(answers, [])).toBe(0);
    });
  });

  describe('isPassed', () => {
    it('should return true for score >= 70', () => {
      expect(isPassed(70)).toBe(true);
      expect(isPassed(100)).toBe(true);
      expect(isPassed(85)).toBe(true);
    });

    it('should return false for score < 70', () => {
      expect(isPassed(69)).toBe(false);
      expect(isPassed(0)).toBe(false);
      expect(isPassed(50)).toBe(false);
    });
  });

  describe('getResultBreakdown', () => {
    it('should return correct breakdown', () => {
      const answers: QuizAnswer[] = [
        { questionId: 'q1', selectedAnswer: 1 },
        { questionId: 'q2', selectedAnswer: 0 },
        { questionId: 'q3', selectedAnswer: 1 },
      ];
      const breakdown = getResultBreakdown(answers, mockQuestions);
      expect(breakdown.correct).toBe(2);
      expect(breakdown.incorrect).toBe(1);
      expect(breakdown.skipped).toBe(0);
    });

    it('should count skipped questions', () => {
      const answers: QuizAnswer[] = [
        { questionId: 'q1', selectedAnswer: -1 },
        { questionId: 'q2', selectedAnswer: 0 },
      ];
      const breakdown = getResultBreakdown(answers, mockQuestions);
      expect(breakdown.skipped).toBe(1);
    });
  });
});
