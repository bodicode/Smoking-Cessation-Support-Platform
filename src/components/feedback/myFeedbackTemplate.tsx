import { useAuth } from "@/hooks/useAuth";
import FeedbackForm from "@/components/feedback/FeedbackForm";
import Loading from "@/components/common/Loading";
import { BsStarFill, BsStar } from "react-icons/bs";
import { useState } from "react";
import useFeedbacks from "@/hooks/useFeedback";
import ConfirmModal from "../common/ModalConfirm";

export default function TemplateMyFeedbackBox({ templateId }: { templateId: string }) {
    const { user } = useAuth();
    const [showConfirm, setShowConfirm] = useState(false);

    const {
        feedbacks,
        loading,
        handleUpdate,
        handleDelete,
        setReload
    } = useFeedbacks({ templateId, userId: user?.id, limit: 1, page: 1 });

    const myFeedback = feedbacks[0];
    const [editing, setEditing] = useState(false);
    const [editData, setEditData] = useState({ rating: 0, content: "" });
    const [loadingAction, setLoadingAction] = useState(false);

    const handleEditClick = () => {
        setEditData({
            rating: myFeedback.rating,
            content: myFeedback.content,
        });
        setEditing(true);
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoadingAction(true);
        try {
            await handleUpdate(myFeedback.id, editData);
            setEditing(false);
            setReload(r => r + 1);
        } finally {
            setLoadingAction(false);
        }
    };

    const handleDeleteConfirm = async () => {
        setLoadingAction(true);
        try {
            await handleDelete(myFeedback.id);
            setShowConfirm(false);
            setEditing(false);
            setReload(r => r + 1);
        } finally {
            setLoadingAction(false);
        }
    };

    if (loading) return <Loading />;
    if (!user) return null;

    return (
        <div className="mt-6">
            <h3 className="font-bold text-sky-700 mb-2">Feedback của bạn</h3>
            {myFeedback && !editing ? (
                <div className="rounded-xl border p-4 bg-green-50 shadow flex flex-col gap-1">
                    <div className="flex items-center gap-2 mb-1">
                        {/* Star rating */}
                        {[1, 2, 3, 4, 5].map(i =>
                            i <= myFeedback.rating
                                ? <BsStarFill key={i} className="text-yellow-400" />
                                : <BsStar key={i} className="text-gray-300" />
                        )}
                        {/* Date */}
                        <span className="ml-2 text-gray-400 text-xs">
                            {new Date(myFeedback.created_at).toLocaleDateString("vi-VN")}
                        </span>
                        {/* Anonymity */}
                        {myFeedback.is_anonymous && (
                            <span className="ml-3 text-xs text-sky-500 font-bold">(Ẩn danh)</span>
                        )}
                    </div>

                    <div className="flex items-center gap-2 mb-1">
                        {!myFeedback.is_anonymous && (
                            <>
                                <span className="font-semibold text-sky-700">
                                    {myFeedback.user?.name}
                                </span>
                            </>
                        )}
                    </div>

                    <div className="text-gray-700 font-medium mb-1">{myFeedback.content}</div>

                    <div className="flex gap-3 mt-2">
                        <button
                            onClick={handleEditClick}
                            className="cursor-pointer px-4 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded font-semibold"
                        >
                            Sửa
                        </button>
                        <button
                            onClick={() => setShowConfirm(true)}
                            className="cursor-pointer px-4 py-1 bg-red-500 hover:bg-red-700 text-white rounded font-semibold"
                        >
                            Xóa
                        </button>
                    </div>
                    <ConfirmModal
                        open={showConfirm}
                        title="Xác nhận xóa"
                        message="Bạn có chắc chắn muốn xóa feedback này không?"
                        onCancel={() => setShowConfirm(false)}
                        onConfirm={handleDeleteConfirm}
                    />
                </div>
            ) : editing ? (
                <form className="rounded-xl border p-4 bg-yellow-50" onSubmit={handleEditSubmit}>
                    <div className="flex items-center gap-2 mb-2">
                        {[1, 2, 3, 4, 5].map(i => (
                            <button
                                type="button"
                                key={i}
                                onClick={() => setEditData(prev => ({ ...prev, rating: i }))}
                                disabled={loadingAction}
                                className="focus:outline-none cursor-pointer"
                            >
                                {i <= editData.rating
                                    ? <BsStarFill className="text-yellow-400" />
                                    : <BsStar className="text-gray-300" />
                                }
                            </button>
                        ))}
                    </div>
                    <textarea
                        className="w-full border rounded-xl px-4 py-2 text-base mb-2"
                        value={editData.content}
                        onChange={e => setEditData(prev => ({ ...prev, content: e.target.value }))}
                        rows={3}
                        disabled={loadingAction}
                    />
                    <div className="flex gap-3">
                        <button
                            type="submit"
                            className="cursor-pointer bg-sky-600 hover:bg-sky-700 text-white rounded px-6 py-2 font-semibold"
                            disabled={loadingAction}
                        >
                            {loadingAction ? <Loading color="#fff" /> : "Lưu"}
                        </button>
                        <button
                            type="button"
                            className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 rounded px-6 py-2 font-semibold"
                            onClick={() => setEditing(false)}
                            disabled={loadingAction}
                        >
                            Huỷ
                        </button>
                    </div>
                </form>
            ) : (
                <FeedbackForm templateId={templateId} onSuccess={() => setReload(r => r + 1)} />
            )}
        </div>
    );
}
