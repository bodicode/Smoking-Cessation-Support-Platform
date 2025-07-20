import { useQuery, useMutation } from "@apollo/client";
import { GET_PROFILE_QUIZZES } from "@/graphql/queries/quiz/getProfileQuizzes";
import { GET_QUIZ_QUESTIONS } from "@/graphql/queries/quiz/getQuizQuestions";
import { CREATE_QUIZ_ANSWER } from "@/graphql/mutations/quiz/createQuizAnswer";
import { SUBMIT_QUIZ } from "@/graphql/mutations/quiz/submitQuizResponse";
import { START_QUIZ } from "@/graphql/mutations/quiz/startQuiz";
import client from "@/apollo/apolloClient";
import { CREATE_PROFILE_QUIZ } from "@/graphql/mutations/quiz/createProfileQuiz";
import { CREATE_QUIZ_QUESTION } from "@/graphql/mutations/quiz/createQuizQuestion";
import { UPDATE_PROFILE_QUIZ } from "@/graphql/mutations/quiz/updateProfileQuiz";
import { DELETE_PROFILE_QUIZ } from "@/graphql/mutations/quiz/deleteProfileQuiz";
import { UPDATE_QUIZ_QUESTION } from "@/graphql/mutations/quiz/updateQuizQuestion";
import { DELETE_QUIZ_QUESTION } from "@/graphql/mutations/quiz/deleteQuizQuestion";
import { GET_AI_RECOMMENDATION } from "@/graphql/queries/templates/getAIRecommendation";
import { GET_QUIZ_ATTEMPT_ON_CURRENT_USER } from "@/graphql/queries/quiz/getQuizAttemptOnCurrentUser";
import { StartQuizInput, StartQuizResponse, SubmitQuizInput, SubmitQuizResponse } from "@/types/api/quiz";

export interface QuizAnswer {
  question_id: string;
  answer_value: string | number | boolean;
}

export interface CreateQuizResponseInput {
  quiz_id: string;
  answers: QuizAnswer[];
}

// Hook to get all profile quizzes
export function useProfileQuizzes() {
  const { data, loading, error, refetch } = useQuery(GET_PROFILE_QUIZZES);
  
  return {
    quizzes: data?.getProfileQuizzes || [],
    loading,
    error: error?.message || null,
    refetch
  };
}

// Hook to get questions for a specific quiz
export function useQuizQuestions(quizId: string) {
  const { data, loading, error, refetch } = useQuery(GET_QUIZ_QUESTIONS, {
    variables: { profileQuizId: quizId },
    skip: !quizId,
    errorPolicy: 'all' // Handle partial errors gracefully
  });
  
  return {
    questions: data?.getQuizQuestionsInProfileQuiz || [],
    loading,
    error: error?.message || null,
    refetch
  };
}

// Hook to create quiz answer
export function useCreateQuizAnswer() {
  const [createAnswer, { loading, error }] = useMutation(CREATE_QUIZ_ANSWER);
  
  return {
    createAnswer,
    loading,
    error: error?.message || null
  };
}

// Hook to submit quiz response
export function useSubmitQuizResponse() {
  const [submitQuiz, { loading, error }] = useMutation(SUBMIT_QUIZ);
  
  return {
    submitResponse: submitQuiz,
    loading,
    error: error?.message || null
  };
}

export async function createProfileQuiz(input: any) {
  const { data, errors } = await client.mutate({
    mutation: CREATE_PROFILE_QUIZ,
    variables: { input },
  });
  if (errors && errors.length > 0) throw new Error(errors[0].message || "Tạo profile quiz thất bại");
  return data.createProfileQuiz;
}

export async function createQuizQuestion(input: any) {
  const { data, errors } = await client.mutate({
    mutation: CREATE_QUIZ_QUESTION,
    variables: { input },
  });
  if (errors && errors.length > 0) throw new Error(errors[0].message || "Tạo quiz question thất bại");
  return data.createQuizQuestion;
}

export async function updateProfileQuiz(input: any) {
  const { data, errors } = await client.mutate({
    mutation: UPDATE_PROFILE_QUIZ,
    variables: { input },
  });
  if (errors && errors.length > 0) throw new Error(errors[0].message || "Cập nhật profile quiz thất bại");
  return data.updateProfileQuiz;
}

export async function deleteProfileQuiz(id: string) {
  const { data, errors } = await client.mutate({
    mutation: DELETE_PROFILE_QUIZ,
    variables: { deleteProfileQuizId: id },
  });
  if (errors && errors.length > 0) throw new Error(errors[0].message || "Xóa profile quiz thất bại");
  return data.deleteProfileQuiz;
}

export async function updateQuizQuestion(input: any) {
  const { data, errors } = await client.mutate({
    mutation: UPDATE_QUIZ_QUESTION,
    variables: { updateQuizQuestionInput2: input },
  });
  if (errors && errors.length > 0) throw new Error(errors[0].message || "Cập nhật quiz question thất bại");
  return data.updateQuizQuestion;
}

export async function deleteQuizQuestion(id: string) {
  const { data, errors } = await client.mutate({
    mutation: DELETE_QUIZ_QUESTION,
    variables: { deleteQuizQuestionId: id },
  });
  if (errors && errors.length > 0) throw new Error(errors[0].message || "Xóa quiz question thất bại");
  return data.deleteQuizQuestion;
}

export async function startQuiz(input: StartQuizInput): Promise<StartQuizResponse> {
  const { data, errors } = await client.mutate({
    mutation: START_QUIZ,
    variables: { startQuizInput2: input },
  });
  if (errors && errors.length > 0) throw new Error(errors[0].message || "Bắt đầu quiz thất bại");
  return data.startQuiz;
}

export async function submitQuiz(input: SubmitQuizInput): Promise<SubmitQuizResponse> {
  const { data, errors } = await client.mutate({
    mutation: SUBMIT_QUIZ,
    variables: { input },
  });
  if (errors && errors.length > 0) throw new Error(errors[0].message || "Submit quiz thất bại");
  return data.submitQuiz;
}

export async function getAIRecommendation(): Promise<any> {
  const { data, errors } = await client.query({
    query: GET_AI_RECOMMENDATION,
    fetchPolicy: "no-cache"
  });
  if (errors && errors.length > 0) throw new Error(errors[0].message || "Lấy gợi ý AI thất bại");
  return data.getAIRecommendation;
}

export async function getQuizAttemptOnCurrentUser(): Promise<any> {
  const { data, errors } = await client.query({
    query: GET_QUIZ_ATTEMPT_ON_CURRENT_USER,
    fetchPolicy: "no-cache"
  });
  if (errors && errors.length > 0) throw new Error(errors[0].message || "Lấy quiz attempt thất bại");
  return data.getQuizAttemptOnCurrentUser;
}
