import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit, Filter, Plus, Search, Trash2, X } from 'lucide-react';
import { ProfileQuiz, QuestionType, QuizQuestion } from '@/types/api/quiz';

interface QuestionsModalProps {
  quiz: ProfileQuiz | null;
  onClose: () => void;
  onEditQuestion?: (question: QuizQuestion) => void;
  onDeleteQuestion?: (question: QuizQuestion) => void;
  onAddQuestion?: () => void;
}

const QuestionsModal: React.FC<QuestionsModalProps> = ({ 
  quiz, 
  onClose, 
  onEditQuestion, 
  onDeleteQuestion, 
  onAddQuestion 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  
  if (!quiz) return null;
  
  // Filter questions by search term and question type
  const filteredQuestions = quiz.questions?.filter(q => {
    const matchesSearch = q.question_text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === '' || q.question_type === selectedType;
    return matchesSearch && matchesType;
  }) || [];
  
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl relative max-h-[90vh] flex flex-col"
      >
        {/* Fixed header section */}
        <div className="p-8 border-b border-gray-100">
          <button 
            className="absolute right-5 top-5 text-gray-400 hover:text-red-500 transition-colors"
            onClick={onClose}
          >
            <X className="w-6 h-6" />
          </button>
          
          <h3 className="text-2xl font-bold text-[#03256c] mb-2">Questions</h3>
          <p className="text-gray-500">Managing questions for: {quiz.title}</p>
          
          {/* Search and filter section */}
          <div className="mt-6 flex flex-wrap gap-4 items-center">
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                className="w-full border border-gray-200 rounded-full pl-10 pr-4 py-2 focus:ring-2 ring-[#60c3a4] outline-none transition text-sm"
                placeholder="Search questions..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                className="border border-gray-200 rounded-full pl-10 pr-8 py-2 focus:ring-2 ring-[#60c3a4] outline-none transition text-sm appearance-none bg-white"
                value={selectedType}
                onChange={e => setSelectedType(e.target.value)}
              >
                <option value="">All Types</option>
                <option value="NUMBER">Number</option>
                <option value="SCALE">Scale</option>
                <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                <option value="BOOLEAN">Boolean</option>
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scrollable questions section */}
        <div className="flex-1 overflow-y-auto p-8 pt-6">
          {filteredQuestions.length > 0 ? (
            <div className="space-y-3 mb-8">
              {filteredQuestions.map((q, index) => (
                <motion.div 
                  key={q.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gray-50 rounded-xl p-4 flex justify-between items-center gap-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full">
                        #{q.order}
                      </span>
                      <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                        {q.question_type}
                      </span>
                    </div>
                    <p className="font-medium text-gray-800 mt-1">{q.question_text}</p>
                    {q.description && (
                      <p className="text-sm text-gray-500 mt-1">{q.description}</p>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1.5 bg-yellow-50 text-yellow-600 rounded-full hover:bg-yellow-100 transition-colors"
                      onClick={() => onEditQuestion && onEditQuestion(q)}
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1.5 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors"
                      onClick={() => onDeleteQuestion && onDeleteQuestion(q)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-blue-50 rounded-xl p-6 text-center mb-8">
              <div className="text-blue-600 mb-1">
                {searchTerm || selectedType ? 'No questions match your search' : 'No questions yet'}
              </div>
              <p className="text-sm text-blue-500">
                {searchTerm || selectedType 
                  ? 'Try adjusting your search or filters'
                  : 'Add your first question to this quiz'}
              </p>
            </div>
          )}
        </div>
        
        {/* Fixed footer with add button */}
        <div className="p-6 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {filteredQuestions.length} {filteredQuestions.length === 1 ? 'question' : 'questions'}
              {(searchTerm || selectedType) && ' found'}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#60c3a4] to-[#4ca885] text-white rounded-full font-medium hover:from-[#4ca885] hover:to-[#3a9670] transition-all shadow"
              onClick={onAddQuestion}
            >
              <Plus className="w-4 h-4" />
              Add New Question
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default QuestionsModal;