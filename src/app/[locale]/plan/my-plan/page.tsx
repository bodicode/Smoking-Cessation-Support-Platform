'use client';

import { useEffect, useState } from "react";
import Loading from "@/components/common/Loading";
import { Pencil, Plus } from "lucide-react";
import { getCessationPlans } from "@/services/cessationPlanService";
import {
    PlanStage,
    CreatePlanStageInput,
    UpdatePlanStageInput,
} from "@/types/api/cessationPlanStage";
import { Plan } from "@/types/api/cessationPlan";
import { createPlanStage, updatePlanStage } from "@/services/cessationPlanStageService";
import { formatDate } from "@/utils";
import Breadcrumbs from "@/components/common/BreadCrumb";

export default function CustomStages() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);

    const [editingStage, setEditingStage] = useState<{ [planId: string]: string | null }>({});
    const [customForm, setCustomForm] = useState<{ [planId: string]: UpdatePlanStageInput | null }>({});
    const [creating, setCreating] = useState<{ [planId: string]: boolean }>({});
    const [newStage, setNewStage] = useState<{ [planId: string]: CreatePlanStageInput }>({});
    const [loadingAction, setLoadingAction] = useState(false);

    const fetchPlans = async () => {
        setLoading(true);
        try {
            const plans = await getCessationPlans();
            setPlans(plans);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    console.log(plans)

    const handleEdit = (planId: string, stage: PlanStage) => {
        setEditingStage(prev => ({ ...prev, [planId]: stage.id }));
        setCustomForm(prev => ({
            ...prev,
            [planId]: {
                id: stage.id,
                plan_id: planId,
                title: stage.title || "",
                description: stage.description || "",
                actions: stage.actions || "",
                stage_order: stage.stage_order,
            }
        }));
    };

    const handleChange = (
        planId: string,
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        if (editingStage[planId] && customForm[planId]) {
            setCustomForm(prev => ({
                ...prev,
                [planId]: prev[planId] ? { ...prev[planId]!, [name]: value } : null
            }));
        } else {
            setNewStage(prev => ({
                ...prev,
                [planId]: { ...prev[planId], [name]: value }
            }));
        }
    };

    const handleCustomSave = async (planId: string, e: React.FormEvent) => {
        e.preventDefault();
        if (!customForm[planId]) return;
        setLoadingAction(true);
        await updatePlanStage(customForm[planId]!);
        setEditingStage(prev => ({ ...prev, [planId]: null }));
        setCustomForm(prev => ({ ...prev, [planId]: null }));
        setLoadingAction(false);
        fetchPlans();
    };

    const handleStartCreate = (planId: string, stages: PlanStage[]) => {
        setCreating(prev => ({ ...prev, [planId]: true }));
        setNewStage(prev => ({
            ...prev,
            [planId]: {
                plan_id: planId,
                title: "",
                description: "",
                actions: "",
                stage_order: stages?.length + 1 || 1,
            }
        }));
    };

    const handleCreate = async (planId: string, e: React.FormEvent) => {
        e.preventDefault();
        setLoadingAction(true);
        await createPlanStage(newStage[planId]);
        setCreating(prev => ({ ...prev, [planId]: false }));
        setLoadingAction(false);
        fetchPlans();
    };

    if (loading) return <Loading />;
    if (!plans.length) {
        return <div className="text-center text-red-500 py-20">Không tìm thấy kế hoạch nào.</div>;
    }

    return (
        <div className="max-w-3xl mx-auto mt-10">
            <Breadcrumbs
                items={[
                    { label: "Trang chủ", href: "/" },
                    { label: "Kế hoạch của bạn", active: true }
                ]}
            />            {plans.map(plan => (
                <div
                    key={plan.id}
                    className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100"
                    style={{ boxShadow: "0 2px 32px 0 #1E90FF10" }}
                >
                    <h1 className="text-2xl font-extrabold text-sky-700 mb-4 text-center">
                        {plan.template?.name}
                    </h1>

                    <div className="text-gray-800 mb-1">
                        <b>Lý do bắt đầu:</b> {plan.reason}
                    </div>

                    <div className="text-gray-800 mb-1">
                        <b>Ngày bắt đầu:</b> {formatDate(plan.start_date)}
                    </div>

                    <div className="text-gray-800 mb-1">
                        <b>Ngày mục tiêu:</b> {formatDate(plan.target_date)}
                    </div>

                    <div className="mb-4">
                        <b>Tiến độ:</b>
                        <div className="flex items-center gap-3 mt-1">
                            <div className="relative flex-1 h-4 rounded-full bg-sky-100 overflow-hidden">
                                <div
                                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-sky-400 to-green-400 transition-all"
                                    style={{ width: `${plan.completion_percentage ?? 0}%` }}
                                ></div>
                            </div>
                            <span className="min-w-[50px] text-right text-sky-700 font-bold">
                                {(plan.completion_percentage ?? 0).toFixed(2)}%
                            </span>
                        </div>
                    </div>

                    <h3 className="font-bold text-xl text-sky-700 mb-4 flex items-center gap-3">
                        Các giai đoạn của kế hoạch
                        {plan.is_custom && (
                            <button
                                onClick={() => handleStartCreate(plan.id, plan.stages)}
                                className="ml-auto mt-4 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center gap-2 text-base font-semibold cursor-pointer transition"
                                disabled={!!creating[plan.id]}
                                type="button"
                            >
                                <Plus size={18} /> Thêm giai đoạn
                            </button>
                        )}
                    </h3>

                    <ul className="space-y-4">
                        {plan.is_custom && creating[plan.id] && (
                            <li className="bg-white border rounded-xl p-6 flex-col gap-2">
                                <form onSubmit={e => handleCreate(plan.id, e)} className="flex flex-col gap-2">
                                    <input
                                        name="title"
                                        value={newStage[plan.id]?.title || ""}
                                        onChange={e => handleChange(plan.id, e)}
                                        placeholder="Tên giai đoạn"
                                        className="border rounded-xl px-4 py-2 text-base"
                                        required
                                    />
                                    <textarea
                                        name="description"
                                        value={newStage[plan.id]?.description || ""}
                                        onChange={e => handleChange(plan.id, e)}
                                        placeholder="Mô tả"
                                        className="border rounded-xl px-4 py-2 text-base"
                                    />
                                    <input
                                        name="actions"
                                        value={newStage[plan.id]?.actions || ""}
                                        onChange={e => handleChange(plan.id, e)}
                                        placeholder="Hành động"
                                        className="border rounded-xl px-4 py-2 text-base"
                                    />
                                    <div className="flex gap-3 mt-1">
                                        <button
                                            type="submit"
                                            className="bg-sky-600 hover:bg-sky-700 text-white rounded px-4 py-1 font-semibold cursor-pointer transition"
                                        >
                                            {loadingAction ? <Loading /> : "Lưu"}
                                        </button>
                                        <button
                                            type="button"
                                            className="text-gray-500 underline cursor-pointer"
                                            onClick={() => setCreating(prev => ({ ...prev, [plan.id]: false }))}
                                            disabled={loadingAction}
                                        >
                                            Huỷ
                                        </button>
                                    </div>
                                </form>
                            </li>
                        )}

                        {plan.stages.map(stage =>
                            plan.is_custom && editingStage[plan.id] === stage.id && customForm[plan.id] ? (
                                <li key={stage.id} className="bg-white border rounded-xl p-4 shadow flex flex-col gap-2">
                                    <form onSubmit={e => handleCustomSave(plan.id, e)} className="flex flex-col gap-2">
                                        <input
                                            name="title"
                                            value={customForm[plan.id]?.title || ""}
                                            onChange={e => handleChange(plan.id, e)}
                                            className="border rounded px-2 py-2 text-base"
                                            required
                                        />
                                        <textarea
                                            name="description"
                                            value={customForm[plan.id]?.description || ""}
                                            onChange={e => handleChange(plan.id, e)}
                                            className="border rounded px-2 py-2 text-base"
                                        />
                                        <input
                                            name="actions"
                                            value={customForm[plan.id]?.actions || ""}
                                            onChange={e => handleChange(plan.id, e)}
                                            className="border rounded px-2 py-2 text-base"
                                        />
                                        <div className="flex gap-3 mt-1">
                                            <button
                                                type="submit"
                                                className="bg-green-600 hover:bg-green-700 text-white rounded px-4 py-1 font-semibold cursor-pointer transition"
                                            >
                                                {loadingAction ? "Đang lưu..." : "Lưu"}
                                            </button>
                                            <button
                                                type="button"
                                                className="text-gray-500 underline cursor-pointer"
                                                onClick={() => setEditingStage(prev => ({ ...prev, [plan.id]: null }))}
                                                disabled={loadingAction}
                                            >
                                                Huỷ
                                            </button>
                                        </div>
                                    </form>
                                </li>
                            ) : (
                                <li
                                    key={stage.id}
                                    className="bg-gradient-to-br from-blue-50 to-blue-100 px-6 py-4 rounded-2xl shadow flex justify-between items-center border border-blue-100 hover:shadow-lg transition"
                                >
                                    <div>
                                        <b className="text-sky-700 text-lg">{stage.title}</b>
                                        <div className="text-gray-700 text-base">{stage.description}</div>
                                        {stage.actions && (
                                            <div className="text-sm text-blue-600 mt-1 font-medium">
                                                Hành động: <span className="underline">{stage.actions}</span>
                                            </div>
                                        )}
                                    </div>
                                    {plan.is_custom && (
                                        <button
                                            onClick={() => handleEdit(plan.id, stage)}
                                            className="text-sky-600 hover:text-sky-800 p-2 rounded-full transition cursor-pointer"
                                            title="Chỉnh sửa giai đoạn"
                                            type="button"
                                        >
                                            <Pencil size={20} />
                                        </button>
                                    )}
                                </li>
                            )
                        )}
                    </ul>
                    {plan.is_custom && (
                        <div className="mt-6 text-gray-500 text-base italic">
                            Bạn có thể thêm hoặc chỉnh sửa các giai đoạn cho phù hợp với bản thân.
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
