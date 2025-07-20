import React from 'react';
import QuizCard from './QuizCard';
import { ProfileQuiz } from '@/types/api/quiz';

interface QuizSelectionProps {
  quizzes: ProfileQuiz[];
  onStartQuiz: (quizId: string) => void;
}

const QuizSelection: React.FC<QuizSelectionProps> = ({ quizzes, onStartQuiz }) => (
  <div className="space-y-8">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Bài kiểm tra sức khỏe</h1>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto">Đánh giá sức khỏe của bạn để nhận được các gợi ý cá nhân hóa cho kế hoạch cai thuốc lá của bạn</p>
    </div>
    <div className="grid gap-6">
      {quizzes.map((quiz) => (
        <QuizCard
          key={quiz.id}
          quiz={quiz}
          onStartQuiz={onStartQuiz}
          buttonText="Bắt đầu bài kiểm tra"
        />
      ))}
    </div>
  </div>
);

export default QuizSelection; 