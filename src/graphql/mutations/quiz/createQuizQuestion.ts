import { gql } from "@apollo/client";

export const CREATE_QUIZ_QUESTION = gql`
  mutation CreateQuizQuestion($input: CreateQuizQuestionInput!) {
    createQuizQuestion(input: $input) {
      id
      description
      options
      order
      question_text
      question_type
      is_required
      quiz_id
      validation_rule
      updated_at
      created_at
    }
  }
`; 