export interface PaginationParamsInput {
  page: number;
  limit: number;
}

export interface NotificationFiltersInput {
  notificationType?: string;
  channel?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

export interface Notification {
  id: string;
  title: string;
  content: string;
  notification_type: string;
  channel: string;
  status: string;
  created_at: string;
}

export interface UserNotificationsResponse {
  userNotifications: {
    data: Notification[];
    total: number;
    page: number;
    limit: number;
  };
}
