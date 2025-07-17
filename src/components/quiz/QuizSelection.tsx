import React from 'react';
import QuizCard from './QuizCard';
import { ProfileQuiz } from '@/types/api/quiz';

interface QuizSelectionProps {
  quizzes: ProfileQuiz[];
  onStartQuiz: (quizId: string) => void;
  t: (key: string) => string;
}

const QuizSelection: React.FC<QuizSelectionProps> = ({ quizzes, onStartQuiz, t }) => (
  <div className="space-y-8">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">{t('title')}</h1>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t('description')}</p>
    </div>
    <div className="grid gap-6">
      {quizzes.map((quiz) => (
        <QuizCard
          key={quiz.id}
          quiz={quiz}
          onStartQuiz={onStartQuiz}
          buttonText={t('startQuiz')}
        />
      ))}
    </div>
  </div>
);

export default QuizSelection; 