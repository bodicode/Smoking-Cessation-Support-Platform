import { gql } from "@apollo/client";

export const GET_PLAN_TEMPLATES = gql`
  query getPlanTemplates {
    cessationPlanTemplates(params: {
      page: 1
      limit: 5
      search: ""
      orderBy: "created_at"
      sortOrder: "asc"
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
    }
  }
`;