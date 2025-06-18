import { gql } from "@apollo/client";

export const GET_FEEDBACKS = gql`
  query getFeedbacks($filters: FeedbackFiltersInput) {
    feedbacks(filters: $filters) {
      data {
        id
        rating
        content
        is_anonymous
        created_at
        updated_at
        user {
          id
          name
          role
        }
        template {
          id
          name
          coach {
            id
            name
          }
        }
      }
      total
    }
  }
`;