"use client";

import React, { useState, useEffect } from "react";
import { ChatService } from "@/services/chatService";
import { ChatMessage, IChatRoom } from "@/types/api/chat";
import { useAuth } from "@/hooks/useAuth";
import ChatComponent from "@/components/myPlan/Chat";
import Loading from "@/components/common/Loading";
import toast from "react-hot-toast";
import { MessageSquare, UserCircle } from "lucide-react";

export default function CoachChatPage() {
  const { user } = useAuth();
  const [chatRooms, setChatRooms] = useState<IChatRoom[]>([]);
  const [selectedChatRoom, setSelectedChatRoom] = useState<IChatRoom | null>(
    null
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeCessationPlan, setActiveCessationPlan] = useState<any>(null);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);

  useEffect(() => {
    const fetchChatRooms = async () => {
      if (!user?.id) {
        setLoadingRooms(false);
        toast.error("Vui lòng đăng nhập để xem các phòng chat.");
        return;
      }
      setLoadingRooms(true);
      try {
        const rooms = await ChatService.getAllChatRoomsByUser();
        setChatRooms(rooms);

        // if (rooms.length > 0) {
        //   setSelectedChatRoom(rooms[0]);
        // }
      } catch (error) {
        toast.error("Không thể tải danh sách phòng chat.");
      } finally {
        setLoadingRooms(false);
      }
    };

    if (user?.id) {
      fetchChatRooms();
    }
  }, [user?.id]);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const fetchMessages = async () => {
      if (!selectedChatRoom?.id) {
        setMessages([]);
        setActiveCessationPlan(null);
        return;
      }
      setLoadingMessages(true);
      try {
        const data = await ChatService.getChatMessagesByRoomId(
          selectedChatRoom.id
        );
        // If ChatService.getChatMessagesByRoomId returns only messages, fetch plan from data.getChatMessagesByRoomId
        if (Array.isArray(data)) {
          setMessages(data);
          setActiveCessationPlan(null);
        } else {
          setMessages(data.messages || []);
          setActiveCessationPlan(data.activeCessationPlan || null);
        }

        unsubscribe = ChatService.subscribeToChatMessages(
          selectedChatRoom.id,
          (newMessage) => {
            setMessages((prevMessages) => {
              if (!prevMessages.some((msg) => msg.id === newMessage.id)) {
                const updatedMessages = [...prevMessages, newMessage];
                return updatedMessages.sort(
                  (a, b) =>
                    new Date(a.created_at).getTime() -
                    new Date(b.created_at).getTime()
                );
              }
              return prevMessages;
            });
          }
        );
      } catch (error) {
        toast.error("Không thể tải tin nhắn cho phòng chat này.");
        setMessages([]);
        setActiveCessationPlan(null);
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessages();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [selectedChatRoom]);

  if (loadingRooms) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-80px)] bg-gray-50 rounded-lg shadow-lg overflow-hidden">
      <div className="w-1/3 bg-white border-r border-gray-200 p-4 overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <MessageSquare size={24} /> Đoạn chat
        </h2>
        {chatRooms.length === 0 ? (
          <p className="text-gray-500 italic">Chưa có cuộc trò chuyện nào.</p>
        ) : (
          <ul className="space-y-3">
            {chatRooms.map((room) => (
              <li
                key={room.id}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200
                  ${
                    selectedChatRoom?.id === room.id
                      ? "bg-blue-100 text-blue-800 shadow-sm font-semibold"
                      : `bg-gray-50 hover:bg-gray-100 text-gray-700${
                          room.hasUnread ? " font-semibold" : ""
                        }`
                  }`}
                onClick={() => setSelectedChatRoom(room)}
              >
                <UserCircle size={20} className="text-gray-500" />
                <span>{room.creator.name}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex-1 p-4 flex flex-col h-full">
        {loadingMessages ? (
          <div className="flex items-center justify-center h-full">
            <Loading />
          </div>
        ) : selectedChatRoom ? (
          <ChatComponent
            planId="coach-view"
            chatRoomId={selectedChatRoom.id}
            currentUserName={user?.name || "Coach"}
            messages={messages}
            setMessages={setMessages}
            coachName={selectedChatRoom.creator.name}
            activeCessationPlan={activeCessationPlan}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 italic text-lg">
            Chọn một cuộc trò chuyện để bắt đầu.
          </div>
        )}
      </div>
    </div>
  );
}