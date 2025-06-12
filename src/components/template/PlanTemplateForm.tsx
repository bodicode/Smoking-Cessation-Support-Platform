import { PlanTemplateFormProps } from "@/types/components/planTemplateForm";
import Loading from "../common/Loading";

export default function PlanTemplateForm({
    form, loading, onChange, onSubmit, editId
}: PlanTemplateFormProps) {
    return (
        <form onSubmit={onSubmit} className="space-y-5">
            <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                    Tên mẫu kế hoạch
                </label>
                <input
                    name="name"
                    value={form.name}
                    onChange={onChange}
                    className="w-full px-4 py-2 rounded-xl border border-zinc-300 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base transition"
                    placeholder="Nhập tên mẫu"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                    Mô tả
                </label>
                <textarea
                    name="description"
                    value={form.description}
                    onChange={onChange}
                    className="w-full px-4 py-2 rounded-xl border border-zinc-300 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base transition"
                    placeholder="Mô tả kế hoạch"
                    rows={3}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                    Mức độ khó
                </label>
                <select
                    name="difficulty_level"
                    value={form.difficulty_level}
                    onChange={onChange}
                    className="w-full px-4 py-2 rounded-xl border border-zinc-300 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base transition"
                    required
                >
                    <option value="">Chọn mức độ</option>
                    <option value="EASY">Dễ</option>
                    <option value="MEDIUM">Trung bình</option>
                    <option value="HARD">Khó</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                    Số ngày dự kiến
                </label>
                <input
                    name="estimated_duration_days"
                    type="number"
                    min="1"
                    value={form.estimated_duration_days}
                    onChange={onChange}
                    className="w-full px-4 py-2 rounded-xl border border-zinc-300 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base transition"
                    placeholder="Nhập số ngày"
                    required
                />
            </div>
            <button
                type="submit"
                disabled={loading}
                className="cursor-pointer w-full flex justify-center items-center gap-2 px-4 py-2 bg-[#03256C] hover:bg-[#041E42] text-white font-semibold rounded-xl shadow transition disabled:opacity-60 h-10 min-h-[40px]"
            >
                {loading ? <Loading /> : (editId ? "Lưu thay đổi" : "Tạo mới")}
            </button>
        </form>
    );
}