
"use client";

import React, { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createPortal } from "react-dom";
import ChatComponent from "./Chat";
import ChatRoomSelector from "./ChatRoomSelector";
import { ChatService } from "@/services/chatService";
import { IChatRoom, ChatMessage } from "@/types/api/chat";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";

interface ChatBubbleProps { }

const ChatBubble: React.FC<ChatBubbleProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const searchParams = useSearchParams();
  const planIdFromUrl = searchParams.get("planId");
  const chatRoomIdFromUrl = searchParams.get("chatRoomId");

  const [actualChatRoomId, setActualChatRoomId] = useState<string | null>(null);
  const [loadingChatRoom, setLoadingChatRoom] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [mounted, setMounted] = useState(false);
  const { user } = useAuth();
  const [coachNameForHeader, setCoachNameForHeader] = useState<string | null>(
    null
  );
  const [coachId, setCoachId] = useState<string | null>(null);
  const [allRooms, setAllRooms] = useState<IChatRoom[]>([]);
  const [showRoomSelector, setShowRoomSelector] = useState(false);
  const [isSwitchingRoom, setIsSwitchingRoom] = useState(false);

  useEffect(() => {
    setMounted(true);

    const loadChatRoomAndMessages = async () => {
      setLoadingChatRoom(true);
      let roomIdToUse: string | null = null;
      let tempCoachName: string | null = null;

      try {
        const rooms: IChatRoom[] = await ChatService.getAllChatRoomsByUser();
        setAllRooms(rooms);

        if (chatRoomIdFromUrl) {
          roomIdToUse = chatRoomIdFromUrl;
          const foundRoom = rooms.find(
            (room) => room.id === chatRoomIdFromUrl
          );
          if (foundRoom) {
            tempCoachName = foundRoom.receiver.name;
            setCoachId(foundRoom.receiver.id);
          }
        } else {
          if (rooms.length > 0) {
            const firstRoom = rooms[0];
            roomIdToUse = firstRoom.id;
            tempCoachName = firstRoom.receiver.name;
            setCoachId(firstRoom.receiver.id);
          } else {
            setLoadingChatRoom(false);
            return;
          }
        }

        setActualChatRoomId(roomIdToUse);
        setCoachNameForHeader(tempCoachName || "Coach");
        setIsOpen(true);

        const fetchedMessages = await ChatService.getChatMessagesByRoomId(
          roomIdToUse
        );
        const sortedMessages = [...fetchedMessages].sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        setMessages(sortedMessages);

        if (sortedMessages.length === 0 && tempCoachName) {
          const welcomeMessage: ChatMessage = {
            id: "welcome-" + Date.now().toString(),
            content: `Tôi là ${tempCoachName}, cảm ơn bạn đã sử dụng template của tôi, tôi sẽ đồng hành cùng bạn đến cuối chặng đường.`,
            sender: { name: tempCoachName },
            chat_room: { id: roomIdToUse, creator: { name: tempCoachName } },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            is_read: false,
            session_id: "welcome-session-" + Date.now().toString(),
          };
          setMessages((prev) => [...prev, welcomeMessage]);
        }
      } catch (error) {
        toast.error("Không thể tải phòng chat hoặc tin nhắn.");
        setActualChatRoomId(null);
        setMessages([]);
        setCoachNameForHeader(null);
      } finally {
        setLoadingChatRoom(false);
      }
    };

    if (mounted && !isSwitchingRoom) {
      loadChatRoomAndMessages();
    }
  }, [mounted, chatRoomIdFromUrl]);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    if (isOpen && actualChatRoomId) {
      unsubscribe = ChatService.subscribeToChatMessages(
        actualChatRoomId,
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
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [isOpen, actualChatRoomId]);

  if (!mounted || loadingChatRoom) {
    return null;
  }

  if (!actualChatRoomId) {
    return null;
  }

  return createPortal(
    <div className="fixed bottom-6 right-6 z-[100]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-full p-4 shadow-xl hover:from-blue-600 hover:to-blue-800 transition-all duration-300 flex items-center justify-center relative transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-300 active:scale-95"
        aria-label={isOpen ? "Đóng chat" : "Mở chat"}
      >
        <MessageCircle size={28} className="drop-shadow-sm" />
      </button>
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[380px] h-[550px] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-fade-in-up">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 flex justify-between items-center rounded-t-2xl shadow-md">
            <div className="flex items-center gap-4">
              <ChatRoomSelector
                rooms={allRooms}
                selectedRoomId={actualChatRoomId}
                onRoomSelect={async (roomId) => {
                  try {
                    setIsSwitchingRoom(true);
                    setLoadingChatRoom(true);
                    const selectedRoom = allRooms.find(room => room.id === roomId);

                    if (selectedRoom) {
                      setActualChatRoomId(roomId);
                      setCoachNameForHeader(selectedRoom.receiver.name);
                      setCoachId(selectedRoom.receiver.id);

                      const fetchedMessages = await ChatService.getChatMessagesByRoomId(roomId);

                      const sortedMessages = [...fetchedMessages].sort(
                        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
                      );
                      setMessages(sortedMessages);

                      if (sortedMessages.length === 0) {
                        const welcomeMessage: ChatMessage = {
                          id: "welcome-" + Date.now().toString(),
                          content: `Tôi là ${selectedRoom.receiver.name}, cảm ơn bạn đã sử dụng template của tôi, tôi sẽ đồng hành cùng bạn đến cuối chặng đường.`,
                          sender: { name: selectedRoom.receiver.name },
                          chat_room: { id: roomId, creator: { name: selectedRoom.receiver.name } },
                          created_at: new Date().toISOString(),
                          updated_at: new Date().toISOString(),
                          is_read: false,
                          session_id: "welcome-session-" + Date.now().toString(),
                        };
                        setMessages([welcomeMessage]);
                      }
                    }
                  } catch (error) {
                    console.error("Error switching room:", error);
                    toast.error("Không thể tải tin nhắn.");
                  } finally {
                    setLoadingChatRoom(false);
                    setIsSwitchingRoom(false);
                  }
                }}
                isOpen={showRoomSelector}
                onToggle={() => setShowRoomSelector(!showRoomSelector)}
              />
              <Link
                href={coachId ? `/profile/${coachId}` : "#"}
                className="text-white hover:text-blue-100 font-medium hover:underline"
              >
                <p className="text-nowrap text-sm">
                  {coachNameForHeader || "Coach"}
                </p>
              </Link>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-blue-100 cursor-pointer p-1 rounded-full hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
              aria-label="Đóng chat"
            >
              <svg
                xmlns="http:
                //www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-hidden">
            <ChatComponent
              planId={planIdFromUrl || "default-plan-id"}
              chatRoomId={actualChatRoomId}
              currentUserName={user?.name || "Người dùng"}
              messages={messages}
              setMessages={setMessages}
              coachName={coachNameForHeader || "Coach"}
            />
          </div>
        </div>
      )}
    </div>,
    document.body
  );
};

export default ChatBubble;
