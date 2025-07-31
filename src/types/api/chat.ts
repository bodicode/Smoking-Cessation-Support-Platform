export interface IChatRoomUser {
  id: string;
  name: string;
}

export interface IChatRoom {
  id: string;
  creator: IChatRoomUser;
  receiver: IChatRoomUser;
  created_at: string;
  is_deleted: boolean;
  updated_at: string;
  hasUnread?: boolean;
}

export interface ICreateChatRoomInput {
  receiver_id: string;
}

export interface ChatMessage {
  id: string;
  chat_room: {
    id: string;
    creator: {
      name: string;
    };
  };
  is_read: boolean;
  content: string;
  sender: {
    name: string;
  };
  session_id: string;
  updated_at: string;
  created_at: string;
}

export interface GetChatMessagesResponse {
  getChatMessagesByRoomId: ChatMessage[];
}

export interface CreateChatMessageInput {
  chat_room_id: string;
  content: string;
}

export interface SendMessageResponse {
  sendMessage: ChatMessage;
}
