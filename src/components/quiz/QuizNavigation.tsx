import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import Loading from "@/components/common/Loading";

interface QuizNavigationProps {
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  canGoNext: boolean;
  isLast: boolean;
  isSubmitting: boolean;
  currentQuestionIndex: number;
}

const buttonVariants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

const QuizNavigation: React.FC<QuizNavigationProps> = ({
  onPrevious,
  onNext,
  onSubmit,
  canGoNext,
  isLast,
  isSubmitting,
  currentQuestionIndex,
}) => {
  return (
    <div className="flex justify-between items-center bg-white rounded-xl shadow-md p-4 mt-6 w-full">
      {/* Previous Button */}
      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        onClick={onPrevious}
        disabled={currentQuestionIndex === 0}
        className="flex items-center gap-2 px-5 py-2 rounded-lg font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ArrowLeft className="w-4 h-4" />
        Câu trước
      </motion.button>

      {/* Next or Submit */}
      {isLast ? (
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={onSubmit}
          disabled={!canGoNext || isSubmitting}
          className="flex items-center gap-2 px-6 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <Loading size={16} color="white" />
          ) : (
            <CheckCircle className="w-4 h-4" />
          )}
          Gửi bài kiểm tra
        </motion.button>
      ) : (
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={onNext}
          disabled={!canGoNext}
          className="flex items-center gap-2 px-6 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Câu tiếp theo
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      )}
    </div>
  );
};

export default QuizNavigation;
