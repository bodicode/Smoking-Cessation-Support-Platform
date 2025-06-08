import { gql } from '@apollo/client';

export const CREATE_CESSATION_PLAN_TEMPLATE = gql`
  mutation createPlanTemplate($createCessationPlanTemplateInput: CreateCessationPlanTemplateInput!) {
    createCessationPlanTemplate(input: $createCessationPlanTemplateInput) {
      created_at
      name
      id
    }
  }
`;
