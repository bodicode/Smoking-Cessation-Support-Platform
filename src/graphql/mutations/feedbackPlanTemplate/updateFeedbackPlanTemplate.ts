import { gql } from "@apollo/client";

export const UPDATE_FEEDBACK = gql`
  mutation updateFeedback($updateFeedbackId: ID!, $updateFeedbackInput2: UpdateFeedbackInput!) {
    updateFeedback(id: $updateFeedbackId, input: $updateFeedbackInput2) {
      id
      rating
      content
      user {
        id
        name
      }
    }
  }
`;