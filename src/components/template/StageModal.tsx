import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, X } from "lucide-react";

export function StageModal({ open, onClose, stages, loading }: {
    open: boolean,
    onClose: () => void,
    stages: any[],
    loading: boolean
}) {
    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
                >
                    <motion.div
                        initial={{ scale: 0.92, opacity: 0, y: 30 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.92, opacity: 0, y: 30 }}
                        transition={{ type: "spring", stiffness: 320, damping: 28 }}
                        className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-7 relative border border-sky-100"
                    >
                        <button
                            onClick={onClose}
                            className="absolute cursor-pointer right-4 top-4 bg-gray-100 hover:bg-gray-300 rounded-full p-1 shadow"
                            aria-label="Đóng"
                        >
                            <X className="w-5 h-5 text-gray-600" />
                        </button>
                        <div className="flex items-center gap-2 mb-3">
                            <TrendingUp className="w-6 h-6 text-sky-400" />
                            <h2 className="text-xl font-bold text-sky-800">Các giai đoạn của kế hoạch</h2>
                        </div>
                        {loading ? (
                            <div className="flex justify-center items-center py-10">
                                <svg className="w-7 h-7 animate-spin text-sky-400" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-80" d="M22 12A10 10 0 0112 22" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                                </svg>
                                <span className="ml-3 text-sky-700 font-medium">Đang tải...</span>
                            </div>
                        ) : stages.length === 0 ? (
                            <div className="text-gray-500 italic py-10">Chưa có giai đoạn nào cho kế hoạch này.</div>
                        ) : (
                            <ol className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 mt-3">
                                {stages.map((stage, idx) => (
                                    <motion.li
                                        key={stage.id}
                                        initial={{ opacity: 0, x: 30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.08 * idx }}
                                        className="bg-gradient-to-r from-sky-50 to-green-50 border-l-4 border-sky-300 rounded-lg shadow-sm px-5 py-3"
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-semibold text-base text-sky-700">
                                                Giai đoạn {stage.stage_order}: {stage.title}
                                            </span>
                                            <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium shadow-sm">
                                                {stage.duration_days} ngày
                                            </span>
                                        </div>
                                        <div className="text-gray-700 text-sm mb-1">{stage.description}</div>
                                        <div className="text-xs text-gray-500 italic">
                                            <span className="font-semibold text-sky-600">Khuyến nghị:</span> {stage.recommended_actions}
                                        </div>
                                    </motion.li>
                                ))}
                            </ol>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}