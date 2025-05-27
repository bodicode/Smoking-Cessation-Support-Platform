import { MenuBarProps } from "@/types/components/menuBar";
import { Redo2, Undo2 } from "lucide-react";

export const MenuBar = ({ editor }: MenuBarProps) => {
    if (!editor) return null;
    return (
        <div className="flex flex-wrap gap-2 border rounded-md bg-gray-50 px-2 py-1 mb-2">
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`px-2 py-1 rounded ${editor.isActive('bold') ? 'bg-blue-200 font-bold' : ''}`}
                aria-label="In đậm"
            >
                <b>B</b>
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`px-2 py-1 rounded ${editor.isActive('italic') ? 'bg-blue-200 font-bold italic' : ''}`}
                aria-label="In nghiêng"
            >
                <i>I</i>
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={`px-2 py-1 rounded ${editor.isActive('underline') ? 'bg-blue-200 font-bold underline' : ''}`}
                aria-label="Gạch chân"
            >
                <u>U</u>
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`px-2 py-1 rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-blue-200 font-bold' : ''}`}
                aria-label="Heading"
            >
                H2
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().undo().run()}
                className="px-2 py-1 rounded"
                aria-label="Hoàn tác"
            >
                <Undo2 size={18} />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().redo().run()}
                className="px-2 py-1 rounded"
                aria-label="Làm lại"
            >
                <Redo2 size={18} />
            </button>
        </div>
    );
}
