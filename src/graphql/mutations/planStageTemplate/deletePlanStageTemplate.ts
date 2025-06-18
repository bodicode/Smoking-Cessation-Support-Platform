import { gql } from "@apollo/client";

export const DELETE_PLAN_STAGE_TEMPLATE = gql`
  mutation deleteStagePlanTemplate($removePlanStageTemplateId: String!) {
    removePlanStageTemplate(id: $removePlanStageTemplateId) {
      id
      is_active
    }
  }
`;