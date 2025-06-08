import { gql } from "@apollo/client";

export const GET_PLAN_TEMPLATES = gql`
  query getPlanTemplates($page: Int!, $limit: Int!) {
    cessationPlanTemplates(params: {
      page: $page
      limit: $limit
      search: ""
      orderBy: "created_at"
      sortOrder: "desc"
    }) {
      data {
        id
        name
        estimated_duration_days
        difficulty_level
        description
        total_reviews
        success_rate
        average_rating
        created_at
      }
      total
      hasNext
    }
  }
`;