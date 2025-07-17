"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useQuiz } from '@/hooks/useQuiz';
import QuizCard from '@/components/quiz/QuizCard';
import QuestionCard from '@/components/quiz/QuestionCard';
import Loading from '@/components/common/Loading';
import Breadcrumbs from '@/components/common/BreadCrumb';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';

export default function QuizPage() {
  const t = useTranslations('quiz');
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
    nextQuestion,
    previousQuestion,
    submitQuiz,
    canGoNext,
    isLastQuestion,
    totalQuestions
  } = useQuiz();

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
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Breadcrumbs
          items={[
            { label: "Trang chủ", href: "/" },
            { label: "Đánh giá sức khỏe", active: true }
          ]}
        />

        {!currentQuiz ? (
          // Quiz selection screen
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">{t('title')}</h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t('description')}</p>
            </div>

            <div className="grid gap-6">
              {quizzes.map((quiz) => (
                <QuizCard
                  key={quiz.id}
                  quiz={quiz}
                  onStartQuiz={startQuiz}
                  buttonText={t('startQuiz')}
                />
              ))}
            </div>
          </motion.div>
        ) : (
          // Quiz taking screen
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Progress bar */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-800">{currentQuiz.title}</h3>
                <span className="text-sm text-gray-600">
                  {t('questionProgress', { 
                    current: currentQuestionIndex + 1, 
                    total: totalQuestions 
                  })}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-sky-500 to-blue-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ 
                    width: totalQuestions > 0 ? `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` : '0%'
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Question */}
            {currentQuestion && (
              <QuestionCard
                question={currentQuestion}
                answer={answers.get(currentQuestion.id)}
                onAnswer={(answer) => answerQuestion(currentQuestion.id, answer)}
              />
            )}

            {/* Navigation buttons */}
            <div className="flex justify-between items-center bg-white rounded-lg p-4 shadow-sm">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={previousQuestion}
                disabled={currentQuestionIndex === 0}
                className="flex items-center gap-2 px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                {t('previousQuestion')}
              </motion.button>

              {isLastQuestion() ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={submitQuiz}
                  disabled={!canGoNext() || isSubmitting}
                  className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-green-600 hover:to-green-700 transition-all"
                >
                  {isSubmitting ? (
                    <Loading size={16} color="white" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  {t('submitQuiz')}
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={nextQuestion}
                  disabled={!canGoNext()}
                  className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-sky-600 hover:to-blue-700 transition-all"
                >
                  {t('nextQuestion')}
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
