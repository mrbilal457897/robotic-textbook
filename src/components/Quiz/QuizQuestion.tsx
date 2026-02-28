import React, { useState } from 'react';
import { Question } from '@/hooks/useQuiz';
import styles from './styles.module.css';

interface QuizQuestionProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  userAnswer: number | null;
  onSelectAnswer: (answerIndex: number) => void;
  onNext: () => void;
  onPrevious: () => void;
  onSubmit: () => void;
  canGoBack: boolean;
  canGoNext: boolean;
  isLastQuestion: boolean;
}

export function QuizQuestion({
  question,
  questionNumber,
  totalQuestions,
  userAnswer,
  onSelectAnswer,
  onNext,
  onPrevious,
  onSubmit,
  canGoBack,
  canGoNext,
  isLastQuestion,
}: QuizQuestionProps) {
  const progress = (questionNumber / totalQuestions) * 100;

  return (
    <div className={styles.questionContainer}>
      <div className={styles.questionHeader}>
        <div className={styles.questionCounter}>
          Question {questionNumber} of {totalQuestions}
        </div>
        <div className={styles.progressBarContainer}>
          <div className={styles.progressBar} style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <div className={styles.questionText}>{question.question}</div>

      <div className={styles.optionsContainer}>
        {question.options.map((option, index) => (
          <label key={index} className={styles.option}>
            <input
              type="radio"
              name={`question-${question.id || questionNumber}`}
              checked={userAnswer === index}
              onChange={() => onSelectAnswer(index)}
              aria-label={option}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>

      <div className={styles.navigationButtons}>
        <button
          className={styles.previousButton}
          onClick={onPrevious}
          disabled={!canGoBack}
          aria-label="Go to previous question"
        >
          Previous
        </button>

        {isLastQuestion ? (
          <button className={styles.submitButton} onClick={onSubmit} aria-label="Submit quiz">
            Submit Quiz
          </button>
        ) : (
          <button
            className={styles.nextButton}
            onClick={onNext}
            disabled={!canGoNext}
            aria-label="Go to next question"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}
