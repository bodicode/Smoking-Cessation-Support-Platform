"use client";

import { useState, ChangeEvent, FormEvent, useRef, useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { MenuBar } from "@/components/editor/MenuBar";
import useRequireRole from "@/hooks/useRequireRole";
import { createBlog, getBlogBySlug, updateBlog } from "@/services/blogService";
import { useRouter, useSearchParams } from "next/navigation";
import Loading from "@/components/common/Loading";
import ConfirmModal from "@/components/common/ModalConfirm";
import toast from "react-hot-toast";
import { ErrorToast, SuccessToast } from "@/components/common/CustomToast";

export default function BlogCreatePage() {
  useRequireRole("COACH");
  const router = useRouter();
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

  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: "",
    onUpdate({ editor }) {
      setContent(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "min-h-[140px] bg-white px-4 py-3 rounded-lg outline-none border border-gray-600 focus:border-[#60C3A4]",
      },
    },
  });

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

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setCoverImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (
      !title.trim() ||
      !content ||
      content.replace(/<(.|\n)*?>/g, "").trim() === "" ||
      (!coverImage && !imagePreview)
    ) {
      setError("Vui lòng nhập đầy đủ thông tin và chọn ảnh!");
      return;
    }
    setError("");

    if (editSlug && blogId) {
      setShowConfirmModal(true);
      return;
    }
    submitBlog();
  };

  const submitBlog = async () => {
    setLoading(true);
    try {
      let result;
      if (editSlug && blogId) {
        result = await updateBlog({
          id: blogId,
          title,
          content,
          coverImage: coverImage || undefined,
        });
      } else {
        result = await createBlog({ title, content, coverImage });
      }
      if (result?.slug) {
        toast.custom(<SuccessToast message={editSlug ? "Cập nhật thành công!" : "Đăng blog thành công!"} />);
        router.push(`/blog/${result.slug}`);
        return;
      }
      setTitle("");
      setContent("");
      setCoverImage(null);
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      editor?.commands.clearContent();
    } catch (err: any) {
      toast.custom(<ErrorToast message={err?.message} />);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmUpdate = () => {
    setShowConfirmModal(false);
    submitBlog();
  };

  const handleCancelUpdate = () => {
    setShowConfirmModal(false);
  };

  if (loadingBlog || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="w-full max-w-3xl rounded-2xl px-4 py-12">
        <h2 className="text-2xl font-bold mb-6 text-[#03256C]">
          {editSlug ? "Chỉnh sửa blog" : "Tạo blog mới"}
        </h2>
        <form className="space-y-7" onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-transparent text-2xl font-semibold border-0 border-b border-gray-500 focus:ring-0 focus:border-[#60C3A4] mb-2"
              placeholder="Tiêu đề"
              disabled={loading}
            />
          </div>
          <div>
            <MenuBar editor={editor} />
            <EditorContent editor={editor} className="prose prose-blue mb-6" />
          </div>
          <div>
            <label className="block text-gray-400 font-medium mb-2">Ảnh</label>
            {!imagePreview ? (
              <div
                className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer transition"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="flex items-center justify-center mb-2">
                  <span className="w-10 h-10 flex items-center justify-center rounded-full bg-[#03256C] hover:bg-[#041E42] text-white text-2xl font-bold">
                    +
                  </span>
                </div>
                <span className="text-gray-400 text-base">
                  Nhấp vào để chọn ảnh
                </span>
                <span className="text-gray-500 text-xs mt-1">
                  Hỗ trợ các file: PNG, JPG, JPEG
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                  disabled={loading}
                />
              </div>
            ) : (
              <div className="relative w-full flex flex-col items-center">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  width={400}
                  height={240}
                  className="rounded-lg object-cover shadow-md border border-[#232733]"
                />
                <button
                  type="button"
                  className="absolute top-2 right-6 bg-gray-400 bg-opacity-80 hover:bg-gray-500 text-white rounded-full px-1 py-1 text-xs font-semibold shadow-md transition cursor-pointer"
                  onClick={handleRemoveImage}
                  disabled={loading}
                >
                  <X />
                </button>
              </div>
            )}
          </div>
          {error && <div className="text-red-400 font-semibold">{error}</div>}
          <button
            type="submit"
            className={`w-full cursor-pointer bg-[#03256C] hover:bg-[#041E42] text-white font-semibold py-2 rounded-full mt-4 shadow-lg transition ${loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            disabled={loading}
          >
            {loading
              ? editSlug
                ? <Loading />
                : <Loading />
              : editSlug
                ? "Cập nhật bài viết"
                : "Đăng bài"}
          </button>
        </form>
      </div>

      <ConfirmModal
        open={showConfirmModal}
        title="Xác nhận cập nhật"
        message="Bạn có chắc chắn muốn cập nhật bài viết này không?"
        onConfirm={handleConfirmUpdate}
        onCancel={handleCancelUpdate}
      />

    </div>
  );
}
