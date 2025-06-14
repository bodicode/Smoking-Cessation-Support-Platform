'use client';

import { useState } from "react";
import { Star, Shield } from "lucide-react";
import Loading from "@/components/common/Loading";
import toast from "react-hot-toast";
import { FeedbackFormProps } from "@/types/components/feedbackForm";
import { createFeedback } from "@/services/feedbackPlanTemplateService";

export default function FeedbackForm({ templateId, disabled, onSuccess }: FeedbackFormProps) {
    const [rating, setRating] = useState(0);
    const [content, setContent] = useState("");
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!rating) {
            toast.error("Vui lòng đánh giá số sao.");
            return;
        }
        setLoading(true);
        try {
            await createFeedback({
                rating,
                content,
                template_id: templateId,
                is_anonymous: isAnonymous,
            });
            toast.success("Cảm ơn bạn đã gửi feedback!");
            setRating(0);
            setContent("");
            setIsAnonymous(false);
            if (onSuccess) onSuccess();
        } catch (error: any) {
            toast.error(error.message || "Gửi feedback thất bại!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="mt-6 border-t pt-6 relative" onSubmit={handleSubmit}>
            <div className="font-bold text-sky-700 mb-2 flex items-center gap-2">
                Gửi nhận xét về kế hoạch
            </div>
            <div className="flex items-center gap-2 mb-2">
                {[1, 2, 3, 4, 5].map((num) => (
                    <button
                        key={num}
                        type="button"
                        onClick={() => setRating(num)}
                        className={`p-1 ${rating >= num ? "cursor-pointer text-yellow-400" : "cursor-pointer text-gray-300"}`}
                        disabled={loading || disabled}
                        tabIndex={-1}
                    >
                        <Star size={28} fill={rating >= num ? "#facc15" : "none"} />
                    </button>
                ))}
            </div>
            <textarea
                className="w-full border rounded-xl px-4 py-2 text-base mb-2"
                placeholder="Cảm nhận hoặc góp ý của bạn về kế hoạch..."
                value={content}
                onChange={e => setContent(e.target.value)}
                disabled={loading || disabled}
                rows={3}
            />

            <label className="flex items-center gap-2 mb-3 select-none">
                <input
                    type="checkbox"
                    className="accent-sky-600 w-5 h-5"
                    checked={isAnonymous}
                    onChange={e => setIsAnonymous(e.target.checked)}
                    disabled={loading || disabled}
                />
                <Shield className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">Ẩn danh (Người khác sẽ không thấy tên bạn)</span>
            </label>

            <button
                type="submit"
                className="cursor-pointer bg-sky-600 hover:bg-sky-700 text-white rounded px-6 py-2 font-semibold transition"
                disabled={loading || disabled}
            >
                {loading ? <Loading /> : "Gửi feedback"}
            </button>

            {disabled && (
                <div className="absolute inset-0 bg-white/70 flex items-center justify-center pointer-events-none">
                    <span className="text-sky-600 font-bold">
                        Feedback ngay khi bạn hoàn thành kế hoạch nhé!
                    </span>
                </div>
            )}
        </form>
    );
}
