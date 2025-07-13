import client from "@/apollo/apolloClient";
import { CREATE_CHAT_ROOM_MUTATION } from "@/graphql/mutations/chat/createChatRoom";
import { SEND_MESSAGE_MUTATION } from "@/graphql/mutations/chat/sendMessage";
import { GET_CHAT_MESSAGES_QUERY } from "@/graphql/queries/chat/Chat";
import { GET_ALL_CHAT_ROOMS_BY_USER_QUERY } from "@/graphql/queries/chat/getRoom";
import { CHAT_ROOM_MESSAGES_SUBSCRIPTION } from "@/graphql/subscription/listenChatMessage";
import {
  ChatMessage,
  CreateChatMessageInput,
  GetChatMessagesResponse,
  IChatRoom,
  ICreateChatRoomInput,
  SendMessageResponse,
} from "@/types/api/chat";
import toast from "react-hot-toast";

export const ChatService = {
  createChatRoom: async (input: ICreateChatRoomInput): Promise<IChatRoom> => {
    try {
      const { data, errors } = await client.mutate({
        mutation: CREATE_CHAT_ROOM_MUTATION,
        variables: { input },
      });

      if (errors) {
        console.error("GraphQL Errors (createChatRoom):", errors);
        const errorMessage = errors.map((err) => err.message).join(", ");
        throw new Error(
          `Failed to create chat room due to GraphQL errors: ${errorMessage}`
        );
      }

      if (!data || !data.createChatRoom) {
        throw new Error("No data returned when creating chat room.");
      }

      return data.createChatRoom as IChatRoom;
    } catch (error) {
      console.error("Error creating chat room:", error);
      throw error;
    }
  },

  getChatMessagesByRoomId: async (roomId: string): Promise<ChatMessage[]> => {
    try {
      const { data, errors } = await client.query<GetChatMessagesResponse>({
        query: GET_CHAT_MESSAGES_QUERY,
        variables: { roomId },
        fetchPolicy: "network-only",
      });

      if (errors) {
        console.error("GraphQL Errors (getChatMessagesByRoomId):", errors);
        const errorMessage = errors.map((err) => err.message).join(", ");
        throw new Error(
          `Failed to get chat messages due to GraphQL errors: ${errorMessage}`
        );
      }

      if (!data || !data.getChatMessagesByRoomId) {
        return [];
      }

      return data.getChatMessagesByRoomId;
    } catch (error) {
      console.error("Error getting chat messages:", error);
      throw new Error("Không thể lấy tin nhắn chat.");
    }
  },

  getAllChatRoomsByUser: async (): Promise<IChatRoom[]> => {
    try {
      const { data, errors } = await client.query<{
        getAllChatRoomsByUser: IChatRoom[];
      }>({
        query: GET_ALL_CHAT_ROOMS_BY_USER_QUERY,
        fetchPolicy: "network-only",
      });

      if (errors) {
        console.error("GraphQL Errors (getAllChatRoomsByUser):", errors);
        const errorMessage = errors.map((err) => err.message).join(", ");
        throw new Error(
          `Failed to get all chat rooms due to GraphQL errors: ${errorMessage}`
        );
      }

      if (!data || !data.getAllChatRoomsByUser) {
        return []; // Trả về mảng rỗng nếu không có dữ liệu
      }

      return data.getAllChatRoomsByUser;
    } catch (error) {
      console.error("Error getting all chat rooms:", error);
      throw new Error("Không thể lấy danh sách phòng chat.");
    }
  },

  subscribeToChatMessages: (
    roomId: string,
    onMessageReceived: (message: ChatMessage) => void
  ): (() => void) => {
    const observable = client.subscribe({
      query: CHAT_ROOM_MESSAGES_SUBSCRIPTION,
      variables: { roomId },
    });

    const subscription = observable.subscribe({
      next: ({ data }) => {
        if (data && data.chatRoomMessages) {
          onMessageReceived(data.chatRoomMessages);
        }
      },
      error: (err) => {
        console.error("Subscription error:", err);
        toast.error("Lỗi kết nối chat thời gian thực.");
      },
      complete: () => {},
    });

    return () => subscription.unsubscribe();
  },

  sendMessage: async (input: CreateChatMessageInput): Promise<ChatMessage> => {
    try {
      const { data, errors } = await client.mutate<SendMessageResponse>({
        mutation: SEND_MESSAGE_MUTATION,
        variables: { input },
      });

      if (errors) {
        console.error("GraphQL Errors (sendMessage):", errors);
        const errorMessage = errors.map((err) => err.message).join(", ");
        throw new Error(
          `Failed to send message due to GraphQL errors: ${errorMessage}`
        );
      }

      if (!data || !data.sendMessage) {
        throw new Error("No data returned when sending message.");
      }

      return data.sendMessage;
    } catch (error) {
      console.error("Error sending message:", error);
      throw new Error("Không thể gửi tin nhắn.");
    }
  },
};
