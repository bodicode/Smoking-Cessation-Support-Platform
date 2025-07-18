import client from "@/apollo/apolloClient";
import { MARK_MULTIPLE_NOTIFICATIONS_AS_READ } from "@/graphql/mutations/notification/markNoticationAsRead";
import { GET_USER_NOTIFICATIONS } from "@/graphql/queries/notification/getNotification";
import {
  NotificationFiltersInput,
  UserNotificationsResponse,
} from "@/types/api/notification";
import { PaginationParamsInput } from "@/types/api/post";

export class NotificationService {
  async getUserNotifications(
    params: PaginationParamsInput,
    filters?: NotificationFiltersInput
  ): Promise<UserNotificationsResponse> {
    try {
      const response = await client.query<UserNotificationsResponse>({
        query: GET_USER_NOTIFICATIONS,
        variables: { params, filters },
      });

      if (response.error) {
        throw new Error(`GraphQL error: ${response.error.message}`);
      }

      if (!response.data?.userNotifications) {
        throw new Error("No notification data returned");
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async markMultipleNotificationsAsRead(ids: string[]): Promise<void> {
    try {
      const response = await client.mutate({
        mutation: MARK_MULTIPLE_NOTIFICATIONS_AS_READ,
        variables: { ids },
      });

      if (response.errors) {
        throw new Error(
          `GraphQL error: ${response.errors.map((e) => e.message).join(", ")}`
        );
      }

      if (!response.data?.markMultipleNotificationsAsRead) {
        throw new Error("Failed to mark notifications as read");
      }
    } catch (error) {
      console.error("Error marking notifications as read:", error);
      throw error;
    }
  }
}
