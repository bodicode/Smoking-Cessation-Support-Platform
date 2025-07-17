import { gql } from "@apollo/client";

export const CREATE_QUIZ_ANSWER = gql`
  mutation CreateQuizAnswer($input: CreateQuizAnswerInput!) {
    createQuizAnswer(input: $input) {
      id
      user_id
      quiz_id
      question_id
      answer_value
      created_at
      updated_at
    }
  }
`;
