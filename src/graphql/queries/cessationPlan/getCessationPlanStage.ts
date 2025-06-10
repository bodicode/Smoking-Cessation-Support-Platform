import { gql } from "@apollo/client";

export const GET_PLAN_STAGES_BY_PLAN = gql`
  query getPlanStagesByPlan($planId: String!) {
    planStagesByPlan(planId: $planId) {
      id
      title
      description
      recommended_actions
      duration_days
      stage_order
      is_completed
      created_at
    }
  }
`;