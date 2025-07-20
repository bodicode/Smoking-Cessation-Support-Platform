import { motion } from "framer-motion";
import { Dispatch, SetStateAction, FormEvent } from "react";

type AddPostFormProps = {
    newCaption: string;
    setNewCaption: Dispatch<SetStateAction<string>>;
    onCancel: () => void;
    onSubmit: (e: FormEvent) => void;
};

export default function AddPostForm({
    newCaption,
    setNewCaption,
    onSubmit,
    onCancel,
}: AddPostFormProps) {
    return (
        <>
            <motion.div
                className="fixed inset-0 bg-black/40 z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onCancel}
            />
            <motion.form
                onSubmit={onSubmit}
                className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl p-4 sm:p-8 w-[95vw] max-w-lg border-l-4 border-blue-400 space-y-4"
                initial={{ scale: 0.95, opacity: 0, y: 40 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 40 }}
                transition={{ type: "spring", stiffness: 320, damping: 22 }}
            >
                <h2 className="font-bold text-lg sm:text-xl mb-2 text-center">
                    Chia sẻ
                </h2>
                <div>
                    <label className="font-semibold">Nội dung</label>
                    <textarea
                        className="w-full border px-3 py-2 rounded mt-1"
                        value={newCaption}
                        rows={2}
                        placeholder="Nhập nội dung..."
                        onChange={(e) => setNewCaption(e.target.value)}
                        required
                    />
                </div>
                <div className="text-right flex justify-end gap-2">
                    <button
                        type="button"
                        className="cursor-pointer px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                        onClick={onCancel}
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        className="cursor-pointer px-4 py-2 rounded bg-gradient-to-r from-blue-500 to-green-500 text-white font-bold hover:to-green-600"
                    >
                        Đăng
                    </button>
                </div>
            </motion.form>
        </>
    );
}
