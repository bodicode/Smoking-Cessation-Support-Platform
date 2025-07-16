import { gql } from "@apollo/client";

export const UPDATE_USER_BY_ADMIN = gql`
  mutation updateUserByAdmin($updateUserInput: UpdateUserInput!) {
    updateUserByAdmin(updateUserInput: $updateUserInput) {
      id
      avatar_url
      user_name
      created_at
      name
      role
      status
      coach_profile {
        id
        experience_years
        user_id
      }
      member_profile {
        id
        user_id
        sessions_per_day
        recorded_at
        price_per_pack
      }
    }
  }
`; 