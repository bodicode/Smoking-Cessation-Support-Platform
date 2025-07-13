import { gql } from "@apollo/client";

export const CREATE_CHAT_ROOM_MUTATION = gql`
  mutation CreateChatRoom($input: CreateChatRoomInput!) {
    createChatRoom(input: $input) {
      id
      creator {
        name
      }
      receiver {
        name
      }
      created_at
      is_deleted
      updated_at
    }
  }
`;
