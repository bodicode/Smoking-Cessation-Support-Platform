import { gql } from "@apollo/client";

export const GET_USER_PROFILE = gql`
  query FindOneUser($id: String!) {
    findOneUser(id: $id) {
      id
      user_name
      name
      avatar_url
      role
      status
      created_at
      updated_at
      member_profile {
        cigarettes_per_day
        sessions_per_day
        price_per_pack
        recorded_at
      }
      coach_profile {
        experience_years
        bio
      }
    }
  }
`;

export const GET_CURRENT_USER = gql`
  query FindOneUser {
    findOneUser {
      id
      user_name
      name
      avatar_url
      role
      status
      created_at
      updated_at
      member_profile {
        cigarettes_per_day
        sessions_per_day
        price_per_pack
        recorded_at
      }
      coach_profile {
        experience_years
        bio
      }
    }
  }
`;
