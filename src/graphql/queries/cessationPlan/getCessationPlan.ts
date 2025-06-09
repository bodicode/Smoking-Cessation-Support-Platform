import { gql } from "@apollo/client";

export const GET_CESSATION_PLANS = gql`
  query getCessationPlans {
    cessationPlans(
      params: {
        page: 1
        limit: 10
        search: ""
        orderBy: "created_at"
        sortOrder: "desc"
      }
    ) {
      data {
        id
        reason
        status
        start_date
        target_date
        days_since_start
        completion_percentage
        is_custom
        user {
          id
          name
        }
        stages {
          id
          description
          stage_order
          actions
          title
        }
      }
    }
  }
`;
