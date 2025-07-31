import { gql } from "@apollo/client";

export const GET_CHAT_MESSAGES_QUERY = gql`
  query GetChatMessagesByRoomId($roomId: String!) {
    getChatMessagesByRoomId(roomId: $roomId) {
      activeCessationPlan {
        id
        template_id
        is_custom
        start_date
        target_date
        status
        template {
          name
          average_rating
          description
          difficulty_level
          estimated_duration_days
          success_rate
          total_reviews
        }
      }
      messages {
        content
        created_at
        id
        is_read
        sender {
          id
          name
        }
        session_id
        updated_at
      }
      chatRoom {
        id
        creator {
          name
        }
      }
    }
  }
`;
