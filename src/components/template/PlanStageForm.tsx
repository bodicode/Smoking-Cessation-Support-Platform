import { useState } from "react";
import Loading from "@/components/common/Loading";
import toast from "react-hot-toast";
import { SuccessToast, ErrorToast } from "@/components/common/CustomToast";
import { PlanStageInput } from "@/types/api/planStageTemplate";
import { createPlanStage } from "@/services/planStageTemplate";

const defaultStage: Omit<PlanStageInput, "template_id"> = {
    title: "",
    description: "",
    recommended_actions: "",
    duration_days: 1,
    stage_order: 1,
    max_cigarettes_per_day: undefined,
};

export default function PlanStageForm({ templateId, onCreated }: { templateId: string, onCreated?: () => void }) {
    const [stageForm, setStageForm] = useState({ ...defaultStage });
    const [creating, setCreating] = useState(false);

    const handleStageChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setStageForm((prev) => ({
            ...prev,
            [name]:
                name === "duration_days" || name === "stage_order" || name === "max_cigarettes_per_day"
                    ? Number(value)
                    : value,
        }));
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreating(true);
        try {
            await createPlanStage({
                ...stageForm,
                template_id: templateId,
            });
            toast.custom(<SuccessToast message="Tạo giai đoạn thành công!" />);
            setStageForm({ ...defaultStage });
            if (onCreated) onCreated();
        } catch (err: any) {
            toast.custom(
                <ErrorToast message={err?.message || "Có lỗi xảy ra!"} />
            );
        } finally {
            setCreating(false);
        }
    };

    return (
        <form
            className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-8 rounded-2xl shadow-lg mb-10 border border-gray-100"
            onSubmit={handleCreate}
        >
            <div className="flex flex-col gap-1">
                <label
                    htmlFor="title"
                    className="font-medium text-gray-600 text-sm pl-1 mb-1"
                >
                    Tên giai đoạn <span className="text-red-500">*</span>
                </label>
                <input
                    id="title"
                    className="px-4 py-3 border border-gray-300 rounded-2xl focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition outline-none text-base"
                    name="title"
                    placeholder="Tên giai đoạn"
                    value={stageForm.title}
                    onChange={handleStageChange}
                    required
                />
            </div>
            <div className="flex flex-col gap-1">
                <label
                    htmlFor="duration_days"
                    className="font-medium text-gray-600 text-sm pl-1 mb-1"
                >
                    Số ngày <span className="text-red-500">*</span>
                </label>
                <input
                    id="duration_days"
                    className="px-4 py-3 border border-gray-300 rounded-2xl focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition outline-none text-base"
                    name="duration_days"
                    type="number"
                    min={1}
                    placeholder="Số ngày"
                    value={stageForm.duration_days}
                    onChange={handleStageChange}
                    required
                />
            </div>
            <div className="flex flex-col gap-1">
                <label
                    htmlFor="stage_order"
                    className="font-medium text-gray-600 text-sm pl-1 mb-1"
                >
                    Thứ tự <span className="text-red-500">*</span>
                </label>
                <input
                    id="stage_order"
                    className="px-4 py-3 border border-gray-300 rounded-2xl focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition outline-none text-base"
                    name="stage_order"
                    type="number"
                    min={1}
                    placeholder="Thứ tự"
                    value={stageForm.stage_order}
                    onChange={handleStageChange}
                    required
                />
            </div>
            <div className="flex flex-col gap-1">
                <label
                    htmlFor="max_cigarettes_per_day"
                    className="font-medium text-gray-600 text-sm pl-1 mb-1"
                >
                    Số điếu tối đa/ngày <span className="text-red-500">*</span>
                </label>
                <input
                    id="max_cigarettes_per_day"
                    className="px-4 py-3 border border-gray-300 rounded-2xl focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition outline-none text-base"
                    name="max_cigarettes_per_day"
                    type="number"
                    min={0}
                    placeholder="Số điếu tối đa/ngày"
                    value={stageForm.max_cigarettes_per_day ?? ''}
                    onChange={handleStageChange}
                    required
                />
            </div>
            <div className="flex flex-col gap-1 md:col-span-2">
                <label
                    htmlFor="recommended_actions"
                    className="font-medium text-gray-600 text-sm pl-1 mb-1"
                >
                    Hành động khuyến nghị
                </label>
                <input
                    id="recommended_actions"
                    className="px-4 py-3 border border-gray-300 rounded-2xl focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition outline-none text-base"
                    name="recommended_actions"
                    placeholder="Hành động khuyến nghị"
                    value={stageForm.recommended_actions}
                    onChange={handleStageChange}
                />
            </div>
            <div className="flex flex-col gap-1 md:col-span-3">
                <label
                    htmlFor="description"
                    className="font-medium text-gray-600 text-sm pl-1 mb-1"
                >
                    Mô tả
                </label>
                <textarea
                    id="description"
                    className="px-4 py-3 border border-gray-300 rounded-2xl focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition outline-none text-base resize-none"
                    name="description"
                    rows={2}
                    placeholder="Mô tả"
                    value={stageForm.description}
                    onChange={handleStageChange}
                />
            </div>
            <div className="md:col-span-3 flex gap-3">
                <button
                    type="submit"
                    disabled={creating}
                    className="cursor-pointer w-full flex justify-center items-center gap-2 px-4 py-2 bg-[#03256C] hover:bg-[#041E42] text-white font-semibold rounded-xl shadow transition disabled:opacity-60 h-10 min-h-[40px]"
                >
                    {creating ? <Loading /> : "Thêm giai đoạn"}
                </button>
            </div>
        </form>
    );
} 