"use client";

import React, {
  useState,
  useEffect,
  useRef,
  Dispatch,
  SetStateAction,
} from "react";
import { SendHorizonal } from "lucide-react";
import Loading from "@/components/common/Loading";
import toast from "react-hot-toast";
import { ChatService } from "@/services/chatService";
import { ChatMessage } from "@/types/api/chat";
import { useAuth } from "@/hooks/useAuth";

interface ChatComponentProps {
  planId: string;
  chatRoomId: string;
  currentUserName: string;
  messages: ChatMessage[];
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>;
  coachName: string;
}

export default function ChatComponent({
  planId,
  chatRoomId,
  currentUserName,
  messages,
  setMessages,
  coachName,
}: ChatComponentProps) {
  const [newMessage, setNewMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sendingMessage) return;
    if (!user?.id) {
      toast.error("Bạn cần đăng nhập để gửi tin nhắn.");
      return;
    }

    setSendingMessage(true);

    const messageContent = newMessage;
    setNewMessage("");

    try {
      await ChatService.sendMessage({
        chat_room_id: chatRoomId,
        content: messageContent,
      });
    } catch (error) {
      toast.error("Không thể gửi tin nhắn. Vui lòng thử lại.");
    } finally {
      setSendingMessage(false);
    }
  };

  return (
    <div
      className="p-6 bg-white rounded-2xl shadow-xl border border-gray-100"
      style={{ boxShadow: "0 2px 32px 0 #1E90FF10" }}
    >
      <h3 className="font-bold text-xl text-sky-700 mb-4 pt-4">{coachName}</h3>
      <div className="h-96 overflow-y-auto border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50 flex flex-col pt-8">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 italic mt-auto mb-auto">
            Chưa có tin nhắn nào. Bắt đầu cuộc trò chuyện của bạn!
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-3 p-3 rounded-lg max-w-[80%] ${
                msg.sender.name === currentUserName
                  ? "bg-sky-500 text-white self-end rounded-br-none"
                  : "bg-gray-200 text-gray-800 self-start rounded-bl-none"
              }`}
            >
              <p className="text-base">{msg.content}</p>
              <span className="block text-xs mt-1 opacity-75">
                {new Date(msg.created_at).toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="flex gap-2 items-end">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Nhập tin nhắn của bạn..."
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-base focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
          disabled={sendingMessage}
        />
        <button
          type="submit"
          className="cursor-pointer bg-sky-600 hover:bg-sky-700 text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed flex-shrink-0"
          disabled={sendingMessage}
        >
          {sendingMessage ? (
            <Loading color="#fff" size={18} />
          ) : (
            <SendHorizonal size={18} />
          )}
        </button>
      </form>
    </div>
  );
}
