/**
 * Quiz Scoring Utilities
 * Provides functions for calculating quiz scores and determining pass/fail status
 */

export interface QuizAnswer {
  questionId: string;
  selectedAnswer: number | null;
}

export interface Question {
  id: string;
  correctAnswer: number;
}

export interface ResultBreakdown {
  correct: number;
  incorrect: number;
  skipped: number;
  total: number;
}

/**
 * Calculate quiz score as a percentage
 * @param answers - User's answers to quiz questions
 * @param questions - Quiz questions with correct answers
 * @returns Score as percentage (0-100)
 */
export function calculateScore(
  answers: QuizAnswer[],
  questions: Question[]
): number {
  if (questions.length === 0) return 0;

  let correct = 0;

  answers.forEach((answer) => {
    const question = questions.find((q) => q.id === answer.questionId);
    if (question && answer.selectedAnswer === question.correctAnswer) {
      correct++;
    }
  });

  return Math.round((correct / questions.length) * 100);
}

/**
 * Determine if a score passes the quiz
 * Passing threshold: 70%
 * @param score - Quiz score percentage
 * @returns True if score >= 70, false otherwise
 */
export function isPassed(score: number): boolean {
  return score >= 70;
}

/**
 * Get detailed breakdown of quiz results
 * @param answers - User's answers to quiz questions
 * @param questions - Quiz questions with correct answers
 * @returns Breakdown of correct, incorrect, and skipped answers
 */
export function getResultBreakdown(
  answers: QuizAnswer[],
  questions: Question[]
): ResultBreakdown {
  let correct = 0;
  let incorrect = 0;
  let skipped = 0;

  answers.forEach((answer) => {
    if (answer.selectedAnswer === null) {
      skipped++;
    } else {
      const question = questions.find((q) => q.id === answer.questionId);
      if (question && answer.selectedAnswer === question.correctAnswer) {
        correct++;
      } else {
        incorrect++;
      }
    }
  });

  return {
    correct,
    incorrect,
    skipped,
    total: questions.length,
  };
}

/**
 * Format score as a display string
 * @param score - Quiz score percentage
 * @returns Formatted score string (e.g., "85%")
 */
export function formatScore(score: number): string {
  return `${Math.round(score)}%`;
}

/**
 * Get result message based on score
 * @param score - Quiz score percentage
 * @returns User-friendly result message
 */
export function getResultMessage(score: number): string {
  if (score === 100) return "Perfect score! You've mastered this module.";
  if (score >= 90)
    return "Excellent! You have a strong understanding of this material.";
  if (score >= 80)
    return "Great job! You understand most of the key concepts.";
  if (score >= 70)
    return "Good effort! You've passed the quiz with passing marks.";
  if (score >= 50)
    return "You're on the right track. Review the material and try again.";
  return "Keep studying! There's room for improvement. Review the material carefully.";
}

/**
 * Get CSS class for result indicator based on score
 * @param score - Quiz score percentage
 * @returns CSS class name
 */
export function getScoreClass(score: number): string {
  if (score >= 80) return "score-excellent";
  if (score >= 70) return "score-passed";
  return "score-failed";
}
