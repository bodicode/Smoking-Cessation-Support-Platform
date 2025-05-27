'use client';

import { useState, ChangeEvent, FormEvent, useRef } from 'react';
import Image from 'next/image';
import { X, Undo2, Redo2 } from 'lucide-react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { MenuBar } from '@/components/editor/MenuBar';



export default function BlogCreatePage() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [error, setError] = useState('');

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const editor = useEditor({
        extensions: [StarterKit, Underline],
        content: '',
        onUpdate({ editor }) {
            setContent(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'min-h-[140px] bg-white px-4 py-3 rounded-lg outline-none border border-gray-600 focus:border-[#60C3A4]',
            },
        },
    });

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleRemoveImage = () => {
        setImage(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        // Kiểm tra content có phải toàn dấu cách hoặc rỗng không
        if (!title || !content || !image || content.replace(/<(.|\n)*?>/g, '').trim() === '') {
            setError('Vui lòng nhập đầy đủ thông tin và chọn ảnh!');
            return;
        }
        setError('');
        alert('Gửi blog thành công!');
        setTitle('');
        setContent('');
        setImage(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        editor?.commands.clearContent();
    };

    return (
        <div className="min-h-screen flex flex-col items-center">
            <div className="w-full max-w-3xl rounded-2xl px-4 py-12">
                <form className="space-y-7" onSubmit={handleSubmit}>
                    <div>
                        <input
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className="w-full bg-transparent text-2xl font-semibold border-0 border-b border-gray-500 focus:ring-0 focus:border-[#60C3A4] mb-2"
                            placeholder="Tiêu đề"
                        />
                    </div>
                    <div>
                        <MenuBar editor={editor} />
                        <EditorContent editor={editor} />
                    </div>
                    <div>
                        <label className="block text-gray-400 font-medium mb-2">Ảnh</label>
                        {!imagePreview ? (
                            <div
                                className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer transition"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <div className="flex items-center justify-center mb-2">
                                    <span className="w-10 h-10 flex items-center justify-center rounded-full bg-[#03256C] hover:bg-[#041E42] text-white text-2xl font-bold">+</span>
                                </div>
                                <span className="text-gray-400 text-base">Nhấp vào để chọn ảnh</span>
                                <span className="text-gray-500 text-xs mt-1">Hỗ trợ các file: PNG, JPG, JPEG</span>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageChange}
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
                                >
                                    <X />
                                </button>
                            </div>
                        )}
                    </div>
                    {error && <div className="text-red-400 font-semibold">{error}</div>}
                    <button
                        type="submit"
                        className="w-full cursor-pointer bg-[#03256C] hover:bg-[#041E42] text-white font-semibold py-2 rounded-full mt-4 shadow-lg transition"
                    >
                        Đăng bài
                    </button>
                </form>
            </div>
        </div>
    );
}
