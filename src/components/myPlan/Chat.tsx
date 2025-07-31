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
import { Calendar, Star, Clock, Award, Target, Shield } from "lucide-react";

interface Template {
  name: string;
  average_rating: number;
  description: string;
  difficulty_level: string;
  estimated_duration_days: number;
  success_rate: number;
  total_reviews: number;
}

interface ActiveCessationPlan {
  id: string;
  template_id: string;
  is_custom: boolean;
  start_date: string;
  target_date: string;
  status: string;
  template: Template;
}

interface ChatComponentProps {
  planId: string;
  chatRoomId: string;
  currentUserName: string;
  messages: ChatMessage[];
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>;
  coachName: string;
  activeCessationPlan?: ActiveCessationPlan | null;
}

export default function ChatComponent({
  planId,
  chatRoomId,
  currentUserName,
  messages,
  setMessages,
  coachName,
  activeCessationPlan,
}: ChatComponentProps) {
  const [newMessage, setNewMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
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

  // Helper for date formatting
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Helper for color classes
  const getDifficultyColor = (level: string) => {
    switch (level) {
      case "EASY":
        return "text-green-700 bg-green-100 border-green-200";
      case "MEDIUM":
        return "text-yellow-800 bg-yellow-100 border-yellow-200";
      case "HARD":
        return "text-red-700 bg-red-100 border-red-200";
      default:
        return "text-gray-700 bg-gray-100 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PLANNING":
        return "text-blue-700 bg-blue-100 border-blue-200";
      case "ACTIVE":
        return "text-green-700 bg-green-100 border-green-200";
      case "PAUSED":
        return "text-yellow-700 bg-yellow-100 border-yellow-200";
      case "COMPLETED":
        return "text-sky-700 bg-sky-100 border-sky-200";
      case "ABANDONED":
      case "CANCELLED":
        return "text-red-700 bg-red-100 border-red-200";
      default:
        return "text-gray-700 bg-gray-100 border-gray-200";
    }
  };

  return (
    <div
      className="p-6 bg-white rounded-2xl shadow-xl border border-gray-100"
      style={{ boxShadow: "0 2px 32px 0 #1E90FF10" }}
    >
      <div className="flex items-center justify-between mb-4 pt-4">
        <h3 className="font-bold text-xl text-sky-700">{coachName}</h3>
        {activeCessationPlan?.template && (
          <div className="relative">
            <button
              className="bg-sky-100 hover:bg-sky-200 text-sky-800 font-semibold px-3 py-1 rounded-lg shadow-sm border border-sky-200 transition"
              onClick={() => setShowTemplateModal(true)}
              title="Xem chi tiết mẫu kế hoạch"
            >
              {activeCessationPlan.template.name}
            </button>
            {/* Modal */}
            {showTemplateModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full min-w-[420px] min-h-[420px] p-0 relative animate-fade-in flex flex-col overflow-hidden">
                  <button
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl transition"
                    onClick={() => setShowTemplateModal(false)}
                    aria-label="Đóng"
                  >
                    ×
                  </button>
                  <div className="px-14 pt-12 pb-4">
                    <h4 className="text-3xl font-extrabold text-sky-700 mb-4 flex items-center gap-2">
                      <Award className="w-7 h-7 text-sky-500" />
                      {activeCessationPlan.template.name}
                    </h4>
                    <div className="mb-6 text-gray-700 text-lg">
                      <span className="font-semibold">Mô tả:</span>{" "}
                      {activeCessationPlan.template.description}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4 mb-2">
                      <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-amber-500" />
                        <span className="font-semibold">Độ khó:</span>
                        <span
                          className={`uppercase px-2 py-1 rounded-lg border text-xs font-bold ${getDifficultyColor(
                            activeCessationPlan.template.difficulty_level
                          )}`}
                        >
                          {activeCessationPlan.template.difficulty_level}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-sky-400" />
                        <span className="font-semibold">Thời gian dự kiến:</span>
                        <span>
                          {activeCessationPlan.template.estimated_duration_days} ngày
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-green-500" />
                        <span className="font-semibold">Tỉ lệ thành công:</span>
                        <span>{activeCessationPlan.template.success_rate}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-400" />
                        <span className="font-semibold">Đánh giá:</span>
                        <span>
                          {activeCessationPlan.template.average_rating} / 5
                          <span className="text-gray-500 ml-1">
                            ({activeCessationPlan.template.total_reviews} đánh giá)
                          </span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-blue-400" />
                        <span className="font-semibold">Ngày bắt đầu:</span>
                        <span>
                          {formatDate(activeCessationPlan.start_date)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-blue-400" />
                        <span className="font-semibold">Ngày mục tiêu:</span>
                        <span>
                          {formatDate(activeCessationPlan.target_date)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 col-span-2">
                        <span className="font-semibold">Trạng thái:</span>
                        <span
                          className={`uppercase px-2 py-1 rounded-lg border text-xs font-bold ${getStatusColor(
                            activeCessationPlan.status
                          )}`}
                        >
                          {activeCessationPlan.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end bg-gray-50 px-14 py-5 rounded-b-2xl">
                    <button
                      className="px-7 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-semibold text-lg transition"
                      onClick={() => setShowTemplateModal(false)}
                    >
                      Đóng
                    </button>
                  </div>
                  <style jsx global>{`
                    .animate-fade-in {
                      animation: fadeInModal 0.2s ease;
                    }
                    @keyframes fadeInModal {
                      from {
                        opacity: 0;
                        transform: translateY(24px);
                      }
                      to {
                        opacity: 1;
                        transform: translateY(0);
                      }
                    }
                  `}</style>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
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
          )
        ))}
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
