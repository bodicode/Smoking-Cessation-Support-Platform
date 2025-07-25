"use client";
import { useState, useRef } from "react";
import Loading from "@/components/common/Loading";
import toast from "react-hot-toast";
import { SuccessToast, ErrorToast } from "@/components/common/CustomToast";
import { PlanStageInput } from "@/types/api/planStageTemplate";
import {
    createPlanStage,
    usePlanStages,
    updatePlanStage,
    deletePlanStage,
} from "@/services/planStageTemplate";
import { Activity, Pencil, Trash2, XCircle } from "lucide-react";
import ConfirmModal from "@/components/common/ModalConfirm";

interface Props {
    templateId: string;
}

const defaultStage: Omit<PlanStageInput, "template_id"> = {
    title: "",
    description: "",
    recommended_actions: "",
    duration_days: 1,
    stage_order: 1,
    max_cigarettes_per_day: undefined,
};

export default function PlanStageManage({ templateId }: Props) {
    const { stages, loading, error, refetch } = usePlanStages(templateId);
    const [stageForm, setStageForm] = useState({ ...defaultStage });
    const [creating, setCreating] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [confirmModal, setConfirmModal] = useState(false);
    const [confirmAction, setConfirmAction] = useState<"delete" | "update" | null>(null);
    const [selectedStage, setSelectedStage] = useState<any>(null);
    const formRef = useRef<HTMLFormElement>(null);

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

    const handleStageSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (editingId) {
            setConfirmAction("update");
            setConfirmModal(true);
        } else {
            await handleCreate();
        }
    };

    const handleCreate = async () => {
        setCreating(true);
        try {
            await createPlanStage({
                ...stageForm,
                template_id: templateId,
            });
            toast.custom(<SuccessToast message="Tạo giai đoạn thành công!" />);
            setStageForm({ ...defaultStage });
            setEditingId(null);
            refetch();
        } catch (err: any) {
            toast.custom(
                <ErrorToast message={err?.message || "Có lỗi xảy ra!"} />
            );
        } finally {
            setCreating(false);
        }
    };

    const handleUpdate = async () => {
        setCreating(true);
        try {
            await updatePlanStage({
                id: editingId!,
                title: stageForm.title,
                description: stageForm.description,
                recommended_actions: stageForm.recommended_actions,
                max_cigarettes_per_day: stageForm.max_cigarettes_per_day,
                duration_days: stageForm.duration_days,
                stage_order: stageForm.stage_order,
                template_id: templateId,
            });
            toast.custom(<SuccessToast message="Cập nhật giai đoạn thành công!" />);
            setStageForm({ ...defaultStage });
            setEditingId(null);
            refetch();
        } catch (err: any) {
            toast.custom(
                <ErrorToast message={err?.message || "Có lỗi xảy ra!"} />
            );
        } finally {
            setCreating(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedStage) return;
        setCreating(true);
        try {
            await deletePlanStage(selectedStage.id);
            toast.custom(<SuccessToast message="Đã xóa giai đoạn." />);
            refetch();
        } catch (err: any) {
            toast.custom(<ErrorToast message={err?.message || "Xóa thất bại!"} />);
        } finally {
            setCreating(false);
            setConfirmModal(false);
            setSelectedStage(null);
            setConfirmAction(null);
        }
    };

    const handleConfirmModal = async () => {
        if (confirmAction === "delete") {
            await handleDelete();
        }
        if (confirmAction === "update") {
            setConfirmModal(false);
            await handleUpdate();
        }
    };

    const handleEdit = (stage: any) => {
        setStageForm({
            title: stage.title || "",
            description: stage.description || "",
            recommended_actions: stage.recommended_actions || "",
            duration_days: stage.duration_days,
            stage_order: stage.stage_order,
            max_cigarettes_per_day: stage.max_cigarettes_per_day,
        });
        setEditingId(stage.id);
        if (formRef.current) {
            formRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    };

    const handleDeleteClick = (stage: any) => {
        setSelectedStage(stage);
        setConfirmAction("delete");
        setConfirmModal(true);
    };

    const handleCancelEdit = () => {
        setStageForm({ ...defaultStage });
        setEditingId(null);
    };

    return (
        <div className="mt-10 border-t pt-10">
            <h3 className="text-2xl font-extrabold mb-7 text-[#03256C] flex items-center justify-center gap-3">
                Quản lý các giai đoạn
            </h3>
            <form
                ref={formRef}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-8 rounded-2xl shadow-lg mb-10 border border-gray-100"
                onSubmit={handleStageSubmit}
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
                        {creating ? (
                            <Loading color="#fff" />
                        ) : editingId ? (
                            "Lưu thay đổi"
                        ) : (
                            "Thêm giai đoạn"
                        )}
                    </button>
                    {editingId && (
                        <button
                            type="button"
                            className="cursor-pointer flex items-center gap-1 px-2 py-1 border border-gray-300 rounded-2xl text-gray-500 bg-gray-100 hover:bg-gray-200 font-semibold transition"
                            onClick={handleCancelEdit}
                        >
                            <XCircle size={20} /> Hủy
                        </button>
                    )}
                </div>
            </form>

            <ConfirmModal
                open={confirmModal}
                title={confirmAction === "delete" ? "Xác nhận xóa" : "Xác nhận cập nhật"}
                message={
                    confirmAction === "delete"
                        ? "Bạn có chắc chắn muốn xóa giai đoạn này?"
                        : "Bạn có chắc chắn muốn cập nhật giai đoạn này?"
                }
                onCancel={() => {
                    setConfirmModal(false);
                    setSelectedStage(null);
                    setConfirmAction(null);
                }}
                onConfirm={handleConfirmModal}
            />

            <div>
                {loading ? (
                    <Loading />
                ) : error ? (
                    <div className="text-red-500 text-lg">
                        Lỗi tải danh sách giai đoạn
                    </div>
                ) : (
                    <ul className="space-y-3">
                        {stages.map((s: any) => (
                            <li
                                key={s.id}
                                className="bg-gradient-to-br from-sky-50 to-blue-100 px-6 py-4 rounded-2xl shadow-md border border-blue-100 flex flex-col md:flex-row md:items-center md:justify-between gap-2 hover:shadow-lg transition group"
                            >
                                <div className="flex-1">
                                    <div className="font-medium text-sky-700 flex items-center gap-2">
                                        <span className="inline-block w-6 h-6 text-center bg-sky-500 text-white font-bold rounded-full">
                                            {s.stage_order}
                                        </span>
                                        <b className="ml-2">{s.title}</b>
                                        <span className="ml-2 text-gray-500 font-normal">
                                            ({s.duration_days} ngày)
                                        </span>
                                    </div>
                                    {typeof s.max_cigarettes_per_day === 'number' && (
                                        <div className="text-xs text-red-600 mt-1">
                                            Số điếu tối đa/ngày: <b>{s.max_cigarettes_per_day}</b>
                                        </div>
                                    )}
                                    {s.recommended_actions && (
                                        <div className="flex items-center gap-2 mt-1 text-green-700 text-sm my-3">
                                            <Activity className="w-4 h-4" />
                                            <span className="italic">{s.recommended_actions}</span>
                                        </div>
                                    )}
                                    {s.description && (
                                        <div className="text-gray-600 text-sm md:text-base mt-1 line-clamp-2">
                                            Mô tả: {s.description}
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-2 mt-2 md:mt-0">
                                    <button
                                        type="button"
                                        className="cursor-pointer p-2 rounded-full bg-sky-100 hover:bg-sky-200 text-sky-700 transition"
                                        title="Chỉnh sửa"
                                        onClick={() => handleEdit(s)}
                                    >
                                        <Pencil size={18} />
                                    </button>
                                    <button
                                        type="button"
                                        className="cursor-pointer p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition"
                                        title="Xóa"
                                        onClick={() => handleDeleteClick(s)}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </li>
                        ))}
                        {stages.length === 0 && (
                            <li className="text-center text-gray-400 italic py-8">
                                Chưa có giai đoạn nào
                            </li>
                        )}
                    </ul>
                )}
            </div>
        </div>
    );
}
