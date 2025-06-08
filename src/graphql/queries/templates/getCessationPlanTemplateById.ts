import { gql } from "@apollo/client";

export const GET_PLAN_TEMPLATE_BY_ID = gql`
  query getPlanTemplateById($cessationPlanTemplateId: String!) {
    cessationPlanTemplate(id: $cessationPlanTemplateId) {
      name
      description
      difficulty_level
      estimated_duration_days
    }
  }
`;
