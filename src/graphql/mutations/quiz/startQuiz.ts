import { gql } from "@apollo/client";

export const START_QUIZ = gql`
  mutation StartQuiz($startQuizInput2: StartQuizInput!) {
    startQuiz(input: $startQuizInput2) {
      id
      member_profile_id
      quiz_id
      created_at
      completed_at
      responses {
        answer
        attempt_id
        created_at
        id
        question_id
        updated_at
      }
      started_at
      status
      updated_at
      user_id
    }
  }
`; 