import { gql } from "@apollo/client";

export const REMOVE_CESSATION_PLAN_TEMPLATE = gql`
  mutation removeTemplate($removeCessationPlanTemplateId: String!) {
    removeCessationPlanTemplate(id: $removeCessationPlanTemplateId) {
      description
      id
      difficulty_level
      is_active
    }
  }
`;
