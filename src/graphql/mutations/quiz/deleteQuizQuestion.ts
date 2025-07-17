import { gql } from "@apollo/client";

export const DELETE_QUIZ_QUESTION = gql`
  mutation DeleteQuizQuestion($deleteQuizQuestionId: ID!) {
    deleteQuizQuestion(id: $deleteQuizQuestionId) {
      message
      success
    }
  }
`; 