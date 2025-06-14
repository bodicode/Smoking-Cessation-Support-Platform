import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreateCessationPlanInput } from "@/types/api/cessationPlan";
import { createCessationPlan, getCessationPlans } from "@/services/cessationPlanService";
import toast from "react-hot-toast";
import { useAuth } from "./useAuth";

export default function useTemplateSelection() {
    const [openStageModal, setOpenStageModal] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null);
    const [loadingCreate, setLoadingCreate] = useState(false);
    const [reason, setReason] = useState("");
    const [isCustom, setIsCustom] = useState(false);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const router = useRouter();
    const { user } = useAuth()

    const checkHasPlan = async (userId: string, templateId: string) => {
        const plans = await getCessationPlans({ userId, templateId });
        return plans.length > 0;
    }

    const handleUseTemplate = async (tpl: any) => {
        if (!user?.id) {
            toast.error("Vui lòng đăng nhập để sử dụng kế hoạch!");
            return;
        }

        try {
            const hasPlan = await checkHasPlan(user.id, tpl.id);
            if (hasPlan) {
                toast.error("Bạn đã có kế hoạch rồi!");
                return;
            }
            setSelectedTemplate(tpl);
            setShowConfirm(true);
        } catch (e) {
            toast.error("Lỗi kiểm tra kế hoạch. Thử lại sau!");
        }
    };


    const handleConfirmCreate = async () => {
        if (!selectedTemplate) return;
        if (!reason.trim()) {
            setErrorMsg("Vui lòng nhập lý do bạn muốn bỏ thuốc.");
            return;
        }

        setLoadingCreate(true);
        try {
            const today = new Date();
            const target = new Date(today);
            target.setDate(today.getDate() + (selectedTemplate.estimated_duration_days || 30));

            const input: CreateCessationPlanInput = {
                template_id: selectedTemplate.id,
                is_custom: isCustom,
                start_date: today.toISOString().slice(0, 10),
                target_date: target.toISOString().slice(0, 10),
                reason: reason.trim(),
            };

            await createCessationPlan(input);
            setSuccessMsg("Tạo kế hoạch thành công!");
            setShowConfirm(false);
            setSelectedTemplate(null);
            router.push("/plan/my-plan");
        } catch (err: any) {
            alert(err.message || "Có lỗi khi tạo kế hoạch");
        } finally {
            setLoadingCreate(false);
        }
    };

    return {
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
    };
}
