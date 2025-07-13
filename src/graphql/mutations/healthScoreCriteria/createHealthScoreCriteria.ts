import { gql } from "@apollo/client";

export const CREATE_HEALTH_SCORE_CRITERIA_MUTATION = gql`
  mutation createHealthScoreCriteria(
    $createHealthScoreCriteriaInput2: CreateHealthScoreCriteriaInput!
  ) {
    createHealthScoreCriteria(input: $createHealthScoreCriteriaInput2) {
      coach_id
      id
      title
      description
    }
  }
`;
