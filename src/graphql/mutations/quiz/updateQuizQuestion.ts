import { gql } from "@apollo/client";

export const UPDATE_QUIZ_QUESTION = gql`
  mutation UpdateQuizQuestion($updateQuizQuestionInput2: UpdateQuizQuestionInput!) {
    updateQuizQuestion(input: $updateQuizQuestionInput2) {
      data {
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
      message
    }
  }
`; 