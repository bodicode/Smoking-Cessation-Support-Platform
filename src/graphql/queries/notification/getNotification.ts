import { gql } from '@apollo/client';

export const GET_USER_NOTIFICATIONS = gql`
  query GetUserNotifications($params: PaginationParamsInput!, $filters: NotificationFiltersInput) {
    userNotifications(params: $params, filters: $filters) {
      data {
        id
        title
        content
        notification_type
        channel
        status
        created_at
      }
      total
      page
      limit
    }
  }
`;