import { gql } from "@apollo/client";

export const REMOVE_USER_BY_ADMIN = gql`
  mutation removeUserByAdmin($removeUserByAdminId: String!) {
    removeUserByAdmin(id: $removeUserByAdminId) {
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