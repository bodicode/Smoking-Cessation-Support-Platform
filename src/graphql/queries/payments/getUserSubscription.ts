import { gql } from "@apollo/client";

export const GET_USER_SUBSCRIPTION = gql`
  query GetUserSubscription($user_id: String!) {
    getUserSubscription(user_id: $user_id) {
      id
      user_id
      package_id
      status
      start_date
      end_date
      created_at
      updated_at
    }
  }
`;