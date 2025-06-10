import { useState } from "react";
import { format } from "date-fns";
import { createCessationPlan } from "@/services/cessationPlanService";

export default function UsePlanTemplate({
    templateId,
    onCreated,
}: {
    templateId: string;
    onCreated: (plan: any) => void;
}) {
    const [form, setForm] = useState({
        reason: "",
        start_date: format(new Date(), "yyyy-MM-dd"),
        target_date: "",
        is_custom: true,
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const plan = await createCessationPlan({
                template_id: templateId,
                is_custom: true,
                reason: form.reason,
                start_date: form.start_date,
                target_date: form.target_date,
            });
            if (plan) {
                onCreated(plan);
            }
        } catch (err: any) {
            alert(err.message || "Có lỗi xảy ra");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-lg mx-auto bg-white rounded-xl shadow p-6 mt-6 flex flex-col gap-4"
        >
            <h2 className="font-bold text-lg mb-1 text-sky-700">
                Bắt đầu kế hoạch bỏ thuốc từ mẫu này
            </h2>
            <textarea
                className="border rounded p-2"
                name="reason"
                value={form.reason}
                onChange={handleChange}
                placeholder="Lý do bạn muốn bỏ thuốc"
                rows={2}
                required
            />
            <div className="flex gap-4">
                <div className="flex-1">
                    <label className="block mb-1 text-sm">Ngày bắt đầu</label>
                    <input
                        type="date"
                        name="start_date"
                        value={form.start_date}
                        onChange={handleChange}
                        className="border rounded p-2 w-full"
                        required
                    />
                </div>
                <div className="flex-1">
                    <label className="block mb-1 text-sm">Ngày mục tiêu</label>
                    <input
                        type="date"
                        name="target_date"
                        value={form.target_date}
                        onChange={handleChange}
                        className="border rounded p-2 w-full"
                        required
                    />
                </div>
            </div>
            <button
                type="submit"
                className="bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded py-2 mt-2"
                disabled={loading}
            >
                {loading ? "Đang tạo..." : "Bắt đầu kế hoạch"}
            </button>
        </form>
    );
}
