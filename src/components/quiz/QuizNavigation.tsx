import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import Loading from '@/components/common/Loading';

interface QuizNavigationProps {
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  canGoNext: boolean;
  isLast: boolean;
  isSubmitting: boolean;
  currentQuestionIndex: number;
  t: (key: string) => string;
}

const QuizNavigation: React.FC<QuizNavigationProps> = ({
  onPrevious,
  onNext,
  onSubmit,
  canGoNext,
  isLast,
  isSubmitting,
  currentQuestionIndex,
  t
}) => (
  <div className="flex justify-between items-center bg-white rounded-lg p-4 shadow-sm">
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onPrevious}
      disabled={currentQuestionIndex === 0}
      className="flex items-center gap-2 px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
    >
      <ArrowLeft className="w-4 h-4" />
      {t('previousQuestion')}
    </motion.button>
    {isLast ? (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onSubmit}
        disabled={!canGoNext || isSubmitting}
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
        onClick={onNext}
        disabled={!canGoNext}
        className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-sky-600 hover:to-blue-700 transition-all"
      >
        {t('nextQuestion')}
        <ArrowRight className="w-4 h-4" />
      </motion.button>
    )}
  </div>
);

export default QuizNavigation; 