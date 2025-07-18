'use client';
import React, { useState } from 'react';
import { useProfileQuizzes, createProfileQuiz, createQuizQuestion, updateProfileQuiz, deleteProfileQuiz, updateQuizQuestion, deleteQuizQuestion } from '@/services/quizService';
import { motion } from 'framer-motion';
import { PlusCircle, Search } from 'lucide-react';
import { ProfileQuiz, QuizQuestion } from '@/types/api/quiz';
import QuizList from '@/components/quiz/QuizList';
import ProfileQuizModal from '@/components/quiz/ProfileQuizModal';
import EditQuizModal from '@/components/quiz/EditQuizModal';
import DeleteQuizModal from '@/components/quiz/DeleteQuizModal';
import QuizQuestionForm from '@/components/quiz/QuizQuestionForm';
import QuestionsModal from '@/components/quiz/QuestionsModal';

const AdminProfileQuizPage = () => {
  const { quizzes, loading, error, refetch } = useProfileQuizzes();
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const [showQuestionsModal, setShowQuestionsModal] = useState<string | null>(null);
  const [filter, setFilter] = useState('');
  const [editQuiz, setEditQuiz] = useState<any | null>(null);
  const [deleteQuiz, setDeleteQuiz] = useState<any | null>(null);
  const [isActiveLoading, setIsActiveLoading] = useState(false);
  const [editQuestion, setEditQuestion] = useState<QuizQuestion | null>(null);
  const [deleteQuestion, setDeleteQuestion] = useState<QuizQuestion | null>(null);

  const filteredQuizzes = quizzes.filter((quiz: ProfileQuiz) =>
    quiz.title.toLowerCase().includes(filter.toLowerCase())
  );

  // Handler to ensure only one active profile quiz
  const handleActiveSwitch = async (quiz: ProfileQuiz, newActive: boolean) => {
    setIsActiveLoading(true);
    try {
      if (newActive) {
        // Find currently active quiz (if any, and not the same)
        const currentActive = quizzes.find((q: ProfileQuiz) => q.is_active && q.id !== quiz.id);
        if (currentActive) {
          await updateProfileQuiz({
            id: currentActive.id,
            title: currentActive.title,
            description: currentActive.description,
            is_active: false,
          });
        }
        await updateProfileQuiz({
          id: quiz.id,
          title: quiz.title,
          description: quiz.description,
          is_active: true,
        });
      } else {
        await updateProfileQuiz({
          id: quiz.id,
          title: quiz.title,
          description: quiz.description,
          is_active: false,
        });
      }
      await refetch();
    } catch (err) {
      // Optionally show error toast
      alert('Failed to update active status.');
    } finally {
      setIsActiveLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-br from-[#e3f6ff] via-[#fefcf6] to-[#fff7f1] py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 mb-8"
        >
          <h1 className="text-3xl font-bold text-[#03256c] mb-2">Quản lý bài kiểm tra</h1>
          <p className="text-gray-500 mb-6">Tạo và quản lý bài kiểm tra cho người dùng</p>

          <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                className="border border-gray-200 rounded-full pl-10 pr-4 py-2 w-full sm:w-64 focus:ring-2 ring-[#60c3a4] outline-none transition"
                placeholder="Lọc theo tên bài kiểm tra..."
                value={filter}
                onChange={e => setFilter(e.target.value)}
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-full font-semibold hover:from-sky-600 hover:to-blue-700 transition-all shadow"
              onClick={() => setShowQuizModal(true)}
            >
              <PlusCircle className="w-5 h-5" />
              Tạo bài kiểm tra hồ sơ
            </motion.button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#60c3a4]"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center">
              {error}
            </div>
          ) : (
            <QuizList
              quizzes={filteredQuizzes}
              onSelectQuiz={setSelectedQuizId}
              selectedQuizId={selectedQuizId}
              onShowQuestions={setShowQuestionsModal}
              onEditQuiz={setEditQuiz}
              onDeleteQuiz={setDeleteQuiz}
              onActiveSwitch={handleActiveSwitch}
              isActiveLoading={isActiveLoading}
            />
          )}
        </motion.div>
      </div>

      {/* Modals */}
      {showQuizModal && (
        <ProfileQuizModal
          onClose={() => setShowQuizModal(false)}
          onCreated={async () => {
            setShowQuizModal(false);
            await refetch();
          }}
        />
      )}
      {editQuiz && (
        <EditQuizModal
          quiz={editQuiz}
          onClose={() => setEditQuiz(null)}
          onUpdated={async () => {
            setEditQuiz(null);
            await refetch();
          }}
          updateProfileQuiz={updateProfileQuiz}
        />
      )}
      {deleteQuiz && (
        <DeleteQuizModal
          quiz={deleteQuiz}
          onClose={() => setDeleteQuiz(null)}
          onDeleted={async () => {
            setDeleteQuiz(null);
            setSelectedQuizId(null);
            await refetch();
          }}
          deleteProfileQuiz={deleteProfileQuiz}
        />
      )}
      {selectedQuizId && (
        <QuizQuestionForm
          quizId={selectedQuizId}
          onCreated={async () => {
            await refetch();
          }}
          createQuizQuestion={createQuizQuestion}
        />
      )}
      {showQuestionsModal && (
        <QuestionsModal
          quiz={filteredQuizzes.find((q: ProfileQuiz) => q.id === showQuestionsModal)}
          onClose={() => setShowQuestionsModal(null)}
          onEditQuestion={setEditQuestion}
          onDeleteQuestion={setDeleteQuestion}
        />
      )}
      {/* Edit Question Modal */}
      {editQuestion && (
        <QuizQuestionForm
          quizId={editQuestion.quiz_id}
          question={editQuestion}
          onUpdated={async () => {
            setEditQuestion(null);
            await refetch();
          }}
          updateQuizQuestion={updateQuizQuestion}
        />
      )}
      {/* Delete Question Modal */}
      {deleteQuestion && (
        <DeleteQuizModal
          question={deleteQuestion}
          onClose={() => setDeleteQuestion(null)}
          onDeleted={async () => {
            setDeleteQuestion(null);
            await refetch();
          }}
          deleteQuizQuestion={deleteQuizQuestion}
        />
      )}
    </div>
  );
};

export default AdminProfileQuizPage;