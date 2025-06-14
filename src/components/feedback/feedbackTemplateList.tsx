'use client';

import { useState } from "react";
import useFeedbacks from "@/hooks/useFeedback";
import Loading from "@/components/common/Loading";
import Pagination from "@/components/common/Pagination";
import { BsStarFill, BsStarHalf, BsStar } from "react-icons/bs";

function renderStars(rating: number, max = 5) {
    return Array.from({ length: max }, (_, i) => {
        const index = i + 1;
        if (rating >= index) return <BsStarFill key={index} className="text-yellow-400 w-5 h-5" />;
        if (rating >= index - 0.5) return <BsStarHalf key={index} className="text-yellow-400 w-5 h-5" />;
        return <BsStar key={index} className="text-gray-300 w-5 h-5" />;
    });
}

interface TemplateFeedbackListProps {
    templateId: string;
}

export default function TemplateFeedbackList({ templateId }: TemplateFeedbackListProps) {
    const [page, setPage] = useState(1);
    const limit = 5;

    const { feedbacks, loading, feedbackError, total } = useFeedbacks({
        templateId,
        limit,
        page,
        orderBy: "created_at",
        sortOrder: "desc",
    });

    const totalPages = total ? Math.ceil(total / limit) : 1;
    const showPagination = totalPages > 1;

    return (
        <div className="mt-8">
            <h2 className="text-lg font-bold text-sky-600 mb-3">Feedback từ người dùng</h2>
            {loading ? (
                <Loading />
            ) : feedbackError ? (
                <div className="text-red-600">Không thể tải feedback!</div>
            ) : feedbacks.length === 0 ? (
                <div className="text-gray-500">Chưa có feedback nào cho mẫu này.</div>
            ) : (
                <div className="space-y-5">
                    {feedbacks.map((fb) => (
                        <div key={fb.id} className="border rounded-xl p-4 shadow-sm bg-sky-50 flex flex-col gap-1">
                            <div className="text-gray-500">
                                {fb.is_anonymous
                                    ? "Ẩn danh"
                                    : `${fb.user?.name} `}
                            </div>
                            <div className="flex items-center gap-2 mb-1">
                                {renderStars(Number(fb.rating))}
                                <span className="text-xs text-gray-400 ml-3">
                                    {new Date(fb.created_at).toLocaleDateString("vi-VN")}
                                </span>
                            </div>
                            <div className="text-gray-700 mb-1">{fb.content}</div>
                        </div>
                    ))}
                </div>
            )}

            {showPagination && (
                <div className="mt-6 flex flex-col items-center">
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                        hasNext={page < totalPages}
                    />
                    <span className="mt-2 text-xs text-gray-500">
                        {feedbacks.length > 0 &&
                            `Hiển thị ${1 + limit * (page - 1)} – ${limit * (page - 1) + feedbacks.length
                            } trên tổng số ${total} feedback`}
                    </span>
                </div>
            )}
        </div>
    );
}
