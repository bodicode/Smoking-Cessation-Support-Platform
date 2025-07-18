// Quiz-related TypeScript types

export type QuestionType = 'NUMBER' | 'SCALE' | 'MULTIPLE_CHOICE' | 'BOOLEAN';

export interface QuizQuestion {
  id: string;
  quiz_id: string;
  question_text: string;
  description?: string;
  question_type: QuestionType;
  options?: string[];
  order: number;
  is_required: boolean;
  validation_rule?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface ProfileQuiz {
  id: string;
  title: string;
  description: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  questions?: QuizQuestion[];
}

export interface CreateProfileQuizInput {
  title: string;
  description: string;
  is_active: boolean;
}

export interface UpdateProfileQuizInput {
  id: string;
  title?: string;
  description?: string;
  is_active?: boolean;
}

export interface CreateQuizQuestionInput {
  quiz_id: string;
  question_text: string;
  description?: string;
  question_type: QuestionType;
  options?: string[];
  order: number;
  is_required: boolean;
  validation_rule?: Record<string, any>;
}

export interface UpdateQuizQuestionInput extends Partial<CreateQuizQuestionInput> {
  id: string;
}

export interface DeleteQuizQuestionInput {
  id: string;
}

export interface GetProfileQuizzesResponse {
  profileQuizzes: ProfileQuiz[];
}

export interface GetQuizQuestionsResponse {
  quizQuestions: QuizQuestion[];
}

export interface QuizFilters {
  title?: string;
  is_active?: boolean;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface QuizResponse {
  data: ProfileQuiz[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
}

export interface DeleteQuizQuestionResponse {
  success: boolean;
  message?: string;
}

export interface StartQuizInput {
  quiz_id: string;
}

export interface StartQuizResponse {
  id: string;
  member_profile_id: string;
  quiz_id: string;
  created_at: string;
  completed_at?: string;
  responses: QuizResponse[];
  started_at: string;
  status: string;
  updated_at: string;
  user_id: string;
}

export interface SubmitQuizAnswer {
  question_id: string;
  answer: string | number | boolean | string[];
}

export interface SubmitQuizInput {
  attempt_id: string;
  responses: SubmitQuizAnswer[];
}

export interface SubmitQuizResponse {
  attempt_id: string;
  member_profile_updated: boolean;
  message: string;
  responses: {
    answer: string;
    attempt_id: string;
    created_at: string;
    id: string;
    question_id: string;
    updated_at: string;
  }[];
}
