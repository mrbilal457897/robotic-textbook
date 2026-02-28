import React from 'react';
import { Question, UserAnswer } from '@/hooks/useQuiz';
import {
  getResultMessage,
  getScoreClass,
  getResultBreakdown,
  getMotivationalComment,
  formatScoreFraction,
} from '@/utils/quizScoring';
import styles from './styles.module.css';

interface QuizResultsProps {
  score: number;
  passed: boolean;
  questions: Question[];
  userAnswers: UserAnswer[];
  onRetake: () => void;
  onBackToModule: () => void;
}

export function QuizResults({
  score,
  passed,
  questions,
  userAnswers,
  onRetake,
  onBackToModule,
}: QuizResultsProps) {
  const breakdown = getResultBreakdown(userAnswers, questions as any);
  const resultMessage = getResultMessage(score);
  const scoreClass = getScoreClass(score);
  const motivationalComment = getMotivationalComment(score);
  const scoreFraction = formatScoreFraction(breakdown.correct, breakdown.total);

  return (
    <div className={styles.resultsContainer}>
      <div className={styles.scoreDisplay}>
        <h2>Quiz Complete!</h2>

        {/* Score in fraction format */}
        <div className={styles.scoreHeader}>
          <div className={styles.scoreFraction}>
            <span className={styles.scoreNumerator}>{breakdown.correct}</span>
            <span className={styles.scoreDivider}>/</span>
            <span className={styles.scoreDenominator}>{breakdown.total}</span>
          </div>
          <div className={styles.scoreSubtext}>Questions Correct</div>
        </div>

        {/* Percentage score */}
        <div className={`${styles.scoreBig} ${styles[scoreClass]}`}>{Math.round(score)}%</div>

        <div className={`${styles.passFailIndicator} ${passed ? styles.passed : styles.failed}`}>
          {passed ? '✓ PASSED' : '✗ NEEDS IMPROVEMENT'}
        </div>

        <p className={styles.resultMessage}>{resultMessage}</p>

        {/* Motivational comment */}
        <div className={styles.motivationalComment}>{motivationalComment}</div>
      </div>

      <div className={styles.resultBreakdown}>
        <div className={styles.breakdownItem}>
          <strong className={styles.correct}>{breakdown.correct}</strong>
          <span>Correct</span>
        </div>
        <div className={styles.breakdownItem}>
          <strong className={styles.incorrect}>{breakdown.incorrect}</strong>
          <span>Incorrect</span>
        </div>
        <div className={styles.breakdownItem}>
          <strong className={styles.skipped}>{breakdown.skipped}</strong>
          <span>Skipped</span>
        </div>
      </div>

      <div className={styles.questionReview}>
        <h3 className={styles.reviewHeading}>Question Review</h3>

        {questions.map((question, index) => {
          const userAnswer = userAnswers.find(a => a.questionId === question.id);
          const isCorrect = userAnswer?.selectedAnswer === question.correctIndex;
          const isSkipped = userAnswer?.selectedAnswer === null;

          return (
            <div
              key={question.id || index}
              className={`${styles.reviewItem} ${
                isSkipped ? styles.skipped : isCorrect ? styles.correct : styles.incorrect
              }`}
            >
              <div className={styles.reviewQuestion}>
                {index + 1}. {question.question}
              </div>

              {isSkipped ? (
                <div className={styles.reviewAnswer}>
                  <span>Skipped</span>
                </div>
              ) : (
                <>
                  <div className={styles.reviewAnswer}>
                    Your answer:{' '}
                    <span className={styles.userAnswer}>
                      {userAnswer?.selectedAnswer !== undefined &&
                        question.options[userAnswer.selectedAnswer]}
                    </span>
                  </div>

                  {!isCorrect && (
                    <div className={styles.reviewAnswer}>
                      Correct answer:{' '}
                      <span className={styles.correctAnswer}>
                        {question.options[question.correctIndex]}
                      </span>
                    </div>
                  )}
                </>
              )}

              <div className={styles.explanation}>{question.explanation}</div>
            </div>
          );
        })}
      </div>

      <div className={styles.actionButtons}>
        <button className={styles.retakeButton} onClick={onRetake} aria-label="Retake quiz">
          Retake Quiz
        </button>
        <button className={styles.backButton} onClick={onBackToModule} aria-label="Back to module">
          Back to Module
        </button>
      </div>
    </div>
  );
}
