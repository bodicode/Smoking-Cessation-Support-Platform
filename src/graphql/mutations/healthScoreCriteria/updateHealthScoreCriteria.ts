import { gql } from "@apollo/client";

export const UPDATE_HEALTH_SCORE_CRITERIA_MUTATION = gql`
  mutation updateHealthScoreCriteria(
    $updateHealthScoreCriteriaInput2: UpdateHealthScoreCriteriaInput!
  ) {
    updateHealthScoreCriteria(input: $updateHealthScoreCriteriaInput2) {
      id
      title
      description
    }
  }
`;
