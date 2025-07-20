import { gql } from "@apollo/client";

export const FIND_ONE_USER = gql`
  query FindOneUser {
    findOneUser {
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
        allergies
        brand_preference
        cigarettes_per_day
        daily_routine
        health_conditions
        medications
        nicotine_level
        preferred_support
        previous_attempts
        price_per_pack
      }
    }
  }
`;
