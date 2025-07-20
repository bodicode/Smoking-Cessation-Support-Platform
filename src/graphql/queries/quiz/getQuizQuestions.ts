import { gql } from "@apollo/client";

export const GET_QUIZ_QUESTIONS = gql`
  query GetQuizQuestionsInProfileQuiz($profileQuizId: ID!) {
    getQuizQuestionsInProfileQuiz(profileQuizId: $profileQuizId) {
      id
      quiz_id
      question_text
      description
      question_type
      options
      order
      is_required
      validation_rule
      created_at
      updated_at
    }
  }
`;
