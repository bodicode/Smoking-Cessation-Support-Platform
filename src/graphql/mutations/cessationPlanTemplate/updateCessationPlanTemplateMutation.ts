import { gql } from "@apollo/client";

export const UPDATE_CESSATION_PLAN_TEMPLATE = gql`
  mutation updatePlanTemplate($updateCessationPlanTemplateInput: UpdateCessationPlanTemplateInput!) {
    updateCessationPlanTemplate(input: $updateCessationPlanTemplateInput) {
      id
      name
      description
      difficulty_level
      estimated_duration_days
      updated_at
    }
  }
`;
