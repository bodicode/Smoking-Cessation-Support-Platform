import { PostComment, PostReply } from "@/types/api/comment";
import React, { useState } from "react";
import { Pencil, Trash2, Reply } from "lucide-react";
import clsx from "clsx";
import Loading from "../common/Loading";

interface CommentItemProps {
  comment: PostComment | PostReply;
  level?: number;
  onReply?: (parentId: string, text: string) => Promise<void>;
  replyingId?: string | null;
  setReplyingId?: (id: string | null) => void;
  onEdit?: (commentId: string, content: string) => Promise<void>;
  onDelete?: (commentId: string) => void;
  canEditDelete?: (commentUserId?: string) => boolean;
  replyLoadingId?: string | null;
  editLoadingId?: string | null;
  deleteLoadingId?: string | null;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  level = 0,
  onReply,
  replyingId,
  setReplyingId,
  onEdit,
  onDelete,
  canEditDelete,
  replyLoadingId,
  editLoadingId,
  deleteLoadingId,
}) => {
  const [replyValue, setReplyValue] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(comment.content);

  const editable = canEditDelete ? canEditDelete(comment.user?.id) : false;

  const handleEdit = async () => {
    if (!editValue.trim() || editValue === comment.content) {
      setIsEditing(false);
      return;
    }
    await onEdit?.(comment.id, editValue.trim());
    setIsEditing(false);
  };

  const handleReply = async () => {
    if (!replyValue.trim()) return;
    await onReply?.(comment.id, replyValue.trim());
    setReplyValue("");
    setReplyingId?.(null);
  };

  return (
    <div
      className={clsx(
        "rounded-xl mb-3 py-2 px-2 transition-all",
        editable ? "bg-blue-50" : "bg-gray-50",
        level > 0 && "ml-6"
      )}
      style={{
        borderLeft: `3px solid ${level === 0 ? "#14b8a6" : "#cbd5e1"}`,
      }}
    >
      <div className="flex items-start gap-3">
        {comment.user?.avatar_url ? (
          <img
            src={comment.user.avatar_url}
            alt={comment.user.name}
            className="w-8 h-8 rounded-full object-cover border shadow"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-sky-200 flex items-center justify-center text-white font-bold">
            {comment.user?.name?.charAt(0)?.toUpperCase() ?? "?"}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <span className="font-semibold text-sky-800 truncate">
              {comment.user?.name || "Ẩn danh"}
            </span>
            <span
              className="text-xs text-gray-400 ml-2"
              title={comment.created_at}
            >
              {comment.created_at
                ? new Date(comment.created_at).toLocaleString()
                : ""}
            </span>
          </div>

          {isEditing ? (
            <div className="flex gap-2 items-center mt-1">
              <input
                className="border rounded px-2 py-1 text-xs flex-1"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                maxLength={300}
                autoFocus
              />
              <button
                className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 text-xs hover:bg-emerald-200 cursor-pointer"
                onClick={handleEdit}
                title="Lưu"
                disabled={editLoadingId === comment.id}
              >
                {editLoadingId === comment.id ? (
                  <Loading color="#14b8a6" />
                ) : (
                  "Lưu"
                )}
              </button>
              <button
                className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-xs hover:bg-gray-200 cursor-pointer"
                onClick={() => {
                  setIsEditing(false);
                  setEditValue(comment.content);
                }}
                title="Hủy"
                disabled={editLoadingId === comment.id}
              >
                Hủy
              </button>
            </div>
          ) : (
            <div className="text-sm text-gray-800 mt-1 break-words">
              {comment.content}
            </div>
          )}

          <div className="flex gap-2 mt-1">
            {onReply && setReplyingId && !isEditing && (
              <button
                className="flex items-center gap-1 text-xs text-sky-600 hover:underline hover:text-sky-800 transition cursor-pointer"
                onClick={() =>
                  replyingId === comment.id
                    ? setReplyingId(null)
                    : setReplyingId(comment.id)
                }
                title={replyingId === comment.id ? "Huỷ trả lời" : "Trả lời"}
                disabled={replyLoadingId === comment.id}
              >
                <Reply size={13} />
                {replyingId === comment.id ? "Huỷ" : "Trả lời"}
              </button>
            )}
            {editable && !isEditing && (
              <>
                <button
                  className="flex items-center gap-1 text-xs text-blue-600 hover:underline hover:text-blue-800 transition cursor-pointer"
                  onClick={() => setIsEditing(true)}
                  title="Sửa bình luận"
                  disabled={editLoadingId === comment.id}
                >
                  <Pencil size={13} />
                  Sửa
                </button>
                <button
                  className="flex items-center gap-1 text-xs text-red-600 hover:underline hover:text-red-800 transition cursor-pointer"
                  onClick={() => onDelete?.(comment.id)}
                  title="Xoá bình luận"
                  disabled={deleteLoadingId === comment.id}
                >
                  {deleteLoadingId === comment.id ? (
                    <Loading color="#ef4444" />
                  ) : (
                    <Trash2 size={13} />
                  )}
                  Xoá
                </button>
              </>
            )}
          </div>

          {replyingId === comment.id && !isEditing && (
            <div className="flex gap-2 mt-2">
              <input
                className="border rounded px-2 py-1 flex-1 text-xs sm:text-sm"
                placeholder="Nhập phản hồi..."
                value={replyValue}
                onChange={(e) => setReplyValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleReply();
                }}
                autoFocus
                disabled={replyLoadingId === comment.id}
              />
              <button
                className="px-3 py-1 rounded bg-blue-500 text-white text-xs font-semibold hover:bg-blue-600 cursor-pointer"
                onClick={handleReply}
                disabled={replyLoadingId === comment.id}
              >
                {replyLoadingId === comment.id ? (
                  <Loading color="#fff" />
                ) : (
                  "Gửi"
                )}
              </button>
            </div>
          )}

          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-2">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  level={level + 1}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  canEditDelete={canEditDelete}
                  replyLoadingId={replyLoadingId}
                  editLoadingId={editLoadingId}
                  deleteLoadingId={deleteLoadingId}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface CommentListProps {
  comments: PostComment[];
  onReply?: (parentId: string, text: string) => Promise<void>;
  onEdit?: (commentId: string, content: string) => Promise<void>;
  onDelete?: (commentId: string) => void;
  canEditDelete?: (commentUserId?: string) => boolean;
  replyLoadingId?: string | null;
  editLoadingId?: string | null;
  deleteLoadingId?: string | null;
}

const CommentList: React.FC<CommentListProps> = ({
  comments,
  onReply,
  onEdit,
  onDelete,
  canEditDelete,
  replyLoadingId,
  editLoadingId,
  deleteLoadingId,
}) => {
  const [replyingId, setReplyingId] = useState<string | null>(null);

  return (
    <div>
      {comments && comments.length > 0 ? (
        comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onReply={onReply}
            replyingId={replyingId}
            setReplyingId={setReplyingId}
            onEdit={onEdit}
            onDelete={onDelete}
            canEditDelete={canEditDelete}
            replyLoadingId={replyLoadingId}
            editLoadingId={editLoadingId}
            deleteLoadingId={deleteLoadingId}
          />
        ))
      ) : (
        <div className="text-gray-400 text-sm py-2">Chưa có bình luận nào.</div>
      )}
    </div>
  );
};

export default CommentList;
