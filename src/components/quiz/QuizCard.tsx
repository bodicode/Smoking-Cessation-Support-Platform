import React from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, Users, Clock } from 'lucide-react';

interface Quiz {
  id: string;
  title: string;
  description: string;
  is_active: boolean;
  questions?: any[];
}

interface QuizCardProps {
  quiz: Quiz;
  onStartQuiz: (quizId: string) => void;
  buttonText: string;
}

const QuizCard: React.FC<QuizCardProps> = ({ quiz, onStartQuiz, buttonText }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-sky-400 hover:border-sky-600 transition-all duration-200"
    >
      <div className="flex items-start gap-4">
        <div className="bg-sky-100 p-3 rounded-lg">
          <ClipboardList className="w-6 h-6 text-sky-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-800 mb-2">{quiz.title}</h3>
          <p className="text-gray-600 mb-4 line-clamp-2">{quiz.description}</p>

          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>Cá nhân hóa</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>5-10 phút</span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onStartQuiz(quiz.id)}
            className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer"
          >
            {buttonText}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default QuizCard;
