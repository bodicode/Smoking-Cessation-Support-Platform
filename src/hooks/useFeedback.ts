import { getFeedbacks, updateFeedback, removeFeedback } from "@/services/feedbackPlanTemplateService";
import { UseFeedbacksProps } from "@/types/api/feedbackPlanTemplate";
import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";

export default function useFeedbacks({
    templateId,
    userId,
    limit = 10,
    page = 1,
    search = "",
    orderBy = "created_at",
    sortOrder = "desc",
    reload: reloadProp = 0,
}: UseFeedbacksProps & { reload?: number }) {
    const [loading, setLoading] = useState(false);
    const [feedbacks, setFeedbacks] = useState<any[]>([]);
    const [feedbackError, setFeedbackError] = useState<any>(null);
    const [total, setTotal] = useState<number | undefined>(undefined);
    const [reload, setReload] = useState(reloadProp);

    useEffect(() => {
        setReload(reloadProp);
    }, [reloadProp]);

    useEffect(() => {
        if (!templateId && !userId) return;

        setLoading(true);
        setFeedbackError(null);

        getFeedbacks({
            params: {
                limit,
                page,
                search,
                orderBy,
                sortOrder,
            },
            filters: {
                ...(templateId && { templateId }),
                ...(userId && { userId }),
            },
        })
            .then(res => {
                if (Array.isArray(res)) {
                    setFeedbacks(res);
                    setTotal(undefined);
                } else {
                    setFeedbacks(res.data || []);
                    setTotal(res.total);
                }
            })
            .catch(setFeedbackError)
            .finally(() => setLoading(false));
    }, [templateId, userId, limit, page, search, orderBy, sortOrder, reload]);

    const handleUpdate = useCallback(async (id: string, input: any) => {
        try {
            await updateFeedback(id, input);
            toast.success("Đã cập nhật feedback!");
            setReload(r => r + 1);
        } catch (err: any) {
            toast.error(err.message || "Lỗi cập nhật feedback");
            throw err;
        }
    }, []);

    const handleDelete = useCallback(async (id: string) => {
        try {
            await removeFeedback(id);
            toast.success("Đã xóa feedback!");
            setReload(r => r + 1);
        } catch (err: any) {
            toast.error(err.message || "Lỗi xóa feedback");
            throw err;
        }
    }, []);

    return { feedbacks, total, loading, feedbackError, reload, setReload, handleUpdate, handleDelete };
}
