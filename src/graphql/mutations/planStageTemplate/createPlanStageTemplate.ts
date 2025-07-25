import { gql } from "@apollo/client";

export const CREATE_PLAN_STAGE_TEMPLATE = gql`
  mutation createPlanStageTemplate($createPlanStageTemplateInput: CreatePlanStageTemplateInput!) {
    createPlanStageTemplate(input: $createPlanStageTemplateInput) {
      id
      template_id
      title
      description
      recommended_actions
      duration_days
      stage_order
      max_cigarettes_per_day
    }
  }
`;
