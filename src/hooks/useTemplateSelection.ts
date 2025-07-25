"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreateCessationPlanInput } from "@/types/api/cessationPlan";
import {
  createCessationPlan,
  getCessationPlans,
} from "@/services/cessationPlanService";
import toast from "react-hot-toast";
import { useAuth } from "./useAuth";
import { ChatService } from "@/services/chatService";
import { useSubscription } from "@/context/SubscriptionContext"; // Import useSubscription

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
  const { user } = useAuth();
  const { isSubscribed } = useSubscription(); 

  const checkHasPlan = async (userId: string, templateId: string) => {
    const plans = await getCessationPlans({ userId, templateId });
    if (plans.length === 0) return false;
    return plans.some(plan => plan.status !== 'CANCELLED' && plan.status !== 'COMPLETED');
  };

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
    if (!selectedTemplate || !user?.id) {
      toast.error("Thiếu thông tin để tạo kế hoạch hoặc bạn chưa đăng nhập.");
      return;
    }
    if (!reason.trim()) {
      setErrorMsg("Vui lòng nhập lý do bạn muốn bỏ thuốc.");
      return;
    }

    setLoadingCreate(true);
    setErrorMsg(null);

    let createdPlanId: string | undefined;
    let createdChatRoomId: string | undefined;

    try {
      const coachId = selectedTemplate.coach?.id;

      const now = new Date();
      const target = new Date(now);
      target.setDate(now.getDate() + (selectedTemplate.estimated_duration_days || 30));

      const input: CreateCessationPlanInput = {
        template_id: selectedTemplate.id,
        is_custom: isCustom,
        start_date: now.toISOString(),
        target_date: target.toISOString(),
        reason: reason.trim(),
      };

      const newPlan = await createCessationPlan(input);
      if (!newPlan?.id) {
        throw new Error(
          "Không thể tạo kế hoạch mới. Không nhận được ID kế hoạch."
        );
      }
      createdPlanId = newPlan.id;

      if (coachId && isSubscribed) {
        try {
          const newChatRoom = await ChatService.createChatRoom({
            receiver_id: coachId,
          });
          createdChatRoomId = newChatRoom.id;
          toast.success("Kế hoạch và phòng chat với coach đã được tạo!");
        } catch (chatError: any) {
          toast.error(
            "Kế hoạch đã tạo, nhưng không thể tạo phòng chat: " +
              chatError.message
          );
        }
      } else if (coachId && !isSubscribed) {
        toast.success(
          "Kế hoạch đã tạo, nhưng bạn cần gói thành viên để tạo phòng chat với coach."
        );
      } else {
        console.warn(
          "Không tìm thấy ID huấn luyện viên cho template này. Bỏ qua tạo phòng chat."
        );
        toast.success("Kế hoạch đã được tạo thành công!");
      }

      setShowConfirm(false);
      setReason("");
      setIsCustom(false);
      setSelectedTemplate(null);

      let redirectPath = `/plan/my-plan?planId=${createdPlanId}`;
      if (createdChatRoomId) {
        redirectPath += `&chatRoomId=${createdChatRoomId}`;
      }
      router.push(redirectPath);
    } catch (err: any) {
      setErrorMsg(
        err.message || "Có lỗi xảy ra khi tạo kế hoạch. Vui lòng thử lại."
      );
      toast.error(
        err.message || "Có lỗi xảy ra khi tạo kế hoạch. Vui lòng thử lại."
      );
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
