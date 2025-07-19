import { Star, User, Calendar, MessageSquare } from "lucide-react";
import useFeedbacks from "@/hooks/useFeedback";

interface FeedbackListProps {
  templateId: string;
}

export function FeedbackList({ templateId }: FeedbackListProps) {
  const { feedbacks, loading, feedbackError } = useFeedbacks({
    templateId,
    limit: 10,
    page: 1,
    orderBy: "created_at",
    sortOrder: "desc"
  });

  if (loading) {
    return (
      <div className="py-8 text-center text-sky-600 font-semibold">
        Đang tải feedback...
      </div>
    );
  }

  if (feedbackError) {
    return (
      <div className="py-8 text-center text-red-600 font-semibold">
        Lỗi tải feedback.
      </div>
    );
  }

  if (feedbacks.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">
        <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p>Chưa có feedback nào cho template này.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {feedbacks.map((feedback: any) => (
        <div
          key={feedback.id}
          className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-sky-200 hover:border-sky-400 transition-colors"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-sky-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">
                  {feedback.is_anonymous ? "Người dùng ẩn danh" : feedback.user?.name || "Người dùng"}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < feedback.rating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">{feedback.rating}/5</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              {new Date(feedback.created_at).toLocaleDateString('vi-VN')}
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-700 leading-relaxed">{feedback.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
} 