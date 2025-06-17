import { gql } from "@apollo/client";

export const GET_BADGE_TYPES = gql`
  query getBadgeTypes {
    badgeTypes(params: {}) {
      data {
        id
        name
      }
    }
  }
`;