import { gql } from "@apollo/client";

export const GET_ALL_COACHES = gql`
  query FindAllCoaches {
    findAllCoaches {
      id
      name
      role
      status
      user_name
      coach_profile {
        approach_description
        average_rating
        certifications
        created_at
        education
        experience_years
        id
        professional_bio
        specializations
        success_rate
        total_clients
        total_sessions
        updated_at
      }
    }
  }
`;