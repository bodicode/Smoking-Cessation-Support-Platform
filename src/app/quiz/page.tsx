"use client";

import React, { useRef, useEffect } from 'react';
import { useQuiz } from '@/hooks/useQuiz';
import QuestionCard from '@/components/quiz/QuestionCard';
import Loading from '@/components/common/Loading';
import Breadcrumbs from '@/components/common/BreadCrumb';
import QuizLayout from '@/components/quiz/QuizLayout';
import QuizSelection from '@/components/quiz/QuizSelection';
import QuizProgress from '@/components/quiz/QuizProgress';
import QuizNavigation from '@/components/quiz/QuizNavigation';
import { useRouter, useSearchParams } from "next/navigation";
import { getQuizAttemptOnCurrentUser } from '@/services/quizService';

export default function QuizPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const topRef = useRef<HTMLDivElement>(null);
  const {
    quizzes,
    currentQuiz,
    currentQuestion,
    currentQuestionIndex,
    answers,
    loading,
    error,
    isSubmitting,
    startQuiz,
    answerQuestion,
    nextQuestion: nextQuestionBase,
    previousQuestion: previousQuestionBase,
    submitQuiz,
    canGoNext,
    isLastQuestion,
    totalQuestions
  } = useQuiz();

  useEffect(() => {
    async function checkQuizAttempt() {
      // Nếu có retry=1 thì cho phép làm lại
      if (searchParams.get("retry") === "1") return;
      try {
        const attempt = await getQuizAttemptOnCurrentUser();
        if (attempt?.length > 0) {
          router.replace("/quiz/results");
        }
      } catch (err) {
        // ignore error
      }
    }
    checkQuizAttempt();
  }, [router, searchParams]);

  const nextQuestion = () => {
    nextQuestionBase();
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const previousQuestion = () => {
    previousQuestionBase();
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Lỗi khi tải bài kiểm tra sức khỏe</h2>
          <button
            onClick={() => window.location.reload()}
            className="bg-sky-500 text-white px-6 py-2 rounded-lg hover:bg-sky-600"
          >
            Thử lại bài kiểm tra sức khỏe
          </button>
        </div>
      </div>
    );
  }

  return (
    <QuizLayout ref={topRef}>
      <Breadcrumbs
        items={[
          { label: "Trang chủ", href: "/" },
          { label: "Đánh giá sức khỏe", active: true }
        ]}
      />
      {!currentQuiz ? (
        <QuizSelection quizzes={quizzes} onStartQuiz={startQuiz} />
      ) : (
        <>
          <QuizProgress
            title={currentQuiz.title}
            current={currentQuestionIndex + 1}
            total={totalQuestions}
          />
          {currentQuestion && (
            <QuestionCard
              question={currentQuestion}
              answer={answers.get(currentQuestion.id)}
              onAnswer={(answer) => answerQuestion(currentQuestion.id, answer)}
            />
          )}
          <QuizNavigation
            onPrevious={previousQuestion}
            onNext={nextQuestion}
            onSubmit={submitQuiz}
            canGoNext={canGoNext()}
            isLast={isLastQuestion()}
            isSubmitting={isSubmitting}
            currentQuestionIndex={currentQuestionIndex}
          />
        </>
      )}
    </QuizLayout>
  );
}
