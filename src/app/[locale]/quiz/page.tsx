"use client";

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useQuiz } from '@/hooks/useQuiz';
import QuizCard from '@/components/quiz/QuizCard';
import QuestionCard from '@/components/quiz/QuestionCard';
import Loading from '@/components/common/Loading';
import Breadcrumbs from '@/components/common/BreadCrumb';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { ProfileQuiz, QuizQuestion } from '@/types/api/quiz';
import QuizLayout from '@/components/quiz/QuizLayout';
import QuizSelection from '@/components/quiz/QuizSelection';
import QuizProgress from '@/components/quiz/QuizProgress';
import QuizNavigation from '@/components/quiz/QuizNavigation';

export default function QuizPage() {
  const t = useTranslations('quiz');
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
          <h2 className="text-2xl font-bold text-red-600 mb-4">{t('error')}</h2>
          <button
            onClick={() => window.location.reload()}
            className="bg-sky-500 text-white px-6 py-2 rounded-lg hover:bg-sky-600"
          >
            {t('retryQuiz')}
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
        <QuizSelection quizzes={quizzes} onStartQuiz={startQuiz} t={t} />
      ) : (
        <>
          <QuizProgress
            title={currentQuiz.title}
            current={currentQuestionIndex + 1}
            total={totalQuestions}
            t={t}
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
            t={t}
          />
        </>
      )}
    </QuizLayout>
  );
}
