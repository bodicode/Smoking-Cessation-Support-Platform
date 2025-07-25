import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  useProfileQuizzes, 
  useQuizQuestions, 
  startQuiz as startQuizService,
  submitQuiz as submitQuizService
} from '@/services/quizService';
import { SubmitQuizInput } from '@/types/api/quiz';

interface QuizOption {
  id: string;
  text: string;
}

interface QuizQuestion {
  id: string;
  quiz_id: string;
  question_text: string;
  description?: string;
  question_type: 'NUMBER' | 'SCALE' | 'MULTIPLE_CHOICE' | 'BOOLEAN';
  options?: string[];
  order: number;
  is_required: boolean;
  validation_rule?: any;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  is_active: boolean;
  questions?: QuizQuestion[];
}

interface QuizAnswer {
  questionId: string;
  answer: string | number | boolean;
}

export const useQuiz = () => {
  const router = useRouter();
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<string, any>>(new Map());
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // GraphQL hooks
  const { quizzes, loading, error, refetch } = useProfileQuizzes();
  const { 
    questions: fetchedQuestions, 
    loading: questionsLoading, 
    error: questionsError,
    refetch: refetchQuestions 
  } = useQuizQuestions(currentQuiz?.id || '');

  const loadQuizzes = async () => {
    try {
      await refetch();
    } catch (err) {
      console.error('Failed to load quizzes:', err);
    }
  };

  // Update questions when fetched
  useEffect(() => {
    if (fetchedQuestions && fetchedQuestions.length > 0) {
      const sortedQuestions = [...fetchedQuestions].sort((a, b) => a.order - b.order);
      setQuestions(sortedQuestions);
    }
  }, [fetchedQuestions]);

  // Load quizzes on mount
  useEffect(() => {
    loadQuizzes();
  }, [refetch]); // Add refetch as dependency

  const startQuiz = async (quizId: string) => {
    try {
      // Call the startQuiz service to create quiz attempt
      const quizAttempt = await startQuizService({ quiz_id: quizId });
      
      // Store the attempt ID for later use
      localStorage.setItem('currentQuizAttempt', quizAttempt.id);
      
      const quiz = quizzes.find((q: Quiz) => q.id === quizId);
      if (quiz) {
        setCurrentQuiz(quiz);
        setCurrentQuestionIndex(0);
        setAnswers(new Map());
        
        // Fetch questions for this quiz
        try {
          await refetchQuestions();
        } catch (err) {
          console.error('Failed to load quiz questions:', err);
        }
      }
    } catch (err) {
      console.error('Failed to start quiz:', err);
      throw err;
    }
  };

  const answerQuestion = (questionId: string, answer: any) => {
    const newAnswers = new Map(answers);
    newAnswers.set(questionId, answer);
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (questions && currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const submitQuiz = async () => {
    if (!currentQuiz || !questions.length) return;
    
    try {
      setIsSubmitting(true);
      // Get attempt_id from localStorage
      const attemptId = localStorage.getItem('currentQuizAttempt');
      if (!attemptId) {
        throw new Error('Không tìm thấy thông tin quiz attempt');
      }
      
      // Convert answers to the correct format
      const responses = Array.from(answers.entries()).map(([questionId, answer]) => ({
        question_id: questionId,
        answer: answer
      }));
      
      const input: SubmitQuizInput = {
        attempt_id: attemptId,
        responses: responses
      };
      
      const result = await submitQuizService(input);
      
      if (result) {
        // Create a mock result for the results page
        const mockResult = {
          id: result.attempt_id,
          user_id: 'current-user',
          quiz_id: currentQuiz.id,
          completed_at: new Date().toISOString(),
          total_score: calculateScore(),
          recommendations: generateRecommendations(),
          message: result.message
        };
        
        localStorage.setItem('quizResults', JSON.stringify(mockResult));
        localStorage.removeItem('currentQuizAttempt'); // Clean up
        router.push('/quiz/results');
      }
    } catch (err) {
      console.error('Failed to submit quiz:', err);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to calculate score based on answers
  const calculateScore = () => {
    let score = 0;
    const totalQuestions = questions.length;
    
    answers.forEach((answer, questionId) => {
      const question = questions.find(q => q.id === questionId);
      if (question) {
        // Simple scoring logic - you can customize this
        switch (question.question_type) {
          case 'BOOLEAN':
            score += answer === true ? 20 : 10;
            break;
          case 'SCALE':
            score += typeof answer === 'number' ? answer * 4 : 10;
            break;
          case 'NUMBER':
            // Lower numbers = better score for cigarettes
            score += Math.max(0, 20 - (typeof answer === 'number' ? answer : 0));
            break;
          case 'MULTIPLE_CHOICE':
            score += 15;
            break;
          default:
            score += 10;
        }
      }
    });
    
    return Math.min(100, Math.round(score / totalQuestions));
  };

  // Helper function to generate recommendations based on answers
  const generateRecommendations = () => {
    const recommendations = [];
    
    // Analyze answers and provide recommendations
    answers.forEach((answer, questionId) => {
      const question = questions.find(q => q.id === questionId);
      if (question) {
        if (question.question_text.includes('điếu thuốc mỗi ngày')) {
          const cigarettesPerDay = typeof answer === 'number' ? answer : 0;
          if (cigarettesPerDay > 20) {
            recommendations.push('Bạn nên bắt đầu với việc giảm từ từ số lượng thuốc hàng ngày');
          } else if (cigarettesPerDay > 10) {
            recommendations.push('Tham gia các hoạt động thay thế để giảm cảm giác thèm thuốc');
          }
        }
        
        if (question.question_text.includes('thức dậy')) {
          if (typeof answer === 'string' && answer.includes('5 phút')) {
            recommendations.push('Hãy thay đổi thói quen buổi sáng để tránh thèm thuốc ngay khi thức dậy');
          }
        }
        
        if (question.question_text.includes('khó khăn') && answer === true) {
          recommendations.push('Tìm hiểu các kỹ thuật thư giãn và quản lý căng thẳng');
        }
      }
    });
    
    // Default recommendations if none generated
    if (recommendations.length === 0) {
      recommendations.push('Bắt đầu với kế hoạch cai thuốc từ từ');
      recommendations.push('Tham gia cộng đồng hỗ trợ');
      recommendations.push('Theo dõi tiến độ hàng ngày');
    }
    
    return recommendations;
  };

  const canGoNext = () => {
    if (!questions.length) return false;
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion?.is_required) return true;
    return answers.has(currentQuestion.id);
  };

  const isLastQuestion = () => {
    return questions.length > 0 && currentQuestionIndex === questions.length - 1;
  };

  // Combine loading states and errors
  const combinedLoading = loading || questionsLoading;
  const combinedError = error || questionsError;

  return {
    quizzes: quizzes.filter((q: Quiz) => q.is_active),
    currentQuiz,
    currentQuestion: questions[currentQuestionIndex] || null,
    currentQuestionIndex,
    answers,
    loading: combinedLoading,
    error: combinedError,
    isSubmitting,
    startQuiz,
    answerQuestion,
    nextQuestion,
    previousQuestion,
    submitQuiz,
    canGoNext,
    isLastQuestion,
    loadQuizzes,
    totalQuestions: questions.length
  };
};