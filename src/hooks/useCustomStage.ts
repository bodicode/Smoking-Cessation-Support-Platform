import { useEffect, useState } from "react";
import { getCessationPlans } from "@/services/cessationPlanService";
import {
    createPlanStage,
    removePlanStage,
    updatePlanStage,
} from "@/services/cessationPlanStageService";
import { Plan } from "@/types/api/cessationPlan";
import { CreatePlanStageInput, PlanStage, UpdatePlanStageInput } from "@/types/api/cessationPlanStage";

const PLAN_STATUS_OPTIONS = [
    "PLANNING",
    "ACTIVE",
    "PAUSED",
    "COMPLETED",
    "ABANDONED",
    "CANCELLED",
];

const STAGE_STATUS_OPTIONS = [
    "PENDING",
    "ACTIVE",
    "COMPLETED",
    "SKIPPED",
];

export function useCustomStages() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingAction, setLoadingAction] = useState(false);
    const [editingStage, setEditingStage] = useState<{ [planId: string]: string | null }>({});
    const [customForm, setCustomForm] = useState<{ [planId: string]: UpdatePlanStageInput | null }>({});
    const [creating, setCreating] = useState<{ [planId: string]: boolean }>({});
    const [newStage, setNewStage] = useState<{ [planId: string]: CreatePlanStageInput }>({});
    const [deleteStageId, setDeleteStageId] = useState<string | null>(null);

    const [toastMsg, setToastMsg] = useState<string | null>(null);
    const [toastType, setToastType] = useState<"success" | "error" | null>(null);

    const fetchPlans = async () => {
        setLoading(true);
        try {
            const data = await getCessationPlans();
            setPlans(data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    const handleEdit = (planId: string, stage: PlanStage) => {
        setEditingStage((prev) => ({ ...prev, [planId]: stage.id }));
        setCustomForm((prev) => ({
            ...prev,
            [planId]: {
                id: stage.id,
                plan_id: planId,
                title: stage.title || "",
                description: stage.description || "",
                actions: stage.actions || "",
                stage_order: stage.stage_order,
                start_date: stage.start_date || "",
                end_date: stage.end_date || "",
                status: stage.status || "PENDING",
            },
        }));
    };

    const handleChange = (
        planId: string,
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        if (editingStage[planId] && customForm[planId]) {
            setCustomForm((prev) => ({
                ...prev,
                [planId]: prev[planId] ? { ...prev[planId]!, [name]: value } : null,
            }));
        } else {
            setNewStage((prev) => ({
                ...prev,
                [planId]: {
                    ...prev[planId],
                    [name]:
                        name === "stage_order" || name === "duration_days"
                            ? Number(value)
                            : value,
                },
            }));
        }
    };


    const handleCustomSave = async (planId: string, e: React.FormEvent) => {
        e.preventDefault();
        if (!customForm[planId]) return;
        setLoadingAction(true);
        await updatePlanStage(customForm[planId]!);
        setEditingStage((prev) => ({ ...prev, [planId]: null }));
        setCustomForm((prev) => ({ ...prev, [planId]: null }));
        await fetchPlans();
        setLoadingAction(false);
        setToastMsg("Lưu giai đoạn thành công!");
        setToastType("success");
    };

    const handleStartCreate = (planId: string, stages: PlanStage[]) => {
        setCreating((prev) => ({ ...prev, [planId]: true }));
        setNewStage((prev) => ({
            ...prev,
            [planId]: {
                plan_id: planId,
                title: "",
                description: "",
                actions: "",
                stage_order: stages.length + 1,
                start_date: "",
                end_date: "",
            },
        }));
    };

    const handleCreate = async (planId: string, e: React.FormEvent) => {
        e.preventDefault();
        const plan = plans.find((p) => p.id === planId);
        const stageOrders = plan?.stages.map((s) => s.stage_order) || [];
        const order = newStage[planId]?.stage_order;

        if (stageOrders.includes(order)) {
            setToastMsg("Thứ tự giai đoạn đã tồn tại!");
            setToastType("error");
            return;
        }

        setLoadingAction(true);
        try {
            await createPlanStage(newStage[planId]);
            setCreating((prev) => ({ ...prev, [planId]: false }));
            await fetchPlans();
            setToastMsg("Tạo giai đoạn thành công!");
            setToastType("success");
        } catch (err: any) {
            setToastMsg(err?.message || "Có lỗi xảy ra!");
            setToastType("error");
        } finally {
            setLoadingAction(false);
        }
    };

    const handleDeleteStage = async () => {
        if (!deleteStageId) return;
        setLoadingAction(true);
        try {
            await removePlanStage(deleteStageId);
            await fetchPlans();
            setToastMsg("Xoá thành công!");
            setToastType("success");
        } catch (err: any) {
            setToastMsg(err?.message || "Xoá thất bại!");
            setToastType("error");
        } finally {
            setLoadingAction(false);
            setDeleteStageId(null);
        }
    };

    return {
        plans,
        loading,
        fetchPlans,
        loadingAction,
        editingStage,
        customForm,
        creating,
        newStage,
        deleteStageId,
        toastMsg,
        toastType,
        handleEdit,
        handleChange,
        handleCustomSave,
        handleStartCreate,
        handleCreate,
        handleDeleteStage,
        setCreating,
        setDeleteStageId,
        setToastMsg,
        setToastType,
        PLAN_STATUS_OPTIONS,
        STAGE_STATUS_OPTIONS
    };
}