/**
 * Quiz Scoring Utilities
 * Provides functions for calculating quiz scores and determining pass/fail status
 */

export interface QuizAnswer {
  questionId: string;
  selectedAnswer: number | null;
}

export interface Question {
  id?: string;
  correctIndex: number;
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
export function calculateScore(answers: QuizAnswer[], questions: Question[]): number {
  if (questions.length === 0) return 0;

  let correct = 0;

  answers.forEach(answer => {
    const question = questions.find(q => q.id === answer.questionId);
    if (question && answer.selectedAnswer === question.correctIndex) {
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
export function getResultBreakdown(answers: QuizAnswer[], questions: Question[]): ResultBreakdown {
  let correct = 0;
  let incorrect = 0;
  let skipped = 0;

  answers.forEach(answer => {
    if (answer.selectedAnswer === null) {
      skipped++;
    } else {
      const question = questions.find(q => q.id === answer.questionId);
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
  if (score >= 90) return 'Excellent! You have a strong understanding of this material.';
  if (score >= 80) return 'Great job! You understand most of the key concepts.';
  if (score >= 70) return "Good effort! You've passed the quiz with passing marks.";
  if (score >= 50) return "You're on the right track. Review the material and try again.";
  return "Keep studying! There's room for improvement. Review the material carefully.";
}

/**
 * Get CSS class for result indicator based on score
 * @param score - Quiz score percentage
 * @returns CSS class name
 */
export function getScoreClass(score: number): string {
  if (score >= 80) return 'score-excellent';
  if (score >= 70) return 'score-passed';
  return 'score-failed';
}

/**
 * Motivational tips and comments for different performance levels
 */
const motivationalComments = {
  perfect: [
    "🌟 Outstanding! You've achieved perfection. Your dedication truly shows!",
    "🎯 Perfect score! You're ready to teach this material yourself!",
    '⭐ Flawless performance! Keep up this amazing work!',
    '🏆 Perfection achieved! Your hard work has paid off brilliantly!',
    "💎 Absolutely perfect! You've mastered every concept!",
  ],
  excellent: [
    "🚀 Excellent work! You're well on your way to mastery!",
    '✨ Impressive! Your understanding of the material is strong!',
    "💪 Great job! You've demonstrated excellent comprehension!",
    "🎓 Superb performance! You've got a solid grasp of the concepts!",
    '🌈 Wonderful! Your dedication to learning shows clearly!',
  ],
  good: [
    '👍 Good job! You understand the core concepts well!',
    "📚 Nice work! A few more reviews and you'll be at the top!",
    "🔥 Well done! You've passed with a solid understanding!",
    "✅ Great effort! You're on the right track to mastery!",
    '💡 Good going! Keep building on this strong foundation!',
  ],
  passed: [
    "✔️ You've passed! Review the material to strengthen your understanding!",
    '📖 Passed! Take time to revisit the concepts you found challenging!',
    '🎯 Success! A little more practice will boost your confidence!',
    '👏 You made it! Consider reviewing the explanations for deeper insight!',
    '🌱 Well done on passing! Growth comes from continuous learning!',
  ],
  needsWork: [
    "💪 Keep going! Review the material and try again - you're building skills!",
    "📚 Don't give up! Every attempt helps you learn. Review and retry!",
    '🔄 Learning is a journey! Go through the material again and improve!',
    '🎯 Stay motivated! Focus on understanding the concepts, not just passing!',
    '🌟 You can do it! Break down the material into smaller sections!',
  ],
  failed: [
    '📖 Take your time to review the material thoroughly before retrying!',
    "💡 Don't be discouraged! Focus on understanding, not memorizing!",
    '🔍 Identify the topics you struggled with and study them more deeply!',
    '🎓 Learning takes time! Review each concept carefully and try again!',
    '🌱 Every expert was once a beginner. Keep practicing and improving!',
  ],
};

/**
 * Get a random motivational comment based on score
 * @param score - Quiz score percentage
 * @returns Random motivational comment appropriate for the score
 */
export function getMotivationalComment(score: number): string {
  let commentsArray: string[];

  if (score === 100) {
    commentsArray = motivationalComments.perfect;
  } else if (score >= 90) {
    commentsArray = motivationalComments.excellent;
  } else if (score >= 80) {
    commentsArray = motivationalComments.good;
  } else if (score >= 70) {
    commentsArray = motivationalComments.passed;
  } else if (score >= 50) {
    commentsArray = motivationalComments.needsWork;
  } else {
    commentsArray = motivationalComments.failed;
  }

  // Get random comment from the appropriate array
  const randomIndex = Math.floor(Math.random() * commentsArray.length);
  return commentsArray[randomIndex];
}

/**
 * Format score as "correct/total" format
 * @param correct - Number of correct answers
 * @param total - Total number of questions
 * @returns Formatted string (e.g., "7/10")
 */
export function formatScoreFraction(correct: number, total: number): string {
  return `${correct}/${total}`;
}
