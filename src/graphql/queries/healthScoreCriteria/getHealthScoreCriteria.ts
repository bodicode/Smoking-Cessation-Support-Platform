import { gql } from "@apollo/client";

export const GET_HEALTH_SCORE_CRITERIA_QUERY = gql`
  query getCriteria($coachId: ID!) {
    healthScoreCriteriaByCoach(coachId: $coachId) {
      id
      coach {
        id
        name
      }
      title
      description
    }
  }
`;
