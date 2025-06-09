import { gql } from "@apollo/client";

export const CREATE_CESSATION_PLAN = gql`
  mutation createCessationPlan($createCessationPlanInput: CreateCessationPlanInput!) {
    createCessationPlan(input: $createCessationPlanInput) {
      id
      start_date
      days_to_target
      completion_percentage
    }
  }
`;