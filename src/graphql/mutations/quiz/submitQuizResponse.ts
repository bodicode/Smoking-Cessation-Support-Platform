import { gql } from "@apollo/client";

export const CREATE_QUIZ_RESPONSE = gql`
  mutation CreateQuizResponse($input: CreateQuizResponseInput!) {
    createQuizResponse(input: $input) {
      id
      created_at
      updated_at
    }
  }
`;