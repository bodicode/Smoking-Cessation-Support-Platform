import { gql } from "@apollo/client";

export const UPDATE_BADGE = gql`
  mutation updateBadge($updateBadgeId: ID!, $updateBadgeInput2: UpdateBadgeInput!) {
    updateBadge(id: $updateBadgeId, input: $updateBadgeInput2) {
      id
      name
      requirements
      sort_order
    }
  }
`;