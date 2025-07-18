import React from 'react';
import { motion } from 'framer-motion';

interface QuizProgressProps {
  title: string;
  current: number;
  total: number;
}

const QuizProgress: React.FC<QuizProgressProps> = ({ title, current, total }) => (
  <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
    <div className="flex items-center justify-between mb-2">
      <h3 className="font-semibold text-gray-800">{title}</h3>
      <span className="text-sm text-gray-600">
        Câu hỏi {current} / {total}
      </span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2">
      <motion.div
        className="bg-gradient-to-r from-sky-500 to-blue-600 h-2 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: total > 0 ? `${(current / total) * 100}%` : '0%' }}
        transition={{ duration: 0.3 }}
      />
    </div>
  </div>
);

export default QuizProgress; 