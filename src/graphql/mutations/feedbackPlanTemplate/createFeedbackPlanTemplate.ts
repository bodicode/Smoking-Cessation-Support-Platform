import { gql } from "@apollo/client";

export const CREATE_FEEDBACK = gql`
  mutation createFeedback($createFeedbackInput2: CreateFeedbackInput!) {
    createFeedback(input: $createFeedbackInput2) {
      id
      rating
      content
      template {
        id
        name
      }
      user {
        id
        name
        avatar_url
      }
    }
  }
`;
