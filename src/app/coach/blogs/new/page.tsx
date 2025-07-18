"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import Loading from "@/components/common/Loading";
import ConfirmModal from "@/components/common/ModalConfirm";
import { SuccessToast, ErrorToast } from "@/components/common/CustomToast";
import { MenuBar } from "@/components/editor/MenuBar";
import useRequireRole from "@/hooks/useRequireRole";
import useBlogForm from "@/hooks/useBlogForm";
import { FormEvent } from "react";

export default function BlogCreatePage() {
  useRequireRole("COACH");
  const router = useRouter();

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

  const {
    editSlug, title, setTitle, setContent,
    imagePreview, error,
    loading, showConfirmModal, setShowConfirmModal, fileInputRef,
    handleImageChange, handleRemoveImage, handleSubmit, loadingBlog
  } = useBlogForm(editor);

  const handleSuccess = (slug: string) => {
    toast.custom(
      <SuccessToast message={editSlug ? "Cập nhật thành công!" : "Đăng blog thành công!"} />
    );
    router.push(`/coach/blogs/${slug}`);
  };

  const handleError = (msg: string) => {
    toast.custom(<ErrorToast message={msg} />);
  };

  const handleConfirmUpdate = () => {
    setShowConfirmModal(false);
    handleSubmit(handleSuccess, handleError)(new Event("submit") as unknown as FormEvent);
  };

  const handleCancelUpdate = () => {
    setShowConfirmModal(false);
  };

  if (loading || loadingBlog) {
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
        <form className="space-y-7" onSubmit={handleSubmit(handleSuccess, handleError)}>
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
                <span className="text-gray-400 text-base">Nhấp vào để chọn ảnh</span>
                <span className="text-gray-500 text-xs mt-1">Hỗ trợ các file: PNG, JPG, JPEG</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
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
            className={`w-full cursor-pointer bg-[#03256C] hover:bg-[#041E42] text-white font-semibold py-2 rounded-full mt-4 shadow-lg transition ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={loading}
          >
            {loading ? <Loading /> : editSlug ? "Cập nhật bài viết" : "Đăng bài"}
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