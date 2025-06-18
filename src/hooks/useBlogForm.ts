import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createBlog, getBlogBySlug, updateBlog } from "@/services/blogService";

export default function useBlogForm(editor: any) {
    const searchParams = useSearchParams();
    const editSlug = searchParams.get("edit") || undefined;

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [error, setError] = useState("");
    const [blogId, setBlogId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const { blog, loading: loadingBlog } = getBlogBySlug(editSlug);

    useEffect(() => {
        if (editor && blog) {
            setBlogId(blog.id);
            setTitle(blog.title || "");
            setContent(blog.content || "");
            editor.commands.setContent(blog.content || "");
            setImagePreview(blog.cover_image || null);
            setCoverImage(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [blog, editor]);

    const handleImageChange = (file: File | null) => {
        setCoverImage(file);
        if (file) {
            const url = URL.createObjectURL(file);
            setImagePreview(url);
            return () => URL.revokeObjectURL(url);
        }
        setImagePreview(null);
    };

    const handleRemoveImage = () => {
        setCoverImage(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSubmit = (onSuccess: (slug: string) => void, onError: (msg: string) => void) => async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content || content.replace(/<(.|\n)*?>/g, "").trim() === "" || (!coverImage && !imagePreview)) {
            setError("Vui lòng nhập đầy đủ thông tin và chọn ảnh!");
            return;
        }
        setError("");
        setLoading(true);
        try {
            let result;
            if (editSlug && blogId) {
                result = await updateBlog({ id: blogId, title, content, coverImage: coverImage || undefined });
            } else {
                result = await createBlog({ title, content, coverImage });
            }
            if (result?.slug) {
                onSuccess(result.slug);
                return;
            }
            setTitle(""); setContent(""); setCoverImage(null); setImagePreview(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
            editor?.commands.clearContent();
        } catch (err: any) {
            onError(err?.message || "Đã có lỗi xảy ra");
        } finally {
            setLoading(false);
        }
    };

    return {
        editSlug, title, setTitle, content, setContent,
        coverImage, setCoverImage, imagePreview, setImagePreview,
        error, setError, blogId, loading, showConfirmModal,
        setShowConfirmModal, fileInputRef,
        handleImageChange, handleRemoveImage, handleSubmit, loadingBlog,
    };
}
