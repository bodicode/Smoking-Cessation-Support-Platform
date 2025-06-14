'use client';

import { getPlanTemplateById } from "@/services/templateService";
import Loading from "@/components/common/Loading";
import { useParams } from "next/navigation";
import { Calendar, Users, Star, ListOrdered } from "lucide-react";
import { BsStarFill, BsStarHalf, BsStar } from "react-icons/bs";
import { motion } from "framer-motion";
import useTemplateSelection from "@/hooks/useTemplateSelection";
import ConfirmModal from "@/components/common/ModalConfirm";
import Breadcrumbs from "@/components/common/BreadCrumb";
import useFeedbacks from "@/hooks/useFeedback";
import TemplateFeedbackList from "@/components/feedback/feedbackTemplateList";

function renderStars(rating: number, max = 5) {
    return Array.from({ length: max }, (_, i) => {
        const index = i + 1;
        if (rating >= index) return <BsStarFill key={index} className="text-yellow-400 w-5 h-5" />;
        if (rating >= index - 0.5) return <BsStarHalf key={index} className="text-yellow-400 w-5 h-5" />;
        return <BsStar key={index} className="text-gray-300 w-5 h-5" />;
    });
}

function SuccessCircle({ percent }: { percent: number }) {
    const r = 34, s = 2 * Math.PI * r;
    const value = Math.max(0, Math.min(percent, 100));
    return (
        <motion.svg
            width={80}
            height={80}
            className="mx-auto block"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 170, damping: 14, delay: 0.3 }}
        >
            <circle cx={40} cy={40} r={r} fill="none" stroke="#e0e7ef" strokeWidth={8} />
            <motion.circle
                cx={40}
                cy={40}
                r={r}
                fill="none"
                stroke="#38bdf8"
                strokeWidth={8}
                strokeDasharray={s}
                strokeDashoffset={s - (s * value) / 100}
                strokeLinecap="round"
                initial={{ strokeDashoffset: s }}
                animate={{ strokeDashoffset: s - (s * value) / 100 }}
                transition={{ duration: 1, delay: 0.3, type: "spring" }}
            />
            <text
                x="50%"
                y="54%"
                textAnchor="middle"
                fontSize="1.5rem"
                fill="#0ea5e9"
                fontWeight={700}
                dy=".3em"
            >
                {value.toFixed(0)}%
            </text>
        </motion.svg>
    );
}

const stageVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { delay: i * 0.13 + 0.5, type: "spring", stiffness: 140, damping: 15 },
    }),
};

export default function PlanTemplateDetail() {
    const params = useParams();
    const id = params?.id as string;
    const { template, loading, error } = getPlanTemplateById(id);

    const {
        handleUseTemplate,
        showConfirm,
        loadingCreate,
        reason,
        setReason,
        setIsCustom,
        isCustom,
        setShowConfirm,
        handleConfirmCreate
    } = useTemplateSelection();

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Loading /></div>;
    if (error) return <div>Lỗi: {error.message}</div>;
    if (!template) return <div className="min-h-screen flex items-center justify-center">Không tìm thấy template!</div>;

    return (
        <motion.div
            className="max-w-5xl mx-auto my-10 bg-white rounded-2xl p-8 border border-gray-100"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Breadcrumbs
                items={[
                    { label: "Trang chủ", href: "/" },
                    { label: "Mẫu kế hoạch bỏ thuốc", href: "/template" },
                    { label: `${template.name}`, active: true },
                ]}
            />
            <motion.h1
                className="text-3xl font-extrabold text-center text-sky-700 mb-7 tracking-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.5 }}
            >
                {template.name}
            </motion.h1>

            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6"
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
                }}
            >

                <motion.div
                    className="space-y-3"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25, duration: 0.5, type: "spring" }}
                >
                    <div className="flex items-center gap-3 text-gray-600">
                        <Calendar size={18} className="text-sky-500" />
                        <b>Ngày tạo:</b>
                        <span>
                            {template.created_at
                                ? new Date(template.created_at).toLocaleDateString("vi-VN")
                                : "Không rõ"}
                        </span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                        <ListOrdered size={18} className="text-green-600" />
                        <b>Thời lượng ước tính:</b>
                        <span>{template.estimated_duration_days} ngày</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                        <Star size={18} className="text-yellow-400" />
                        <b>Độ khó:</b>
                        <span className="font-semibold">{template.difficulty_level}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                        <Users size={18} className="text-purple-500" />
                        <b>Coach:</b>
                        <span>{template.coach?.name || "Chưa rõ"}</span>
                    </div>
                </motion.div>

                <motion.div
                    className="flex flex-col items-center gap-2 justify-center"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.32, duration: 0.6, type: "spring" }}
                >
                    <div className="mb-1">
                        <b className="text-gray-700 text-base">Tỉ lệ thành công:</b>
                    </div>
                    <SuccessCircle percent={template.success_rate !== undefined ? template.success_rate * 100 : 0} />
                    <div className="mt-3 text-center">
                        <div className="flex justify-center items-center gap-2">
                            <span className="font-bold text-sky-700 text-lg">Đánh giá:</span>
                            {template.average_rating !== undefined ? (
                                <span className="inline-flex items-center gap-1">
                                    {renderStars(Number(template.average_rating))}
                                    <span className="ml-1 font-semibold text-yellow-600">{template.average_rating}</span>
                                </span>
                            ) : (
                                <span className="text-gray-400">Chưa có</span>
                            )}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                            {template.total_reviews ?? 0} lượt đánh giá
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            <motion.div
                className="mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.43, duration: 0.5 }}
            >
                <b className="text-gray-700">Mô tả:</b>
                <span className="mt-1 ml-2 text-gray-600">{template.description}</span>
            </motion.div>

            <motion.h2
                className="text-xl font-bold text-sky-600 mt-6 mb-3 flex items-center gap-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.47, duration: 0.5 }}
            >
                <ListOrdered size={20} /> Các giai đoạn trong kế hoạch
            </motion.h2>

            <motion.ol
                className="space-y-5"
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.13, delayChildren: 0.6 } },
                }}
            >
                {template.stages?.map((stage: any, i: number) => (
                    <motion.li
                        key={stage.id}
                        className="bg-gradient-to-r from-sky-50 to-green-50 border-l-4 border-sky-400 px-5 py-3 rounded-xl flex flex-col gap-1"
                        custom={i}
                        initial="hidden"
                        animate="visible"
                        variants={stageVariants}
                    >
                        <div className="flex items-center gap-3">
                            <span className="rounded-full bg-sky-400 text-white px-3 py-1 font-bold text-base shadow">
                                {stage.stage_order}
                            </span>
                            <span className="font-bold text-sky-700 text-lg">{stage.title}</span>
                        </div>
                        <div className="text-sm text-gray-600 mt-1 pl-8">{stage.description}</div>
                        <div className="text-xs text-gray-500 mt-1 pl-8">
                            <b>Thời lượng:</b> {stage.duration_days} ngày
                            {stage.recommended_actions && (
                                <> – <b>Khuyến nghị:</b> {stage.recommended_actions}</>
                            )}
                        </div>
                    </motion.li>
                ))}
            </motion.ol>
            <motion.button
                className="cursor-pointer mt-4 w-full text-nowrap bg-gradient-to-r from-green-500 to-sky-400 hover:from-green-600 hover:to-sky-600 text-white font-semibold py-2 px-5 rounded-xl shadow-md"
                whileHover={{ scale: 1.055, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleUseTemplate(template)}
            >
                Sử dụng mẫu này
            </motion.button>

            <TemplateFeedbackList templateId={template.id} />

            <ConfirmModal
                open={showConfirm}
                title="Xác nhận sử dụng mẫu"
                message={loadingCreate ? (
                    <Loading />
                ) : (
                    <div>
                        <p>
                            Bạn có chắc chắn muốn tạo kế hoạch mới từ mẫu <b>{template?.name}</b>?
                        </p>
                        <div className="mt-4">
                            <label className="block font-semibold mb-1 text-left" htmlFor="plan-reason">
                                Lý do bỏ thuốc:
                            </label>
                            <input
                                id="plan-reason"
                                type="text"
                                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Nhập lý do cá nhân..."
                            />
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer mt-4">
                            <input
                                type="checkbox"
                                className="accent-sky-600 w-4 h-4"
                                checked={isCustom}
                                onChange={(e) => setIsCustom(e.target.checked)}
                            />
                            <span className="text-sky-700">Tùy chỉnh kế hoạch</span>
                        </label>
                    </div>
                )}
                onCancel={() => setShowConfirm(false)}
                onConfirm={handleConfirmCreate}
            />
        </motion.div>
    );
}
