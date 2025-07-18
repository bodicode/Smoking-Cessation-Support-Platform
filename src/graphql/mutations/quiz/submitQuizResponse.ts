import { gql } from "@apollo/client";

export const SUBMIT_QUIZ = gql`
  mutation SubmitQuiz($input: SubmitQuizInput!) {
    submitQuiz(input: $input) {
      attempt_id
      member_profile_updated
      message
      responses {
        answer
        attempt_id
        created_at
        id
        question_id
        updated_at
      }
    }
  }
`;