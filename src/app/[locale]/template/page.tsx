"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LayoutTemplate } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { BsStarFill, BsStarHalf, BsStar } from "react-icons/bs";
import Loading from "@/components/common/Loading";
import Breadcrumbs from "@/components/common/BreadCrumb";
import { getPlanTemplates } from "@/services/templateService";
import { useLazyPlanStages } from "@/services/planStageTemplate";
import { StageModal } from "@/components/template/StageModal";
import { translateDifficulty } from "@/utils";
import ConfirmModal from "@/components/common/ModalConfirm";
import { CreateCessationPlanInput } from "@/types/api/cessationPlan";
import toast from "react-hot-toast";
import { ErrorToast, SuccessToast } from "@/components/common/CustomToast";
import { createCessationPlan } from "@/services/cessationPlanService";

const cardVariants = {
    hidden: { opacity: 0, y: 32, scale: 0.97 },
    visible: (i = 1) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { delay: i * 0.13, type: "spring", stiffness: 170, damping: 17 }
    })
};

function renderStars(rating: number, max = 5) {
    const stars = [];
    for (let i = 1; i <= max; i++) {
        if (rating >= i) {
            stars.push(<BsStarFill key={i} className="inline text-yellow-400 w-5 h-5" />);
        } else if (rating >= i - 0.5) {
            stars.push(<BsStarHalf key={i} className="inline text-yellow-400 w-5 h-5" />);
        } else {
            stars.push(<BsStar key={i} className="inline text-gray-300 w-5 h-5" />);
        }
    }
    return stars;
}

export default function PlanTemplatesPage() {
    const { templates, loading, error } = getPlanTemplates();
    const { fetchStages, stages, loading: stageLoading } = useLazyPlanStages();

    const [openStageModal, setOpenStageModal] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null);
    const [loadingCreate, setLoadingCreate] = useState(false);
    const [reason, setReason] = useState("");
    const [isCustom, setIsCustom] = useState(false);

    const router = useRouter();

    const handleViewStages = (templateId: string) => {
        setOpenStageModal(true);
        fetchStages({ variables: { templateId } });
    };

    const handleUseTemplate = (tpl: any) => {
        setSelectedTemplate(tpl);
        setReason("");
        setIsCustom(false);
        setShowConfirm(true);
    };

    const handleConfirmCreate = async () => {
        if (!selectedTemplate) return;
        if (!reason || !reason.trim()) {
            toast.custom(<ErrorToast message="Vui lòng nhập lý do bạn muốn bỏ thuốc." />);
            return;
        }
        setLoadingCreate(true);
        try {
            const today = new Date();
            const target = new Date();
            target.setDate(today.getDate() + (selectedTemplate.estimated_duration_days || 30));
            const input: CreateCessationPlanInput = {
                template_id: selectedTemplate.id,
                is_custom: isCustom,
                start_date: today.toISOString().slice(0, 10),
                target_date: target.toISOString().slice(0, 10),
                reason: reason.trim(),
            };

            await createCessationPlan(input);

            setShowConfirm(false);
            setSelectedTemplate(null);
            router.push(`/plan/my-plan`);
            toast.custom(<SuccessToast message="Tạo kế hoạch thành công!" />);
        } catch (err: any) {
            alert(err.message || "Có lỗi khi tạo kế hoạch");
        } finally {
            setLoadingCreate(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto py-12 px-4">
            <Breadcrumbs
                items={[
                    { label: "Trang chủ", href: "/" },
                    { label: "Mẫu kế hoạch bỏ thuốc", active: true }
                ]}
            />
            <motion.h1
                className="text-4xl font-extrabold text-center mb-7 bg-gradient-to-r from-sky-600 to-green-400 text-transparent bg-clip-text"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                Danh sách mẫu kế hoạch bỏ thuốc
            </motion.h1>
            <motion.p
                className="text-center text-gray-500 mb-12 text-lg"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
            >
                Chọn một kế hoạch bên dưới để xem chi tiết các giai đoạn và bắt đầu hành trình bỏ thuốc của bạn!
            </motion.p>
            {loading ? (
                <Loading />
            ) : error ? (
                <div className="text-center text-red-600 py-10">Lỗi tải dữ liệu</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {templates.map((tpl: any, idx: number) => (
                        <motion.div
                            key={tpl.id}
                            custom={idx}
                            initial="hidden"
                            animate="visible"
                            variants={cardVariants}
                            className="bg-gradient-to-br from-sky-50 to-green-50 shadow-xl rounded-2xl p-7 flex flex-col gap-3 border-t-4 border-transparent hover:border-sky-400 transition-all"
                            whileHover={{
                                y: -7,
                                scale: 1.033,
                                boxShadow: "0 10px 38px 0 #60C3A428",
                            }}
                        >
                            <div className="flex items-center gap-4 mb-3">
                                <LayoutTemplate className="text-green-400 drop-shadow-glow" />
                                <span className="font-bold text-xl text-sky-800">{tpl.name}</span>
                            </div>
                            <p className="text-gray-600 mb-2 h-14">Mô tả: {tpl.description}</p>
                            <ul className="list-none pl-0 text-gray-700 text-base space-y-1">
                                <li>
                                    <span className="font-semibold text-gray-600">Mức độ:</span>{" "}
                                    <span>{translateDifficulty(tpl.difficulty_level)}</span>
                                </li>
                                <li>
                                    <span className="font-semibold text-gray-600">Đánh giá trung bình:</span>{" "}
                                    {tpl.average_rating
                                        ? (
                                            <span className="inline-flex items-center gap-1">
                                                {renderStars(Number(tpl.average_rating))}
                                                <span className="ml-1 text-gray-600 font-semibold">{tpl.average_rating}</span>
                                            </span>
                                        )
                                        : "Chưa có"}
                                </li>
                                <li>
                                    <span className="font-semibold text-gray-600">Số lượt đánh giá:</span>{" "}
                                    <span className="text-sky-600 font-bold">{tpl.total_reviews}</span>
                                </li>
                                <li className="flex items-center gap-x-1.5">
                                    <span className="font-semibold text-gray-600">Tỉ lệ thành công:</span>{" "}
                                    {tpl.success_rate !== null && tpl.success_rate !== undefined
                                        ? (
                                            <span className="inline-flex items-center gap-1">
                                                {renderStars(Number(tpl.success_rate) / 20)}
                                                <span className="ml-1 text-blue-600 font-semibold">{tpl.success_rate}%</span>
                                            </span>
                                        )
                                        : "?"}
                                </li>
                            </ul>
                            <div className="flex justify-center gap-3 mt-3">
                                <motion.button
                                    type="button"
                                    className="bg-gradient-to-r from-green-500 to-sky-400 hover:from-green-600 hover:to-sky-600 text-white font-semibold py-2 px-5 rounded-xl shadow-md transition-all text-nowrap cursor-pointer"
                                    whileHover={{ scale: 1.055, y: -2 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() => handleUseTemplate(tpl)}
                                >
                                    Sử dụng mẫu này
                                </motion.button>
                                <motion.button
                                    type="button"
                                    className="bg-white border border-sky-300 text-sky-600 hover:bg-sky-50 py-2 px-5 rounded-xl font-semibold transition-all shadow-sm text-nowrap cursor-pointer"
                                    whileHover={{ scale: 1.035 }}
                                    onClick={() => handleViewStages(tpl.id)}
                                >
                                    Xem các giai đoạn mẫu
                                </motion.button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
            <div className="text-center mt-10">
                <Link
                    href="/plan"
                    className="text-blue-600 underline hover:text-blue-800 font-medium text-lg"
                >
                    &larr; Quay lại trang kế hoạch
                </Link>
            </div>
            <StageModal
                open={openStageModal}
                onClose={() => setOpenStageModal(false)}
                stages={stages}
                loading={stageLoading}
            />

            <ConfirmModal
                open={showConfirm}
                title="Xác nhận sử dụng mẫu"
                message={
                    loadingCreate ? <Loading /> :
                        <div>
                            <div>
                                Bạn có chắc chắn muốn tạo kế hoạch mới từ mẫu <b>{selectedTemplate?.name}</b>?
                            </div>
                            <div className="mt-4">
                                <label className="block font-semibold mb-1 text-left" htmlFor="plan-reason">Lý do bỏ thuốc:</label>
                                <input
                                    id="plan-reason"
                                    type="text"
                                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
                                    value={reason}
                                    onChange={e => setReason(e.target.value)}
                                    placeholder="Nhập lý do cá nhân..."
                                />
                            </div>
                            <label className="flex items-center gap-2 cursor-pointer select-none mt-4">
                                <input
                                    type="checkbox"
                                    className="accent-sky-600 w-4 h-4"
                                    checked={isCustom}
                                    onChange={e => setIsCustom(e.target.checked)}
                                />
                                <span className="text-sky-700">Tùy chỉnh kế hoạch</span>
                            </label>
                        </div>
                }
                onCancel={() => setShowConfirm(false)}
                onConfirm={handleConfirmCreate}
            >
            </ConfirmModal>
        </div>
    );
}
