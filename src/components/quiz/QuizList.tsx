import React from 'react';
import { motion } from 'framer-motion';
import { Edit, Eye, Trash2 } from 'lucide-react';
import { ProfileQuiz } from '@/types/api/quiz';

type Props = {
  quizzes: ProfileQuiz[];
  onSelectQuiz: (id: string) => void;
  selectedQuizId: string | null;
  onShowQuestions: (id: string) => void;
  onEditQuiz: (quiz: ProfileQuiz) => void;
  onDeleteQuiz: (quiz: ProfileQuiz) => void;
  onActiveSwitch: (quiz: ProfileQuiz, newActive: boolean) => void;
  isActiveLoading: boolean;
};

const QuizList: React.FC<Props> = ({
  quizzes, onSelectQuiz, selectedQuizId, onShowQuestions, onEditQuiz, onDeleteQuiz, onActiveSwitch, isActiveLoading
}) => {
  if (!quizzes.length) return (
    <div className="text-center py-12 bg-blue-50/50 rounded-2xl">
      <div className="text-gray-500 mb-2">No profile quizzes found</div>
      <p className="text-sm text-gray-400">Create your first quiz to get started</p>
    </div>
  );
  
  return (
    <div className="space-y-6">
      {quizzes.map((quiz: ProfileQuiz) => (
        <motion.div 
          key={quiz.id} 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className={`bg-white rounded-2xl shadow-md p-6 border ${
            selectedQuizId === quiz.id 
              ? 'border-[#60c3a4] ring-2 ring-[#60c3a4]/20' 
              : 'border-transparent hover:border-gray-200'
          } transition-all`}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-[#03256c]">{quiz.title}</h3>
              <div className="text-gray-600 my-2">{quiz.description}</div>
              
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Active:</span>
                  <button 
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${quiz.is_active ? 'bg-[#60c3a4]' : 'bg-gray-200'}`}
                    onClick={() => !isActiveLoading && onActiveSwitch(quiz, !quiz.is_active)}
                    disabled={isActiveLoading}
                  >
                    <span 
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform ${quiz.is_active ? 'translate-x-6' : 'translate-x-1'}`}
                    />
                  </button>
                </div>
                
                {isActiveLoading && (
                  <span className="text-xs text-blue-500 animate-pulse">Updating...</span>
                )}
                
                <div className="flex-grow"></div>
                
                <div className="ml-auto flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors"
                    onClick={() => onShowQuestions(quiz.id)}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Questions</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-1.5 bg-yellow-50 text-yellow-600 rounded-full hover:bg-yellow-100 transition-colors"
                    onClick={() => onEditQuiz(quiz)}
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-1.5 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors"
                    onClick={() => onDeleteQuiz(quiz)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default QuizList;