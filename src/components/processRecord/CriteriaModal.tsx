import { X } from "lucide-react";
import CoachCriteriaList from "./CoachCriteriaList";

interface CriteriaModalProps {
  open: boolean;
  onClose: () => void;
  coachId: string;
}

export default function CriteriaModal({
  open,
  onClose,
  coachId,
}: CriteriaModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl mx-4 p-8 bg-white rounded-2xl shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-900 transition cursor-pointer"
        >
          <X size={24} />
        </button>
        <h2 className="text-xl font-bold text-sky-700 mb-4 text-center">
          Bạn có thể dựa vào đây để tự chấm điểm sức khỏe
        </h2>

        <CoachCriteriaList coachId={coachId} />
      </div>
    </div>
  );
}
