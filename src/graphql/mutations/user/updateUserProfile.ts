import { gql } from "@apollo/client";

export const UPDATE_USER_PROFILE = gql`
  mutation($updateUserInput: UpdateUserProfileInput!) {
    updateUserProfile(updateUserInput: $updateUserInput) {
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
        id
        user_id
      }
      member_profile {
        id
        user_id
        sessions_per_day
        recorded_at
        price_per_pack
        nicotine_level
      }
    }
  }
`; 