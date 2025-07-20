import { gql } from "@apollo/client";

export const GET_TEMPLATE_USAGE_STATS = gql`
  query GetTemplateUsageStatsWithFilters(
    $templateId: String!,
    $params: PaginationParamsInput,
    $filters: TemplateUsageFiltersInput
  ) {
    templateUsageStats(
      templateId: $templateId,
      params: $params,
      filters: $filters
    ) {
      template_id
      template_name
      total_users
      stats_by_status {
        status
        count
      }
      users {
        data {
          id
          user_id
          status
          start_date
          target_date
          completion_percentage
          days_since_start
          days_to_target
          is_overdue
          user {
            id
            name
            user_name
            avatar_url
          }
        }
        total
        page
        limit
        hasNext
      }
    }
  }
`; 