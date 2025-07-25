import { gql } from "@apollo/client";

export const GET_USER_SUBSCRIPTION = gql`
  query GetUserSubscription {
    getUserSubscription {
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

export const GET_CURRENT_USER_SUBSCRIPTION = gql`
  query GetUserSubscription {
    getUserSubscription {
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