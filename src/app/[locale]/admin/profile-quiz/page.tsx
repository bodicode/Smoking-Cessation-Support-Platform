'use client';
import React, { useState } from 'react';
import { useProfileQuizzes, createProfileQuiz, createQuizQuestion } from '@/services/quizService';

const AdminProfileQuizPage = () => {
  const { quizzes, loading, error, refetch } = useProfileQuizzes();
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);

  return (
    <div className="admin-profile-quiz-page p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Profile Quiz Management</h1>
      <div className="mb-4 flex justify-between items-center">
        <GuideSection />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded shadow"
          onClick={() => setShowQuizModal(true)}
        >
          + Create Profile Quiz
        </button>
      </div>
      {loading ? (
        <div>Loading quizzes...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <QuizList quizzes={quizzes} onSelectQuiz={setSelectedQuizId} selectedQuizId={selectedQuizId} />
      )}
      {showQuizModal && (
        <ProfileQuizModal
          onClose={() => setShowQuizModal(false)}
          onCreated={async (quiz) => {
            setShowQuizModal(false);
            setSelectedQuizId(quiz.id);
            await refetch();
          }}
        />
      )}
      {selectedQuizId && (
        <QuizQuestionForm
          quizId={selectedQuizId}
          onCreated={async () => {
            await refetch();
          }}
        />
      )}
    </div>
  );
};

function GuideSection() {
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded">
      <h2 className="font-semibold mb-2">How to use the Profile Quiz system:</h2>
      <ol className="list-decimal ml-6 mb-2">
        <li>Click <b>+ Create Profile Quiz</b> to add a new quiz.</li>
        <li>After creation, select a quiz to add questions.</li>
        <li>Questions are shown under each quiz.</li>
      </ol>
      <div className="text-sm text-gray-700">
        <b>Note:</b> See <code>profile-quiz-sample-data.gql</code> and <code>usage.md</code> for sample mutations and data structure.<br />
        <b>is_active</b> is always <b>false</b> when creating a new Profile Quiz.
      </div>
    </div>
  );
}

function QuizList({ quizzes, onSelectQuiz, selectedQuizId }: { quizzes: any[]; onSelectQuiz: (id: string) => void; selectedQuizId: string | null }) {
  if (!quizzes.length) return <div>No profile quizzes found.</div>;
  return (
    <div className="space-y-6">
      {quizzes.map((quiz) => (
        <div key={quiz.id} className={`border rounded shadow p-4 ${selectedQuizId === quiz.id ? 'border-blue-500' : 'border-gray-200'}`}>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold">{quiz.title}</h3>
              <div className="text-gray-600 mb-1">{quiz.description}</div>
              <div className="text-xs text-gray-500 mb-2">ID: <span className="font-mono">{quiz.id}</span></div>
              <div className="text-xs">Active: <b>{quiz.is_active ? 'Yes' : 'No'}</b></div>
            </div>
            <button
              className={`ml-4 px-3 py-1 rounded ${selectedQuizId === quiz.id ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              onClick={() => onSelectQuiz(quiz.id)}
            >
              {selectedQuizId === quiz.id ? 'Selected' : 'Add Question'}
            </button>
          </div>
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Questions:</h4>
            {quiz.questions && quiz.questions.length > 0 ? (
              <ul className="list-decimal ml-6 space-y-1">
                {quiz.questions.map((q: any) => (
                  <li key={q.id}>
                    <span className="font-medium">{q.question_text}</span> <span className="text-xs text-gray-500">({q.question_type})</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-400">No questions yet.</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function ProfileQuizModal({ onClose, onCreated }: { onClose: () => void; onCreated: (quiz: any) => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await createProfileQuiz({
        title,
        description,
        is_active: false,
      });
      onCreated(result);
      setTitle('');
      setDescription('');
    } catch (err: any) {
      setError(err.message || 'Failed to create profile quiz');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg p-8 w-full max-w-md relative">
        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800" onClick={onClose}>&times;</button>
        <h3 className="font-semibold mb-4 text-lg">Create Profile Quiz</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Title</label>
            <input type="text" className="w-full border rounded px-3 py-2" value={title} onChange={e => setTitle(e.target.value)} required />
          </div>
          <div>
            <label className="block font-medium mb-1">Description</label>
            <textarea className="w-full border rounded px-3 py-2" value={description} onChange={e => setDescription(e.target.value)} required />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" className="px-4 py-2 rounded bg-gray-200" onClick={onClose}>Cancel</button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>{loading ? 'Creating...' : 'Create Quiz'}</button>
          </div>
        </form>
        {error && <div className="text-red-600 mt-3">{error}</div>}
      </div>
    </div>
  );
}

function QuizQuestionForm({ quizId, onCreated }: { quizId: string; onCreated: () => void }) {
  const [questionText, setQuestionText] = useState('');
  const [description, setDescription] = useState('');
  const [questionType, setQuestionType] = useState('NUMBER');
  const [options, setOptions] = useState(''); // comma-separated
  const [order, setOrder] = useState(1);
  const [isRequired, setIsRequired] = useState(true);
  const [validationRule, setValidationRule] = useState(''); // JSON string
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      let parsedOptions: string[] | undefined = undefined;
      if (["MULTIPLE_CHOICE", "SCALE", "BOOLEAN"].includes(questionType)) {
        parsedOptions = options.split(',').map(opt => opt.trim()).filter(Boolean);
      }
      let parsedValidation: any = undefined;
      if (validationRule) {
        try {
          parsedValidation = JSON.parse(validationRule);
        } catch {
          setError('Validation Rule must be valid JSON');
          setLoading(false);
          return;
        }
      }
      await createQuizQuestion({
        quiz_id: quizId,
        question_text: questionText,
        description,
        question_type: questionType,
        options: parsedOptions,
        order: Number(order),
        is_required: isRequired,
        validation_rule: parsedValidation,
      });
      setSuccess('Quiz Question created successfully!');
      setQuestionText('');
      setDescription('');
      setOptions('');
      setOrder(1);
      setIsRequired(true);
      setValidationRule('');
      onCreated();
    } catch (err: any) {
      setError(err.message || 'Failed to create quiz question');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg p-8 w-full max-w-lg relative">
        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800" onClick={onCreated}>&times;</button>
        <h3 className="font-semibold mb-4 text-lg">Add Question to Quiz</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Question Text</label>
            <input type="text" className="w-full border rounded px-3 py-2" value={questionText} onChange={e => setQuestionText(e.target.value)} required />
          </div>
          <div>
            <label className="block font-medium mb-1">Description</label>
            <textarea className="w-full border rounded px-3 py-2" value={description} onChange={e => setDescription(e.target.value)} />
          </div>
          <div>
            <label className="block font-medium mb-1">Question Type</label>
            <select className="w-full border rounded px-3 py-2" value={questionType} onChange={e => setQuestionType(e.target.value)}>
              <option value="NUMBER">NUMBER</option>
              <option value="SCALE">SCALE</option>
              <option value="MULTIPLE_CHOICE">MULTIPLE_CHOICE</option>
              <option value="BOOLEAN">BOOLEAN</option>
            </select>
          </div>
          {['MULTIPLE_CHOICE', 'SCALE', 'BOOLEAN'].includes(questionType) && (
            <div>
              <label className="block font-medium mb-1">Options (comma separated)</label>
              <input type="text" className="w-full border rounded px-3 py-2" value={options} onChange={e => setOptions(e.target.value)} />
            </div>
          )}
          <div>
            <label className="block font-medium mb-1">Order</label>
            <input type="number" className="w-full border rounded px-3 py-2" value={order} onChange={e => setOrder(Number(e.target.value))} min={1} required />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={isRequired} onChange={e => setIsRequired(e.target.checked)} id="isRequired" />
            <label htmlFor="isRequired" className="font-medium">Is Required</label>
          </div>
          <div>
            <label className="block font-medium mb-1">Validation Rule (JSON)</label>
            <textarea className="w-full border rounded px-3 py-2" value={validationRule} onChange={e => setValidationRule(e.target.value)} placeholder='{"min":0,"max":100,"message":"..."}' />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" className="px-4 py-2 rounded bg-gray-200" onClick={onCreated}>Close</button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>{loading ? 'Creating...' : 'Add Question'}</button>
          </div>
        </form>
        {success && <div className="text-green-600 mt-3">{success}</div>}
        {error && <div className="text-red-600 mt-3">{error}</div>}
      </div>
    </div>
  );
}

export default AdminProfileQuizPage; 