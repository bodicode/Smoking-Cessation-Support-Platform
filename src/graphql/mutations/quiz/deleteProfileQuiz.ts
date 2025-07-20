import { gql } from "@apollo/client";

export const DELETE_PROFILE_QUIZ = gql`
  mutation DeleteProfileQuiz($deleteProfileQuizId: ID!) {
    deleteProfileQuiz(id: $deleteProfileQuizId) {
      message
      success
    }
  }
`; 