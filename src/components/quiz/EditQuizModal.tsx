import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { ProfileQuiz, UpdateProfileQuizInput } from '@/types/api/quiz';

interface EditQuizModalProps {
  quiz: ProfileQuiz;
  onClose: () => void;
  onUpdated: () => void;
  updateProfileQuiz: (input: UpdateProfileQuizInput) => Promise<any>;
}

const EditQuizModal: React.FC<EditQuizModalProps> = ({ quiz, onClose, onUpdated, updateProfileQuiz }) => {
  const [title, setTitle] = useState(quiz.title);
  const [description, setDescription] = useState(quiz.description);
  const [isActive, setIsActive] = useState(quiz.is_active);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await updateProfileQuiz({
        id: quiz.id,
        title,
        description,
        is_active: isActive,
      });
      onUpdated();
    } catch (err: any) {
      setError(err.message || 'Failed to update profile quiz');
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
        
        <h3 className="text-2xl font-bold text-[#03256c] mb-6">Edit Profile Quiz</h3>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Title</label>
            <input 
              type="text" 
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 ring-[#60c3a4] outline-none transition" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              required 
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">Description</label>
            <textarea 
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 ring-[#60c3a4] outline-none transition min-h-[100px]" 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              required 
            />
          </div>
          
          <div className="flex items-center gap-3 py-2">
            <span className="text-gray-700 font-medium">Active Status:</span>
            <button 
              type="button"
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isActive ? 'bg-[#60c3a4]' : 'bg-gray-200'}`}
              onClick={() => setIsActive(!isActive)}
            >
              <span 
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform ${isActive ? 'translate-x-6' : 'translate-x-1'}`}
              />
            </button>
            <span className={`text-sm font-medium ${isActive ? 'text-[#60c3a4]' : 'text-gray-500'}`}>
              {isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
          
          <div className="flex justify-end gap-3 pt-2">
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
              type="submit" 
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 text-white font-medium hover:from-sky-600 hover:to-blue-700 transition-all"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Saving...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  Save Changes
                </span>
              )}
            </motion.button>
          </div>
        </form>
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default EditQuizModal;