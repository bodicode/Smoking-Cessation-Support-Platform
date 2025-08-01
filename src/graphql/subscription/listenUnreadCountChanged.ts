import { gql } from "@apollo/client";

export const UNREAD_COUNT_CHANGED_SUBSCRIPTION = gql`
  subscription UnreadCountChanged {
    unreadCountChanged {
      hasUnread
      roomId
      totalCount
    }
  }
`;
