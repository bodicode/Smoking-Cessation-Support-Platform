import { gql } from "@apollo/client";

export const CREATE_BADGE = gql`
  mutation createBadge($createBadgeInput2: CreateBadgeInput!) {
    createBadge(input: $createBadgeInput2) {
      id
      name
      description
      icon_url
      badge_type {
        id
        name
      }
      requirements
      sort_order
    }
  }
`;
