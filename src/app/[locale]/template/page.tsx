"use client";

import { useState } from "react";
import { useQuery, useLazyQuery } from "@apollo/client";
import { CheckCircle, Sparkles, Users, Clock, X, TrendingUp, LayoutTemplate } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { GET_PLAN_TEMPLATES } from "@/graphql/queries/templates/getPlanTemplates";
import { GET_PLAN_STAGE_TEMPLATES_BY_TEMPLATE } from "@/graphql/queries/templates/getPlanStageTemplateByTemplate";
import { StageModal } from "@/components/template/StageModal";
import { BsStarFill, BsStarHalf, BsStar } from "react-icons/bs";
import Loading from "@/components/common/Loading";

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
    const { data, loading, error } = useQuery(GET_PLAN_TEMPLATES);
    const templates = data?.cessationPlanTemplates?.data || [];

    const [openStageModal, setOpenStageModal] = useState(false);
    const [selectedStages, setSelectedStages] = useState<any[]>([]);
    const [getStages, { loading: stageLoading }] = useLazyQuery(GET_PLAN_STAGE_TEMPLATES_BY_TEMPLATE);

    const handleViewStages = async (templateId: string) => {
        setOpenStageModal(true);
        setSelectedStages([]);
        const { data } = await getStages({ variables: { templateId } });
        setSelectedStages(data?.planStageTemplates?.data || []);
    };

    return (
        <div className="max-w-5xl mx-auto py-12 px-4">
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
                            <p className="text-gray-600 mb-2">{tpl.description}</p>
                            <ul className="list-none pl-0 text-gray-700 text-base space-y-1">
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

                            <motion.button
                                type="button"
                                className="cursor-pointer mt-2 bg-gradient-to-r from-sky-500 to-green-400 hover:to-green-600 text-white font-semibold py-2 px-6 rounded-xl shadow-md transition-all"
                                whileHover={{ scale: 1.055, y: -2 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => handleViewStages(tpl.id)}
                            >
                                Xem các giai đoạn
                            </motion.button>
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
                stages={selectedStages}
                loading={stageLoading}
            />
        </div>
    );
}
