"use client";

import { useEffect } from "react";
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
import toast from "react-hot-toast";
import { ErrorToast, SuccessToast } from "@/components/common/CustomToast";
import useTemplateSelection from "@/hooks/useTemplateSelection";

const cardVariants = {
    hidden: { opacity: 0, y: 32, scale: 0.97 },
    visible: (i = 1) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { delay: i * 0.13, type: "spring", stiffness: 170, damping: 17 },
    }),
};

function renderStars(rating: number, max = 5) {
    return Array.from({ length: max }, (_, i) => {
        const index = i + 1;
        if (rating >= index) return <BsStarFill key={index} className="text-yellow-400 w-5 h-5" />;
        if (rating >= index - 0.5) return <BsStarHalf key={index} className="text-yellow-400 w-5 h-5" />;
        return <BsStar key={index} className="text-gray-300 w-5 h-5" />;
    });
}

export default function PlanTemplatesPage() {
    const { templates, loading, error } = getPlanTemplates();
    const { fetchStages, stages, loading: stageLoading } = useLazyPlanStages();

    const {
        openStageModal,
        setOpenStageModal,
        showConfirm,
        setShowConfirm,
        selectedTemplate,
        handleUseTemplate,
        handleConfirmCreate,
        loadingCreate,
        reason,
        setReason,
        isCustom,
        setIsCustom,
        successMsg,
        errorMsg,
        setSuccessMsg,
        setErrorMsg,
    } = useTemplateSelection();

    useEffect(() => {
        if (successMsg) {
            toast.custom(<SuccessToast message={successMsg} />);
            setSuccessMsg(null);
        }
        if (errorMsg) {
            toast.custom(<ErrorToast message={errorMsg} />);
            setErrorMsg(null);
        }
    }, [successMsg, errorMsg, setSuccessMsg, setErrorMsg]);

    const handleViewStages = (templateId: string) => {
        setOpenStageModal(true);
        fetchStages({ variables: { templateId } });
    };

    return (
        <div className="max-w-5xl mx-auto py-12 px-4">
            <Breadcrumbs
                items={[
                    { label: "Trang chủ", href: "/" },
                    { label: "Mẫu kế hoạch bỏ thuốc", active: true },
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
                            <ul className="text-gray-700 space-y-1">
                                <li><b>Mức độ:</b> {translateDifficulty(tpl.difficulty_level)}</li>
                                <li><b>Đánh giá trung bình:</b> {tpl.average_rating ? (
                                    <span className="inline-flex items-center gap-1">
                                        {renderStars(Number(tpl.average_rating))}
                                        <span className="ml-1 font-semibold">{tpl.average_rating}</span>
                                    </span>
                                ) : "Chưa có"}</li>
                                <li><b>Số lượt đánh giá:</b> <span className="text-sky-600 font-bold">{tpl.total_reviews}</span></li>
                                <li><b>Tỉ lệ thành công:</b> {tpl.success_rate != null ? (
                                    <span className="inline-flex items-center gap-1">
                                        {renderStars(tpl.success_rate / 20)}
                                        <span className="ml-1 text-blue-600 font-semibold">{tpl.success_rate}%</span>
                                    </span>
                                ) : "?"}</li>
                            </ul>
                            <div className="flex justify-center gap-3 mt-3">
                                <motion.button
                                    className="bg-gradient-to-r from-green-500 to-sky-400 hover:from-green-600 hover:to-sky-600 text-white font-semibold py-2 px-5 rounded-xl shadow-md"
                                    whileHover={{ scale: 1.055, y: -2 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() => handleUseTemplate(tpl)}
                                >
                                    Sử dụng mẫu này
                                </motion.button>
                                <motion.button
                                    className="bg-white border border-sky-300 text-sky-600 hover:bg-sky-50 py-2 px-5 rounded-xl font-semibold shadow-sm"
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
                <Link href="/plan" className="text-blue-600 underline hover:text-blue-800 font-medium text-lg">
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
                message={loadingCreate ? (
                    <Loading />
                ) : (
                    <div>
                        <p>
                            Bạn có chắc chắn muốn tạo kế hoạch mới từ mẫu <b>{selectedTemplate?.name}</b>?
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
        </div>
    );
}
