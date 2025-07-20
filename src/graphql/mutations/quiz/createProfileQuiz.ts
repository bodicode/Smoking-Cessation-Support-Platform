import { gql } from "@apollo/client";

export const CREATE_PROFILE_QUIZ = gql`
  mutation CreateProfileQuiz($input: CreateProfileQuizInput!) {
    createProfileQuiz(input: $input) {
      id
      description
      title
      is_active
      questions {
        id
        created_at
        description
        is_required
        options
        order
        question_text
        question_type
        quiz_id
        updated_at
        validation_rule
      }
      updated_at
      created_at
    }
  }
`; 