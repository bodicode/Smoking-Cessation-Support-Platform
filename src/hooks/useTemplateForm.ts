import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createPlanTemplate, getPlanTemplateById, updatePlanTemplate } from "@/services/templateService";
import { PlanTemplateUpdateInput } from "@/types/api/cessationPlanTemplate";

const defaultForm = {
    name: "",
    description: "",
    difficulty_level: "" as "" | "EASY" | "MEDIUM" | "HARD",
    estimated_duration_days: ""
};

export default function usePlanTemplateForm() {
    const router = useRouter();
    const params = useSearchParams();
    const editId = params.get("edit");

    const { template, loading: loadingTemplate } = getPlanTemplateById(editId ?? undefined);
    const [form, setForm] = useState(defaultForm);
    const [loading, setLoading] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
            [name]: value,
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
                setSuccessMsg("Cập nhật thành công!");
                setTimeout(() => {
                    router.push('/coach/templates');
                    router.refresh();
                }, 1000);
            } else {
                const created = await createPlanTemplate(input);
                setSuccessMsg("Tạo mẫu thành công!");
                setTimeout(() => {
                    router.push(`/coach/templates/new?edit=${created.id}`);
                    router.refresh();
                }, 1000);
            }
        } catch (err: any) {
            setErrorMsg(err?.message || "Có lỗi xảy ra");
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

    return {
        editId,
        form,
        loading,
        loadingTemplate,
        showConfirmModal,
        setShowConfirmModal,
        handleChange,
        handleShowConfirm,
        handleConfirmSubmit,
        successMsg,
        errorMsg,
        setSuccessMsg,
        setErrorMsg
    };
}
