import { gql } from "@apollo/client";

export const SEND_MESSAGE_MUTATION = gql`
  mutation SendMessage($input: CreateChatMessageInput!) {
    sendMessage(input: $input) {
      chat_room {
        id
      }
      content
      id
      is_read
      sender {
        name
        id # Thêm id của sender nếu có thể trả về từ API
      }
      session_id
      updated_at
      created_at # Thêm created_at để khớp với ChatMessage type
    }
  }
`;
