import { gql } from "@apollo/client";

export const GET_BADGES = gql`
  query getBadges($filters: BadgeFiltersInput) {
    badges(filters: $filters) {
      data {
        id
        icon_url
        name
        description
        requirements
        sort_order
        badge_type {
          id
          name
        }
      }
      total
      page
      limit
      hasNext
    }
  }
`;
