'use client';

import PlanTemplateForm from "@/components/template/PlanTemplateForm";
import ConfirmModal from "@/components/common/ModalConfirm";
import PlanStageManage from "@/components/template/PlanStageManage";
import Loading from "@/components/common/Loading";
import usePlanTemplateForm from "@/hooks/useTemplateForm";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { ErrorToast, SuccessToast } from "@/components/common/CustomToast";

export default function PlanTemplateFormPage() {
    const {
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
        setErrorMsg,
    } = usePlanTemplateForm();

    useEffect(() => {
        if (successMsg) {
            toast.custom(<SuccessToast message={successMsg} />);
            setSuccessMsg(null);
        }
        if (errorMsg) {
            toast.custom(<ErrorToast message={errorMsg} />);
            setErrorMsg(null);
        }
    }, [successMsg, errorMsg]);

    if (loadingTemplate && editId) {
        return (
            <div className="w-full h-48 flex justify-center items-center">
                <Loading />
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto mt-4">
            <div className="bg-white rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-center mb-6 text-[#03256C] tracking-tight">
                    {editId ? "Chỉnh sửa mẫu kế hoạch" : "Tạo mẫu kế hoạch bỏ thuốc mới"}
                </h2>
                <PlanTemplateForm
                    form={form}
                    loading={loading}
                    onChange={handleChange}
                    onSubmit={handleShowConfirm}
                    editId={editId}
                />
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
            {editId && (
                <div className="mt-8">
                    <PlanStageManage templateId={editId} />
                </div>
            )}
        </div>
    );
}
