"use client";

import { useState } from "react";
import { Award, Heart, User } from "lucide-react";
import { badgeOptions, initialPosts } from "../../../../data";
import { formatDate } from "@/utils";
import { useTranslations } from "next-intl";

export default function Community() {
    const t = useTranslations("community");
    const currentUser = { id: "me", name: "Bạn" };
    const latestBadge = badgeOptions[0];

    const [posts, setPosts] = useState(initialPosts);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newCaption, setNewCaption] = useState("");
    const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});
    const [showAllComments, setShowAllComments] = useState<{ [postId: string]: boolean }>({});

    const handleLike = (postId: string) => {
        setPosts(posts =>
            posts.map(post =>
                post.id === postId
                    ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
                    : post
            )
        );
    };

    const handleAddComment = (postId: string) => {
        const text = (commentInputs[postId] || "").trim();
        if (!text) return;
        setPosts(posts =>
            posts.map(post =>
                post.id === postId
                    ? {
                        ...post,
                        comments: [
                            ...post.comments,
                            {
                                id: `c-${Date.now()}`,
                                user: currentUser,
                                text
                            }
                        ]
                    }
                    : post
            )
        );
        setCommentInputs(inputs => ({ ...inputs, [postId]: "" }));
    };

    const handleAddPost = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCaption) return;
        setPosts([
            {
                id: `post-${Date.now()}`,
                caption: newCaption,
                is_deleted: false,
                created_at: new Date().toISOString(),
                user: currentUser,
                badge: latestBadge,
                likes: 0,
                liked: false,
                comments: []
            },
            ...posts
        ]);
        setShowAddForm(false);
        setNewCaption("");
    };

    return (
        <div className="max-w-5xl mx-auto py-6 px-2 sm:px-4 md:py-10">
            <h1 className="text-2xl md:text-3xl font-extrabold text-center mb-4 md:mb-6 text-gradient bg-gradient-to-r from-sky-600 to-green-400 inline-block text-transparent bg-clip-text">
                {t("title")}
            </h1>
            <p className="text-left text-gray-500 mb-6 md:mb-8 text-sm md:text-base">
                {t("description")}
            </p>

            {!showAddForm && (
                <button
                    className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 bg-gradient-to-r from-blue-500 to-green-500 text-white py-2 px-4 sm:py-3 sm:px-6 rounded-full font-bold shadow-lg shadow-blue-200 hover:scale-105 hover:shadow-xl transition-all text-sm sm:text-base"
                    onClick={() => setShowAddForm(true)}
                >
                    {t("shareBtn")}
                </button>
            )}

            {showAddForm && (
                <>
                    <div
                        className="fixed inset-0 bg-black/40 z-40"
                        onClick={() => setShowAddForm(false)}
                    />
                    <form
                        onSubmit={handleAddPost}
                        className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl p-4 sm:p-8 w-[95vw] max-w-lg border-l-4 border-blue-400 space-y-4"
                    >
                        <h2 className="font-bold text-lg sm:text-xl mb-2 text-center">{t("shareTitle")}</h2>
                        <div className="mb-4">
                            <div className="flex items-center gap-2 flex-wrap">
                                <Award className="w-5 h-5 text-yellow-400" />
                                <span className="font-medium text-emerald-600">{latestBadge.name}</span>
                                <span className="text-gray-500 text-xs sm:text-sm ml-2">{latestBadge.description}</span>
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                                {t("shareHint")}
                            </div>
                        </div>
                        <div>
                            <label className="font-semibold">{t("captionLabel")}</label>
                            <textarea
                                className="w-full border px-3 py-2 rounded mt-1"
                                value={newCaption}
                                rows={2}
                                placeholder={t("captionPlaceholder")}
                                onChange={e => setNewCaption(e.target.value)}
                                required
                            />
                        </div>
                        <div className="text-right flex justify-end gap-2">
                            <button
                                type="button"
                                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                                onClick={() => setShowAddForm(false)}
                            >
                                {t("cancel")}
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 rounded bg-gradient-to-r from-blue-500 to-green-500 text-white font-bold hover:to-green-600"
                            >
                                {t("submit")}
                            </button>
                        </div>
                    </form>
                </>
            )}

            <div className="space-y-4 md:space-y-6">
                {posts.map(post => {
                    const comments = post.comments;
                    const showAll = showAllComments[post.id];
                    const visibleComments = showAll ? comments : comments.slice(0, 2);
                    return (
                        <div
                            key={post.id}
                            className="bg-white shadow-md rounded-2xl p-4 sm:p-6 flex flex-col gap-2 border-l-4 border-emerald-400"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-sky-100 flex items-center justify-center">
                                    <User className="w-5 h-5 md:w-6 md:h-6 text-sky-400" />
                                </div>
                                <div>
                                    <span className="font-semibold">{post.user.name}</span>{" "}
                                    <span className="text-gray-400 text-xs sm:text-sm">{t("datePrefix")} {formatDate(post.created_at)}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <Award className="w-5 h-5 text-yellow-400" />
                                <span className="font-medium text-emerald-600">{post.badge.name}</span>
                                <span className="text-gray-500 text-xs sm:text-sm ml-2">{post.badge.description}</span>
                            </div>
                            <p className="text-gray-800 text-sm sm:text-base">{post.caption}</p>
                            <div className="flex items-center gap-4 mt-2">
                                <button
                                    onClick={() => handleLike(post.id)}
                                    className={`flex items-center gap-1 text-sm font-semibold transition ${post.liked
                                        ? "text-red-500"
                                        : "text-gray-500 hover:text-red-500"
                                        }`}
                                >
                                    <Heart
                                        className="w-5 h-5 cursor-pointer"
                                        fill={post.liked ? "#ef4444" : "none"}
                                        stroke={post.liked ? "#ef4444" : "currentColor"}
                                    />
                                    {post.likes}
                                </button>
                            </div>
                            <div className="mt-2 border-t pt-2">
                                <div className="space-y-2 mb-2">
                                    {visibleComments.map(c => (
                                        <div key={c.id} className="flex items-center gap-2 text-xs sm:text-sm">
                                            <span className="font-semibold text-sky-700">{c.user.name}:</span>
                                            <span>{c.text}</span>
                                        </div>
                                    ))}
                                    {comments.length > 2 && !showAll && (
                                        <button
                                            className="cursor-pointer text-blue-500 hover:underline text-xs sm:text-sm font-medium"
                                            onClick={() =>
                                                setShowAllComments(s => ({ ...s, [post.id]: true }))
                                            }
                                        >
                                            {t("showMore", { count: comments.length - 2 })}
                                        </button>
                                    )}
                                    {comments.length > 2 && showAll && (
                                        <button
                                            className="cursor-pointer text-blue-500 hover:underline text-xs sm:text-sm font-medium"
                                            onClick={() =>
                                                setShowAllComments(s => ({ ...s, [post.id]: false }))
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
                                        value={commentInputs[post.id] || ""}
                                        onChange={e => setCommentInputs(inputs => ({ ...inputs, [post.id]: e.target.value }))}
                                        onKeyDown={e => {
                                            if (e.key === "Enter") handleAddComment(post.id);
                                        }}
                                    />
                                    <button
                                        className="cursor-pointer px-3 py-1 rounded bg-blue-500 text-white text-xs sm:text-sm font-semibold hover:bg-blue-600"
                                        onClick={() => handleAddComment(post.id)}
                                        type="button"
                                    >
                                        {t("send")}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
