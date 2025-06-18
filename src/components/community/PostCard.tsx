import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, User, Pencil, Trash2, Check, X } from "lucide-react";
import { formatDate } from "@/utils";

export default function PostCard({
    post,
    idx,
    postVariants,
    t,
    showAllComments,
    setShowAllComments,
    commentInput,
    setCommentInput,
    onLike,
    onAddComment,
    onEdit,
    onDelete, // Chỉ truyền vào hàm mở confirm modal
    canEditDelete,
}: any) {
    const [editing, setEditing] = useState(false);
    const [editValue, setEditValue] = useState(post.caption);

    const comments = post.comments || [];
    const showAll = showAllComments[post.id];
    const visibleComments = showAll ? comments : comments.slice(0, 2);

    const handleStartEdit = () => {
        setEditing(true);
        setEditValue(post.caption);
    };

    const handleConfirmEdit = () => {
        if (editValue.trim() && editValue !== post.caption) {
            onEdit(post.id, editValue.trim());
        }
        setEditing(false);
    };

    return (
        <motion.div
            key={post.id}
            className="bg-white shadow-xl rounded-3xl p-5 sm:p-7 border-l-4 border-emerald-400 group transition relative"
            initial="hidden"
            whileInView="visible"
            exit="hidden"
            viewport={{ once: true, amount: 0.2 }}
            custom={idx}
            variants={postVariants}
            transition={{ type: "spring", stiffness: 180, damping: 20 }}
        >
            {/* EDIT/DELETE BUTTONS */}
            {canEditDelete && !editing && (
                <div className="absolute top-4 right-4 flex gap-2 z-10">
                    <button
                        className="cursor-pointer p-1 rounded hover:bg-sky-100 transition"
                        title={"Sửa"}
                        onClick={handleStartEdit}
                    >
                        <Pencil className="w-5 h-5 text-sky-500" />
                    </button>
                    <button
                        className="cursor-pointer p-1 rounded hover:bg-red-50 transition"
                        title={"Xóa"}
                        onClick={onDelete}
                    >
                        <Trash2 className="w-5 h-5 text-red-500" />
                    </button>
                </div>
            )}

            <div className="flex items-center gap-3 mb-2">
                {post.user_badge?.user?.avatar_url ? (
                    <img src={post.user_badge.user.avatar_url} alt={post.user_badge.user.name}
                        className="w-9 h-9 rounded-full shadow border object-cover" />
                ) : (
                    <div className="w-9 h-9 rounded-full bg-sky-100 flex items-center justify-center">
                        <User className="w-6 h-6 text-sky-400" />
                    </div>
                )}
                <div>
                    <span className="font-semibold">{post.user_badge?.user?.name || "Ẩn danh"}</span>
                    <span className="block text-gray-400 text-xs sm:text-sm">{t("datePrefix")} {formatDate(post.created_at)}</span>
                </div>
            </div>

            <div className="flex items-center gap-2 mb-1 flex-wrap">
                {post.user_badge?.badge?.icon_url && (
                    <img src={post.user_badge.badge.icon_url}
                        alt={post.user_badge.badge.name}
                        className="w-6 h-6 rounded-full shadow inline-block" />
                )}
                {post.user_badge?.badge?.name && (
                    <span className="font-medium text-emerald-600">{post.user_badge.badge.name}</span>
                )}
            </div>

            {!editing ? (
                <p className="text-gray-800 text-base mb-2 break-words">{post.caption}</p>
            ) : (
                <div className="flex gap-2 items-center mb-2">
                    <input
                        className="border rounded px-2 py-1 flex-1 text-base"
                        value={editValue}
                        onChange={e => setEditValue(e.target.value)}
                        autoFocus
                        maxLength={300}
                    />
                    <button
                        className="cursor-pointer p-1 rounded bg-emerald-100 hover:bg-emerald-200"
                        title={"Lưu"}
                        onClick={handleConfirmEdit}
                    >
                        <Check className="w-5 h-5 text-emerald-600" />
                    </button>
                    <button
                        className="cursor-pointer p-1 rounded bg-gray-100 hover:bg-gray-200"
                        title={t("cancel")}
                        onClick={() => setEditing(false)}
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>
            )}

            {/* Like, comment */}
            <div className="flex items-center gap-4 mt-2">
                <motion.button
                    onClick={() => onLike(post.id)}
                    className={`cursor-pointer flex items-center gap-1 text-sm font-semibold transition ${post.liked ? "text-red-500" : "text-gray-500 hover:text-red-500"
                        }`}
                    whileTap={{ scale: 1.15 }}
                    whileHover={{ scale: 1.09 }}
                >
                    <Heart
                        className="w-5 h-5 cursor-pointer"
                        fill={post.liked ? "#ef4444" : "none"}
                        stroke={post.liked ? "#ef4444" : "currentColor"}
                    />
                    {post.likes_count}
                </motion.button>
                <span className="text-gray-400 text-xs flex items-center gap-1">
                    💬 {post.comments_count}
                </span>
            </div>

            {/* Comments */}
            <div className="mt-2 border-t pt-2">
                <div className="space-y-2 mb-2">
                    {visibleComments.length > 0 && visibleComments.map((c: any, idx: number) => (
                        <div key={c.id || idx} className="flex items-center gap-2 text-xs sm:text-sm">
                            <span className="font-semibold text-sky-700">{c.user?.name || "Ẩn danh"}:</span>
                            <span>{c.text}</span>
                        </div>
                    ))}
                    {comments.length > 2 && !showAll && (
                        <button
                            className="cursor-pointer text-blue-500 hover:underline text-xs sm:text-sm font-medium"
                            onClick={() =>
                                setShowAllComments((s: any) => ({ ...s, [post.id]: true }))
                            }
                        >
                            {t("showMore", { count: comments.length - 2 })}
                        </button>
                    )}
                    {comments.length > 2 && showAll && (
                        <button
                            className="cursor-pointer text-blue-500 hover:underline text-xs sm:text-sm font-medium"
                            onClick={() =>
                                setShowAllComments((s: any) => ({ ...s, [post.id]: false }))
                            }
                        >
                            {t("showLess")}
                        </button>
                    )}
                </div>

                <div className="flex gap-2 mt-2">
                    <input
                        className="border rounded px-2 py-1 flex-1 text-xs sm:text-sm"
                        placeholder={t("commentPlaceholder")}
                        value={commentInput[post.id] || ""}
                        onChange={e => setCommentInput((inputs: any) => ({ ...inputs, [post.id]: e.target.value }))}
                        onKeyDown={e => {
                            if (e.key === "Enter") onAddComment(post.id);
                        }}
                        disabled={editing}
                    />
                    <motion.button
                        className="cursor-pointer px-3 py-1 rounded bg-blue-500 text-white text-xs sm:text-sm font-semibold hover:bg-blue-600"
                        onClick={() => onAddComment(post.id)}
                        type="button"
                        whileHover={{ scale: 1.09 }}
                        whileTap={{ scale: 0.96 }}
                        disabled={editing}
                    >
                        {t("send")}
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}
