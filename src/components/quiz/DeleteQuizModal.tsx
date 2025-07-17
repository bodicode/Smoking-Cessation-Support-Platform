import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, X } from 'lucide-react';
import { ProfileQuiz } from '@/types/api/quiz';
import { QuizQuestion } from '@/types/api/quiz';
import toast from 'react-hot-toast';
import { SuccessToast } from '@/components/common/CustomToast';

interface DeleteQuizModalProps {
  quiz?: ProfileQuiz;
  question?: QuizQuestion;
  onClose: () => void;
  onDeleted: () => void;
  deleteProfileQuiz?: (id: string) => Promise<any>;
  deleteQuizQuestion?: (id: string) => Promise<any>;
}

const DeleteQuizModal: React.FC<DeleteQuizModalProps> = ({ quiz, question, onClose, onDeleted, deleteProfileQuiz, deleteQuizQuestion }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      if (question && deleteQuizQuestion) {
        await deleteQuizQuestion(question.id);
        toast.custom(<SuccessToast message="Quiz question deleted successfully!" />);
      } else if (quiz && deleteProfileQuiz) {
        await deleteProfileQuiz(quiz.id);
        toast.custom(<SuccessToast message="Quiz deleted successfully!" />);
      }
      onDeleted();
    } catch (err: any) {
      let msg = err.message || 'Failed to delete';
      if (msg.includes('quiz_response_question_id_fkey')) {
        msg = 'Cannot delete this question because it has user responses.';
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md relative"
      >
        <button 
          className="absolute right-5 top-5 text-gray-400 hover:text-red-500 transition-colors"
          onClick={onClose}
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="text-center mb-6">
          <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-2xl font-bold text-[#03256c]">Delete {question ? 'Question' : 'Quiz'}</h3>
          <p className="text-gray-500 mt-2">Are you sure you want to delete this {question ? 'question' : 'quiz'}?</p>
        </div>
        
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          {question ? (
            <>
              <p className="font-medium text-gray-800">{question.question_text}</p>
              <p className="text-sm text-gray-500 mt-1">{question.description}</p>
            </>
          ) : quiz ? (
            <>
              <p className="font-medium text-gray-800">{quiz.title}</p>
              <p className="text-sm text-gray-500 mt-1">{quiz.description}</p>
            </>
          ) : null}
        </div>
        
        <div className="flex justify-center gap-3">
          <motion.button 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="button" 
            className="px-5 py-2.5 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors" 
            onClick={onClose}
          >
            Cancel
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="button" 
            className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white font-medium hover:from-red-600 hover:to-red-700 transition-all"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                Deleting...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                Delete {question ? 'Question' : 'Quiz'}
              </span>
            )}
          </motion.button>
        </div>
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default DeleteQuizModal;