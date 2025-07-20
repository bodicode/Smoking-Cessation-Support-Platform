import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, X } from 'lucide-react';
import { createProfileQuiz } from '@/services/quizService';

interface ProfileQuizModalProps {
  onClose: () => void;
  onCreated: () => void;
}

const ProfileQuizModal: React.FC<ProfileQuizModalProps> = ({ onClose, onCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await createProfileQuiz({
        title,
        description,
        is_active: false,
      });
      onCreated();
      setTitle('');
      setDescription('');
    } catch (err: any) {
      setError(err.message || 'Failed to create profile quiz');
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
        
        <h3 className="text-2xl font-bold text-[#03256c] mb-6">Create Profile Quiz</h3>
        
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
                  Creating...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <PlusCircle className="w-4 h-4" />
                  Create Quiz
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

export default ProfileQuizModal;