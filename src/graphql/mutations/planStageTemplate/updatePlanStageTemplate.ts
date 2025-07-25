import { gql } from "@apollo/client";

export const UPDATE_PLAN_STAGE_TEMPLATE = gql`
  mutation updateStagePlanTemplate($updatePlanStageTemplateInput: UpdatePlanStageTemplateInput!) {
    updatePlanStageTemplate(input: $updatePlanStageTemplateInput) {
      id
      stage_order
      title
      description
      recommended_actions
      max_cigarettes_per_day
      duration_days
    }
  }
`;
