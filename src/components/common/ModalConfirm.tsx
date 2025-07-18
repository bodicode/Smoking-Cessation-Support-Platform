"use client";

import { motion, AnimatePresence } from "framer-motion";

export interface ConfirmModalProps {
  open: boolean;
  title?: string;
  message?: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  children?: React.ReactNode;
}

export default function ConfirmModal({
  open,
  title = "Xác nhận",
  message = "Bạn có chắc chắn muốn thực hiện hành động này?",
  onConfirm,
  onCancel,
  loading = false,
  children
}: ConfirmModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-white/20 backdrop-blur-[3px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 text-center"
            initial={{ scale: 0.8, y: 40 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 40 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            <div className="font-bold text-lg mb-2">{title}</div>
            <div className="mb-6 text-gray-700">{message}</div>
            {children}
            <div className="flex gap-3 justify-center">
              <button
                className="cursor-pointer px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                onClick={onCancel}
                disabled={loading}
              >
                Hủy
              </button>
              <button
                className="cursor-pointer px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition flex items-center justify-center min-w-[90px]"
                onClick={onConfirm}
                disabled={loading}
              >
                {loading ? (
                  <span className="loader border-2 border-t-2 border-gray-200 border-t-white rounded-full w-5 h-5 animate-spin"></span>
                ) : (
                  "Xác nhận"
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
