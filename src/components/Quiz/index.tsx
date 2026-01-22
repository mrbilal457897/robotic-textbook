import React, { useEffect } from "react";
import { useNavigate } from "@docusaurus/router";
import { useQuiz } from "@/hooks/useQuiz";
import { QuizQuestion } from "./QuizQuestion";
import { QuizResults } from "./QuizResults";
import styles from "./styles.module.css";

interface QuizProps {
  quizPath: string;
  moduleId: string;
  moduleName?: string;
}

export function Quiz({ quizPath, moduleId, moduleName }: QuizProps) {
  const navigate = useNavigate();
  const {
    quizData,
    isLoading,
    error,
    currentQuestionIndex,
    currentQuestion,
    userAnswers,
    quizState,
    score,
    passed,
    startQuiz,
    selectAnswer,
    nextQuestion,
    previousQuestion,
    submitQuiz,
    resetQuiz,
  } = useQuiz(quizPath);

  if (isLoading) {
    return (
      <div className={styles.quizContainer}>
        <div style={{ textAlign: "center", color: "#b8c4ce" }}>
          Loading quiz...
        </div>
      </div>
    );
  }

  if (error || !quizData) {
    return (
      <div className={styles.quizContainer}>
        <div style={{ textAlign: "center", color: "#ff6b35" }}>
          Error loading quiz: {error || "Unknown error"}
        </div>
      </div>
    );
  }

  const currentUserAnswer =
    userAnswers.find((a) => a.questionId === currentQuestion?.id)
      ?.selectedAnswer ?? null;

  const canGoNext = currentUserAnswer !== null;
  const isLastQuestion =
    currentQuestionIndex === quizData.questions.length - 1;

  if (quizState === "intro") {
    return (
      <div className={styles.quizContainer}>
        <div className={styles.quizIntro}>
          <h2>{quizData.title}</h2>
          <p>Test your knowledge of the material covered in this module.</p>

          <div className={styles.introStats}>
            <div className={styles.statCard}>
              <strong>{quizData.questions.length}</strong>
              <span>Questions</span>
            </div>
            <div className={styles.statCard}>
              <strong>10 min</strong>
              <span>Est. Time</span>
            </div>
            <div className={styles.statCard}>
              <strong>70%</strong>
              <span>Pass Score</span>
            </div>
          </div>

          <p style={{ color: "#b8c4ce", marginBottom: "2rem" }}>
            Answer each question carefully. You can review your answers before
            submitting.
          </p>

          <button className={styles.startButton} onClick={startQuiz}>
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  if (quizState === "answering" && currentQuestion) {
    return (
      <div className={styles.quizContainer}>
        <QuizQuestion
          question={currentQuestion}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={quizData.questions.length}
          userAnswer={currentUserAnswer}
          onSelectAnswer={(answerIndex) =>
            selectAnswer(currentQuestion.id, answerIndex)
          }
          onNext={nextQuestion}
          onPrevious={previousQuestion}
          onSubmit={submitQuiz}
          canGoBack={currentQuestionIndex > 0}
          canGoNext={canGoNext}
          isLastQuestion={isLastQuestion}
        />
      </div>
    );
  }

  if (quizState === "results" && score !== null && passed !== null) {
    return (
      <div className={styles.quizContainer}>
        <QuizResults
          score={score}
          passed={passed}
          questions={quizData.questions}
          userAnswers={userAnswers}
          onRetake={resetQuiz}
          onBackToModule={() => {
            // Navigate back to module page
            navigate(
              `/docs/module-${currentQuestionIndex - 1}-${moduleName || "course"}/`
            );
          }}
        />
      </div>
    );
  }

  return null;
}

export default Quiz;
