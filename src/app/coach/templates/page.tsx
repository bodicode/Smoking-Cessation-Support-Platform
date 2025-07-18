'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
    Plus, Edit, Clock, Zap, Star, ChartNoAxesColumnDecreasing, ChevronDown, ChevronUp, List, Trash2
} from "lucide-react";
import Loading from "@/components/common/Loading";
import Pagination from "@/components/common/Pagination";
import { getPlanTemplates, removePlanTemplate } from "@/services/templateService";
import { ErrorToast, SuccessToast } from "@/components/common/CustomToast";
import ConfirmModal from "@/components/common/ModalConfirm";
import { StageList } from "@/components/coach/StageList";
import { useAuth } from "@/hooks/useAuth";

const TEMPLATES_PER_PAGE = 4;

export default function CoachTemplatesPage() {
    const [page, setPage] = useState(1);
    const { user } = useAuth();

    const authorId = user?.id;

    const {
        templates,
        total,
        totalPages,
        hasNext,
        loading,
        error,
        refetch
    } = getPlanTemplates({
        page, limit: TEMPLATES_PER_PAGE, orderBy: "created_at", sortOrder: "desc", filters: user.id ? { coachId: authorId } : undefined,
    });

    const [openTemplateIds, setOpenTemplateIds] = useState<string[]>([]);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [page]);

    const handleDropdown = (id: string) => {
        setOpenTemplateIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        setDeleting(true);
        try {
            await removePlanTemplate(deleteId);
            toast.custom(<SuccessToast message="Xóa thành công!" />);
            refetch();
        } catch (err: any) {
            toast.custom(<ErrorToast message={err?.message || "Có lỗi xảy ra"} />);
        } finally {
            setDeleting(false);
            setDeleteId(null);
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-sky-800">Quản lý Kế hoạch</h1>
                <Link
                    href="/coach/templates/new"
                    className="flex items-center gap-2 bg-gradient-to-r from-sky-500 to-green-400 hover:to-green-600 text-white font-semibold py-2 px-5 rounded-xl shadow transition"
                >
                    Tạo template mới
                </Link>
            </div>
            {loading ? (
                <div className="py-12 text-center text-sky-600 font-semibold"><Loading /></div>
            ) : error ? (
                <div className="py-12 text-center text-red-600 font-semibold">Lỗi tải kế hoạch.</div>
            ) : templates.length === 0 ? (
                <div className="py-24 text-center text-gray-500">
                    Chưa có kế hoạch nào. Nhấn "Tạo template mới" để bắt đầu!
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                        {templates.map((tpl: any) => (
                            <div
                                key={tpl.id}
                                className="bg-white rounded-2xl shadow-md p-7 flex flex-col gap-2 border-l-8 border-sky-200 hover:border-sky-500 transition-all duration-200 hover:shadow-lg"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <h2 className="text-xl font-extrabold text-sky-700">{tpl.name}</h2>

                                    <div className="flex items-center gap-5">
                                        <Link
                                            href={`/coach/templates/new?edit=${tpl.id}`}
                                            className="text-sky-600 hover:text-sky-800 font-medium inline-flex items-center gap-1"
                                        >
                                            <Edit className="w-4 h-4" /> Sửa
                                        </Link>

                                        <button
                                            className="cursor-pointer text-red-600 hover:text-red-800 font-medium inline-flex items-center gap-1"
                                            onClick={() => setDeleteId(tpl.id)}
                                        >
                                            <Trash2 className="w-4 h-4" /> Xóa
                                        </button>
                                    </div>
                                </div>
                                <p className="text-gray-600 mb-3 truncate">{tpl.description}</p>
                                <div className="flex flex-col gap-2 text-base text-gray-700 mt-3">
                                    <span className="flex items-center gap-2">
                                        <Clock size="16px" />
                                        Thời lượng: <b>{tpl.estimated_duration_days} ngày</b>
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <Zap size="16px" className='text-red-400' />
                                        Độ khó: <b>{tpl.difficulty_level}</b>
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <Star size="16px" className='text-yellow-600' />
                                        Đánh giá: <b>{tpl.average_rating ?? "0"}</b>
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <ChartNoAxesColumnDecreasing size="16px" />
                                        Lượt đánh giá: <b>{tpl.total_reviews ?? "0"}</b>
                                    </span>
                                </div>
                                {/* Dropdown */}
                                <button
                                    className={`cursor-pointer flex items-center justify-between gap-2 mt-4 py-2 px-4 rounded-lg bg-gradient-to-r from-sky-50 to-green-50 hover:bg-sky-100 text-sky-700 font-semibold border border-sky-100 shadow transition
                                        ${openTemplateIds.includes(tpl.id) ? "ring-2 ring-sky-300" : ""}`
                                    }
                                    onClick={() => handleDropdown(tpl.id)}
                                >
                                    <div className='flex items-center gap-x-2'>
                                        <List className="w-5 h-5" />
                                        Xem các giai đoạn
                                    </div>
                                    {openTemplateIds.includes(tpl.id) ? <ChevronUp /> : <ChevronDown />}
                                </button>
                                {openTemplateIds.includes(tpl.id) && (
                                    <div className="mt-2 animate-fade-in-down">
                                        <StageList templateId={tpl.id} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="mt-10">
                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            onPageChange={setPage}
                            hasNext={hasNext}
                        />
                    </div>
                </>
            )}

            <ConfirmModal
                open={!!deleteId}
                title="Xác nhận xóa"
                message="Bạn có chắc chắn muốn xóa template này không?"
                onCancel={() => setDeleteId(null)}
                onConfirm={handleDelete}
            />
        </div>
    );
}
