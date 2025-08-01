import client from "@/apollo/apolloClient";
import { CREATE_CHAT_ROOM_MUTATION } from "@/graphql/mutations/chat/createChatRoom";
import { SEND_MESSAGE_MUTATION } from "@/graphql/mutations/chat/sendMessage";
import { GET_CHAT_MESSAGES_QUERY } from "@/graphql/queries/chat/Chat";
import { GET_ALL_CHAT_ROOMS_BY_USER_QUERY } from "@/graphql/queries/chat/getRoom";
import { CHAT_ROOM_MESSAGES_SUBSCRIPTION } from "@/graphql/subscription/listenChatMessage";
import { UNREAD_COUNT_CHANGED_SUBSCRIPTION } from "@/graphql/subscription/listenUnreadCountChanged";
import {
  ChatMessage,
  CreateChatMessageInput,
  GetChatMessagesResponse,
  IChatRoom,
  ICreateChatRoomInput,
  SendMessageResponse,
} from "@/types/api/chat";
import toast from "react-hot-toast";

// Ensure IChatRoom type includes hasUnread
// If not, extend it here for local type safety:
export type IChatRoomWithUnread = IChatRoom & { hasUnread: boolean };

export const ChatService = {
  clearChatCache: async () => {
    try {
      // For now, just return without clearing cache to avoid errors
      // The fetchPolicy: "network-only" in queries should handle cache issues
      return;
    } catch (error) {
      console.error("Error clearing chat cache:", error);
    }
  },

  createChatRoom: async (input: ICreateChatRoomInput): Promise<IChatRoom> => {
    try {
      const { data, errors } = await client.mutate({
        mutation: CREATE_CHAT_ROOM_MUTATION,
        variables: { input },
      });

      if (errors) {
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
      throw error;
    }
  },

  getChatMessagesByRoomId: async (
    roomId: string
  ): Promise<{
    messages: ChatMessage[];
    activeCessationPlan?: any;
    chatRoom?: any;
  }> => {
    try {
      const { data, errors } = await client.query<any>({
        query: GET_CHAT_MESSAGES_QUERY,
        variables: { roomId },
        fetchPolicy: "network-only",
      });

      if (errors) {
        const errorMessage = errors.map((err) => err.message).join(", ");
        throw new Error(
          `Failed to get chat messages due to GraphQL errors: ${errorMessage}`
        );
      }

      if (!data || !data.getChatMessagesByRoomId) {
        return { messages: [] };
      }

      // Return the full object for destructuring in the page
      return data.getChatMessagesByRoomId;
    } catch (error) {
      throw new Error("Không thể lấy tin nhắn chat.");
    }
  },

  getAllChatRoomsByUser: async (): Promise<IChatRoomWithUnread[]> => {
    try {
      const { data, errors } = await client.query<{
        getAllChatRoomsByUser: IChatRoomWithUnread[];
      }>({
        query: GET_ALL_CHAT_ROOMS_BY_USER_QUERY,
        fetchPolicy: "network-only",
      });

      if (errors) {
        const errorMessage = errors.map((err) => err.message).join(", ");
        throw new Error(
          `Failed to get all chat rooms due to GraphQL errors: ${errorMessage}`
        );
      }

      if (!data || !data.getAllChatRoomsByUser) {
        return [];
      }

      return data.getAllChatRoomsByUser;
    } catch (error) {
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
        toast.error("Lỗi kết nối chat thời gian thực.");
      },
      complete: () => {},
    });

    return () => subscription.unsubscribe();
  },

  subscribeToUnreadCountChanged: (
    onUnreadCountChanged: (payload: {
      hasUnread: boolean;
      roomId: string;
      totalCount: number;
    }) => void
  ): (() => void) => {
    const observable = client.subscribe({
      query: UNREAD_COUNT_CHANGED_SUBSCRIPTION,
    });

    const subscription = observable.subscribe({
      next: ({ data }) => {
        if (data && data.unreadCountChanged) {
          console.log("unreadCountChanged:", data.unreadCountChanged); // log event
          onUnreadCountChanged(data.unreadCountChanged);
        }
      },
      error: (err) => {
        toast.error("Lỗi kết nối thông báo tin nhắn chưa đọc.");
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

  // Add this method to mark a room as read (set unread count to 0)
  markRoomAsRead: (roomId: string) => {
    // If you have an API/mutation to mark as read, call it here.
    // Otherwise, simulate the unread count changed event locally:
    // This will only affect the local state, not the backend.
    setTimeout(() => {
      // Simulate unreadCountChanged event with totalCount: 0
      window.dispatchEvent(
        new CustomEvent("unreadCountChanged", {
          detail: { hasUnread: false, roomId, totalCount: 0 },
        })
      );
    }, 0);
  },
};

// Listen for the simulated unreadCountChanged event and call subscribers
const originalSubscribe = ChatService.subscribeToUnreadCountChanged;
ChatService.subscribeToUnreadCountChanged = (onUnreadCountChanged) => {
  const unsubscribe = originalSubscribe(onUnreadCountChanged);
  const handler = (e: any) => {
    if (e.detail) onUnreadCountChanged(e.detail);
  };
  window.addEventListener("unreadCountChanged", handler);
  return () => {
    unsubscribe();
    window.removeEventListener("unreadCountChanged", handler);
  };
};