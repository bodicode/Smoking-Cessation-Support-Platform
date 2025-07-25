import { gql } from "@apollo/client";

export const GET_PLAN_STAGE_TEMPLATES_BY_TEMPLATE = gql`
  query getPlanStageTemplatesByTemplate($templateId: String!) {
    planStageTemplates(
      params: {
        page: 1
        limit: 10
        search: ""
        orderBy: "stage_order"
        sortOrder: "asc"
      }
      templateId: $templateId
    ) {
      data {
        id
        stage_order
        title
        description
        duration_days
        recommended_actions
        created_at
        max_cigarettes_per_day
      }
      total
      page
      limit
      hasNext
    }
  }
`;