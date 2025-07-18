import { useState } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  User,
  Pencil,
  Trash2,
  Check,
  X,
  MessageCircle,
} from "lucide-react";
import { formatDate } from "@/utils";
import CommentList from "./CommentList";
import { usePostComments } from "@/hooks/usePostComment";
import toast from "react-hot-toast";
import Loading from "../common/Loading";
import { useAuth } from "@/hooks/useAuth";
import ConfirmModal from "../common/ModalConfirm";

export default function PostCard({
  post,
  idx,
  postVariants,
  showAllComments,
  setShowAllComments,
  onLike,
  onEdit,
  onDelete,
  canEditDelete,
  onCommentAdded,
  onCommentDeleted,
}: any) {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(post.caption);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const [replyLoadingId, setReplyLoadingId] = useState<string | null>(null);
  const [editLoadingId, setEditLoadingId] = useState<string | null>(null);
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);

  const {
    comments,
    loading: loadingComments,
    error,
    submitComment,
    addLoading,
    refetch,
    submitReply,
    submitEdit,
    submitDelete,
  } = usePostComments(post.id);

  const showAll = showAllComments[post.id];
  const [commentInput, setCommentInput] = useState("");
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

  const handleAddComment = async () => {
    if (!commentInput.trim()) {
      toast.error("Bạn chưa nhập nội dung bình luận!");
      return;
    }
    try {
      await submitComment({
        shared_post_id: post.id,
        content: commentInput.trim(),
      });
      setCommentInput("");
      if (onCommentAdded) onCommentAdded();
    } catch (e: any) {
      toast.error(e?.message || "Gửi bình luận thất bại. Vui lòng thử lại.");
    }
  };

  const handleConfirmDelete = async () => {
    if (!pendingDeleteId) return;
    setDeleteLoadingId(pendingDeleteId);
    try {
      await submitDelete(pendingDeleteId);
      toast.success("Đã xoá bình luận!");
      if (onCommentDeleted) onCommentDeleted(); 
    } catch (e: any) {
      toast.error(e?.message || "Xoá bình luận thất bại.");
    }
    setDeleteLoadingId(null);
    setPendingDeleteId(null);
    setConfirmOpen(false);
  };

  const handleReply = async (parentId: string, text: string) => {
    setReplyLoadingId(parentId);
    try {
      await submitReply({
        shared_post_id: post.id,
        content: text,
        parent_comment_id: parentId,
      });
      toast.success("Đã gửi phản hồi!");
    } catch (e) {
      toast.error("Gửi phản hồi thất bại");
    }
    setReplyLoadingId(null);
  };

  const handleEditComment = async (commentId: string, content: string) => {
    setEditLoadingId(commentId);
    try {
      await submitEdit(commentId, content);
      toast.success("Đã sửa bình luận!");
    } catch (e: any) {
      toast.error(e?.message || "Sửa bình luận thất bại.");
    }
    setEditLoadingId(null);
  };

  const askDelete = (commentId: string) => {
    setPendingDeleteId(commentId);
    setConfirmOpen(true);
  };

  const handleCancelDelete = () => {
    setPendingDeleteId(null);
    setConfirmOpen(false);
  };

  return (
    <motion.div
      key={post.id}
      className="bg-white shadow-2xl rounded-3xl p-6 sm:p-8 border border-gray-100 group transition relative mb-7"
      initial="hidden"
      whileInView="visible"
      exit="hidden"
      viewport={{ once: true, amount: 0.2 }}
      custom={idx}
      variants={postVariants}
      transition={{ type: "spring", stiffness: 180, damping: 22 }}
    >
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

      <div className="flex items-center gap-4 mb-3">
        {post.user_badge?.user?.avatar_url ? (
          <img
            src={post.user_badge.user.avatar_url}
            alt={post.user_badge.user.name}
            className="w-12 h-12 rounded-full shadow border object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center">
            <User className="w-8 h-8 text-sky-400" />
          </div>
        )}
        <div>
          <span className="font-semibold text-lg">
            {post.user_badge?.user?.name}
          </span>
          <div className="flex items-center gap-2 mt-1">
            {post.user_badge?.badge?.icon_url && (
              <img
                src={post.user_badge.badge.icon_url}
                alt={post.user_badge.badge.name}
                className="w-6 h-6 rounded-full shadow inline-block"
              />
            )}
            {post.user_badge?.badge?.name && (
              <span className="font-medium text-emerald-700 text-sm">
                {post.user_badge.badge.name}
              </span>
            )}
            <span className="block text-gray-400 text-xs sm:text-sm ml-2">
              {formatDate(post.created_at)}
            </span>
          </div>
        </div>
      </div>

      {!editing ? (
        <p className="text-gray-900 text-base sm:text-lg mb-2 mt-2 break-words min-h-[28px]">
          {post.caption}
        </p>
      ) : (
        <div className="flex gap-2 items-center mb-2">
          <input
            className="border rounded px-3 py-1 flex-1 text-base"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
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
            title={"Hủy"}
            onClick={() => setEditing(false)}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      )}

      <div className="flex items-center gap-4 mt-3 pb-1 border-b border-gray-100">
        <motion.button
          onClick={() => onLike(post.id)}
          className={`cursor-pointer flex items-center gap-1 text-base font-semibold transition ${
            post.liked ? "text-red-500" : "text-gray-500 hover:text-red-500"
          }`}
          whileTap={{ scale: 1.15 }}
          whileHover={{ scale: 1.09 }}
        >
          <Heart
            className="w-6 h-6 cursor-pointer"
            fill={post.liked ? "#ef4444" : "none"}
            stroke={post.liked ? "#ef4444" : "currentColor"}
          />
          {post.likes_count}
        </motion.button>
        <span className="text-gray-400 text-xs flex items-center gap-1">
          <MessageCircle className="w-5 h-5" />
          {post.comments_count}
        </span>
      </div>

      {loadingComments && (
        <div className="py-4 flex justify-center">
          <Loading />
        </div>
      )}

      <div className="mt-2">
        <CommentList
          comments={visibleComments}
          onReply={handleReply}
          onEdit={handleEditComment}
          onDelete={askDelete}
          canEditDelete={(userId) => !!user?.id && userId === user.id}
          replyLoadingId={replyLoadingId}
          editLoadingId={editLoadingId}
          deleteLoadingId={deleteLoadingId}
        />
        {comments.length > 2 && !showAll && (
          <button
            className="mt-2 cursor-pointer text-blue-500 hover:underline text-xs sm:text-sm font-medium"
            onClick={() =>
              setShowAllComments((s: any) => ({ ...s, [post.id]: true }))
            }
          >
            Xem thêm {comments.length - 2} bình luận
          </button>
        )}
        {comments.length > 2 && showAll && (
          <button
            className="mt-2 cursor-pointer text-blue-500 hover:underline text-xs sm:text-sm font-medium"
            onClick={() =>
              setShowAllComments((s: any) => ({ ...s, [post.id]: false }))
            }
          >
            Xem ít hơn
          </button>
        )}
        <div className="flex gap-2 mt-3 bg-slate-50 rounded-xl px-3 py-2 border border-gray-100 shadow-sm">
          <input
            className="border-none outline-none bg-transparent flex-1 text-xs sm:text-sm"
            placeholder="Nhập bình luận"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddComment();
            }}
            disabled={editing || addLoading}
            maxLength={300}
          />
          <motion.button
            className="cursor-pointer px-4 py-1 rounded bg-blue-500 text-white text-xs sm:text-sm font-semibold hover:bg-blue-600 min-w-[60px] flex justify-center items-center"
            onClick={handleAddComment}
            type="button"
            whileHover={{ scale: 1.09 }}
            whileTap={{ scale: 0.96 }}
            disabled={editing || addLoading || !commentInput.trim()}
          >
            {addLoading ? <Loading color="#FFFFFF" /> : "Gửi bình luận"}
          </motion.button>
        </div>
      </div>

      <ConfirmModal
        open={confirmOpen}
        title="Xác nhận xóa bình luận"
        message="Bạn có chắc chắn muốn xóa bình luận này? Hành động này không thể hoàn tác."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </motion.div>
  );
}
