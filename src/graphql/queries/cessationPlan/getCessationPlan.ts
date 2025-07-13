import { gql } from "@apollo/client";

export const GET_CESSATION_PLANS = gql`
  query getCessationPlans($params: PaginationParamsInput, $filters: CessationPlanFiltersInput) {
    cessationPlans(
      params: $params,
      filters: $filters
    ) {
      data {
        id
        template { 
          id
          name
          coach_id
        }
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
          start_date
          end_date
          status
          description
          stage_order
          actions
          title
        }
      }
    }
  }
`;
