"use client";

import { useState } from "react";
import { Award } from "lucide-react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import Breadcrumbs from "@/components/common/BreadCrumb";
import Loading from "@/components/common/Loading";
import PostCard from "@/components/community/PostCard";
import AddPostForm from "@/components/community/AddPostForm";
import toast from "react-hot-toast";
import { useMyBadges } from "@/hooks/useMyBadge";
import { useAuth } from "@/hooks/useAuth";
import { usePost } from "@/hooks/usePost";
import ConfirmModal from "@/components/common/ModalConfirm";

export default function Community() {
    const t = useTranslations("community");
    const { user } = useAuth();

    const {
        data: posts,
        loading,
        error,
        submitPost,
        editPost,
        deletePost,
        refetch,
    } = usePost({ page: 1, limit: 10 });

    const { badges } = useMyBadges();

    // State for add form
    const [showAddForm, setShowAddForm] = useState(false);
    const [newCaption, setNewCaption] = useState("");

    // State for comment inputs and show all comments
    const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});
    const [showAllComments, setShowAllComments] = useState<{ [postId: string]: boolean }>({});

    // Confirm modal state
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

    // Handlers
    const handleAddPost = async (e: React.FormEvent) => {
        e.preventDefault();
        const firstBadge = badges?.data?.[0];
        if (!firstBadge?.id) {
            toast.error("Bạn cần có huy hiệu để chia sẻ bài viết.");
            return;
        }
        try {
            await submitPost({
                user_badge_id: firstBadge.id,
                caption: newCaption,
            });
            toast.success("Bài viết đã được đăng");
            setShowAddForm(false);
            setNewCaption("");
        } catch (err: any) {
            const message = err?.message;
            if (message?.includes("already been shared")) {
                toast.error("Huy hiệu này đã được chia sẻ trước đó.");
            } else {
                toast.error("Đã có lỗi xảy ra");
            }
        }
    };

    const handleEditPost = async (postId: string, caption: string) => {
        try {
            await editPost(postId, { caption });
            toast.success("Đã cập nhật bài viết");
        } catch (err) {
            toast.error("Cập nhật thất bại");
        }
    };

    // Khi bấm vào nút xóa trên PostCard
    const handleAskDelete = (postId: string) => {
        setPendingDeleteId(postId);
        setConfirmOpen(true);
    };

    // Khi xác nhận trên modal
    const handleConfirmDelete = async () => {
        if (pendingDeleteId) {
            try {
                await deletePost(pendingDeleteId);
                toast.success("Đã xóa bài viết");
            } catch {
                toast.error("Xóa thất bại");
            }
            setPendingDeleteId(null);
            setConfirmOpen(false);
        }
    };

    // Khi hủy trên modal
    const handleCancelDelete = () => {
        setPendingDeleteId(null);
        setConfirmOpen(false);
    };

    const postVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <div className="max-w-5xl mx-auto py-6 px-2 sm:px-4 md:py-10">
            <Breadcrumbs
                items={[
                    { label: "Trang chủ", href: "/" },
                    { label: "Mạng xã hội", active: true }
                ]}
            />

            <h1 className="text-2xl md:text-3xl font-extrabold text-center mb-4 md:mb-6 text-gradient bg-gradient-to-r from-sky-600 to-green-400 inline-block text-transparent bg-clip-text">
                {t("title")}
            </h1>
            <p className="text-left text-gray-500 mb-6 md:mb-8 text-sm md:text-base">
                {t("description")}
            </p>

            <AnimatePresence>
                {!showAddForm && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 18 }}
                        className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-50 bg-gradient-to-r from-blue-500 to-green-500 text-white py-2 px-4 sm:py-3 sm:px-6 rounded-full font-bold shadow-lg hover:scale-105 hover:shadow-xl transition-all text-sm sm:text-base"
                        onClick={() => setShowAddForm(true)}
                        whileHover={{ scale: 1.07, boxShadow: "0px 4px 16px #60C3A477" }}
                    >
                        {t("shareBtn")}
                    </motion.button>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showAddForm && (
                    <AddPostForm
                        newCaption={newCaption}
                        setNewCaption={setNewCaption}
                        onCancel={() => setShowAddForm(false)}
                        onSubmit={handleAddPost}
                        t={t}
                    />
                )}
            </AnimatePresence>

            {loading && (
                <div className="flex justify-center py-12">
                    <Loading />
                </div>
            )}

            {!loading && (!posts || posts.length === 0) && (
                <div className="flex flex-col items-center gap-4 py-12 opacity-80">
                    <Award className="w-10 h-10 text-yellow-400" />
                    <p className="text-gray-500">Chưa có bài viết nào.</p>
                </div>
            )}

            <div className="space-y-4 md:space-y-6">
                <AnimatePresence>
                    {!loading && posts.map((post, idx) => (
                        <PostCard
                            key={post.id}
                            post={post}
                            idx={idx}
                            postVariants={postVariants}
                            t={t}
                            showAllComments={showAllComments}
                            setShowAllComments={setShowAllComments}
                            commentInput={commentInputs}
                            setCommentInput={setCommentInputs}
                            // onLike={handleLike}
                            // onAddComment={handleAddComment}
                            onEdit={handleEditPost}
                            // Chuyển thành truyền hàm mở modal xác nhận
                            onDelete={() => handleAskDelete(post.id)}
                            canEditDelete={post.user_badge?.user?.id === user.id}
                        />
                    ))}
                </AnimatePresence>
            </div>

            <ConfirmModal
                open={confirmOpen}
                title="Xác nhận xóa bài viết"
                message="Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác."
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />
        </div>
    );
}
