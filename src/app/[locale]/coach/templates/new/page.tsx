'use client';

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { createPlanTemplate, getPlanTemplateById, updatePlanTemplate } from "@/services/templateService";
import { ErrorToast, SuccessToast } from "@/components/common/CustomToast";
import Loading from "@/components/common/Loading";
import ConfirmModal from "@/components/common/ModalConfirm";
import { PlanTemplateUpdateInput } from "@/types/api/cessationPlanTemplate";

const defaultForm = {
    name: "",
    description: "",
    difficulty_level: "" as "" | "EASY" | "MEDIUM" | "HARD",
    estimated_duration_days: ""
};

export default function PlanTemplateFormPage() {
    const router = useRouter();
    const params = useSearchParams();
    const editId = params.get("edit");

    const { template, loading: loadingTemplate } = getPlanTemplateById(editId ?? undefined);
    const [form, setForm] = useState(defaultForm);
    const [loading, setLoading] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    useEffect(() => {
        if (editId && template && template.name) {
            setForm({
                name: template.name || "",
                description: template.description || "",
                difficulty_level: template.difficulty_level || "",
                estimated_duration_days: template.estimated_duration_days?.toString() || ""
            });
        }
    }, [editId, template]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: name === "estimated_duration_days"
                ? Number(value)
                : name === "difficulty_level"
                    ? value as "EASY" | "MEDIUM" | "HARD"
                    : value,
        }));
    };

    const handleConfirmSubmit = async () => {
        setLoading(true);
        const input = {
            ...form,
            difficulty_level: form.difficulty_level as "EASY" | "MEDIUM" | "HARD",
            estimated_duration_days: Number(form.estimated_duration_days)
        };
        try {
            if (editId) {
                await updatePlanTemplate({ id: editId, ...input } as PlanTemplateUpdateInput);
                toast.custom(<SuccessToast message="Cập nhật thành công!" />);
            } else {
                await createPlanTemplate(input);
                toast.custom(<SuccessToast message="Tạo mẫu thành công!" />);
            }
            setTimeout(() => {
                router.push('/coach/templates');
                router.refresh();
            }, 1000);
        } catch (err: any) {
            toast.custom(<ErrorToast message={err?.message || "Có lỗi xảy ra"} />);
        } finally {
            setLoading(false);
        }
    };

    const handleShowConfirm = (e: any) => {
        e.preventDefault();
        if (editId) {
            setShowConfirmModal(true);
        } else {
            handleConfirmSubmit();
        }
    };

    if (loadingTemplate && editId) {
        return (
            <div className="w-full h-48 flex justify-center items-center">
                <Loading />
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto mt-12">
            <div className="bg-white rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-center mb-6 text-[#03256C] tracking-tight">
                    {editId ? "Chỉnh sửa mẫu kế hoạch" : "Tạo mẫu kế hoạch bỏ thuốc mới"}
                </h2>
                <form onSubmit={handleShowConfirm} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-1">
                            Tên mẫu kế hoạch
                        </label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-xl border border-zinc-300 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base transition"
                            placeholder="Nhập tên mẫu"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-1">
                            Mô tả
                        </label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-xl border border-zinc-300 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base transition"
                            placeholder="Mô tả kế hoạch"
                            rows={3}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-1">
                            Mức độ khó
                        </label>
                        <select
                            name="difficulty_level"
                            value={form.difficulty_level}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-xl border border-zinc-300 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base transition"
                            required
                        >
                            <option value="">Chọn mức độ</option>
                            <option value="EASY">Dễ</option>
                            <option value="MEDIUM">Trung bình</option>
                            <option value="HARD">Khó</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-1">
                            Số ngày dự kiến
                        </label>
                        <input
                            name="estimated_duration_days"
                            type="number"
                            min="1"
                            value={form.estimated_duration_days}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-xl border border-zinc-300 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base transition"
                            placeholder="Nhập số ngày"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="cursor-pointer w-full flex justify-center items-center gap-2 px-4 py-2 bg-[#03256C] hover:bg-[#041E42] text-white font-semibold rounded-xl shadow transition disabled:opacity-60 h-10 min-h-[40px]"
                    >
                        {loading ? <Loading /> : (editId ? "Lưu thay đổi" : "Tạo mới")}
                    </button>
                </form>
            </div>
            <ConfirmModal
                open={showConfirmModal}
                title="Xác nhận cập nhật"
                message="Bạn có chắc chắn muốn cập nhật mẫu kế hoạch này?"
                onCancel={() => setShowConfirmModal(false)}
                onConfirm={() => {
                    setShowConfirmModal(false);
                    handleConfirmSubmit();
                }}
            />
        </div>
    );
}
