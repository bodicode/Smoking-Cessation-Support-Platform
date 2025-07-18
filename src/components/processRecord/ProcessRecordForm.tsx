'use client';

import { useState } from "react";
import toast from "react-hot-toast";
import Loading from "@/components/common/Loading";
import { HelpCircle } from "lucide-react";
import CriteriaModal from "./CriteriaModal";

export default function ProgressRecordForm({ planId, onSuccess, handleCreate, coachId }: {
    planId: string;
    onSuccess?: () => void;
    handleCreate: (data: any) => Promise<void>;
    coachId: string;
}) {
    const [form, setForm] = useState({
        record_date: "",
        cigarettes_smoked: "",
        health_score: "",
        notes: ""
    });
    const [submitting, setSubmitting] = useState(false);
    const [showCriteriaModal, setShowCriteriaModal] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.record_date || !form.cigarettes_smoked || !form.health_score) {
            toast.error("Vui lòng nhập đầy đủ ngày, số điếu thuốc và điểm sức khỏe.");
            return;
        }
        setSubmitting(true);
        try {
            await handleCreate({
                plan_id: planId,
                record_date: form.record_date,
                cigarettes_smoked: Number(form.cigarettes_smoked),
                health_score: Number(form.health_score),
                notes: form.notes
            });
            toast.success("Thêm ghi nhận thành công!");
            setForm({
                record_date: "",
                cigarettes_smoked: "",
                health_score: "",
                notes: ""
            });
            onSuccess?.();
        } catch (e: any) {
            toast.error(e?.message || "Thêm thất bại");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form className="flex flex-col gap-3 items-start mb-6" onSubmit={handleSubmit}>
            <div className="flex flex-wrap gap-3 w-full">
                <div className="flex-1 min-w-[140px]">
                    <label className="text-xs font-semibold">Ngày</label>
                    <input
                        type="date"
                        className="border rounded px-2 py-1 w-full"
                        value={form.record_date}
                        onChange={e => setForm(f => ({ ...f, record_date: e.target.value }))}
                        required
                    />
                </div>
                <div className="flex-1 min-w-[100px]">
                    <label className="text-xs font-semibold">Số điếu thuốc</label>
                    <input
                        type="number"
                        className="border rounded px-2 py-1 w-full"
                        value={form.cigarettes_smoked}
                        min={0}
                        onChange={e => setForm(f => ({ ...f, cigarettes_smoked: e.target.value }))}
                        required
                    />
                </div>
                <div className="flex-1 min-w-[120px] gap-2 items-center">
                    <label className="text-xs font-semibold">Điểm sức khỏe</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            className="border rounded px-2 py-1 w-full"
                            value={form.health_score}
                            min={0}
                            max={10}
                            onChange={e => setForm(f => ({ ...f, health_score: e.target.value }))}
                            required
                        />
                        <HelpCircle
                            size={20}
                            className="text-sky-500 hover:text-sky-700 cursor-pointer transition"
                            onClick={() => setShowCriteriaModal(true)}
                        />
                    </div>
                </div>
            </div>
            <div className="w-full">
                <label className="text-xs font-semibold">Ghi chú</label>
                <input
                    className="border rounded px-2 py-1 w-full"
                    value={form.notes}
                    onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                />
            </div>
            <button
                type="submit"
                className="cursor-pointer bg-sky-600 hover:bg-sky-700 text-white px-5 py-2 rounded font-semibold"
                disabled={submitting}
            >
                {submitting ? <Loading color="#fff" /> : "Lưu"}
            </button>

            <CriteriaModal
                open={showCriteriaModal}
                onClose={() => setShowCriteriaModal(false)}
                coachId={coachId}
            />
        </form>


    );
}
