import React from "react";
import { ChevronDown, MessageCircle } from "lucide-react";
import { IChatRoom } from "@/types/api/chat";

interface ChatRoomSelectorProps {
  rooms: IChatRoom[];
  selectedRoomId: string | null;
  onRoomSelect: (roomId: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function ChatRoomSelector({
  rooms,
  selectedRoomId,
  onRoomSelect,
  isOpen,
  onToggle,
}: ChatRoomSelectorProps) {
  const selectedRoom = rooms.find(room => room.id === selectedRoomId);

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex items-center gap-2 text-white hover:text-blue-100 font-medium transition-colors"
      >
        <MessageCircle className="w-4 h-4" />
        <span className="text-sm text-nowrap">
          {selectedRoom ? selectedRoom.receiver.name : "Chọn Coach"}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="py-2">
            {rooms.map((room) => (
              <button
                key={room.id}
                onClick={() => {
                  onRoomSelect(room.id);
                  onToggle();
                }}
                className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors ${
                  room.id === selectedRoomId ? "bg-sky-50 text-sky-700" : "text-gray-700"
                }`}
              >
                <div className="font-medium">{room.receiver.name}</div>
                <div className="text-xs text-gray-500">
                  {new Date(room.created_at).toLocaleDateString("vi-VN")}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 