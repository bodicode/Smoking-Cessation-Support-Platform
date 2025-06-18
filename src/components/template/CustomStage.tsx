import { useState } from "react";
import Loading from "@/components/common/Loading";
import { Pencil } from "lucide-react";
import { updatePlanStage } from "@/services/planStageTemplate";
import { Stage } from "@/types/components/planStage";

export default function CustomStages({
    planId,
    stages,
    refetch,
}: {
    planId: string;
    stages: Stage[];
    refetch: () => void;
}) {
    const [editingStage, setEditingStage] = useState<string | null>(null);
    const [customForm, setCustomForm] = useState<any>({});

    const handleEdit = (stage: Stage) => {
        setEditingStage(stage.id);
        setCustomForm({ ...stage });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCustomForm((prev: any) => ({ ...prev, [name]: value }));
    };

    // Update stage (giả sử có API updatePlanStage)
    const handleCustomSave = async (e: React.FormEvent) => {
        e.preventDefault();
        // Gọi mutation updatePlanStage (chú ý truyền cả planId nếu cần)
        await updatePlanStage({ ...customForm, plan_id: planId });
        setEditingStage(null);
        refetch();
    };

    return (
        <div className="max-w-2xl mx-auto mt-8">
            <h3 className="font-bold text-lg text-sky-700 mb-4">Các giai đoạn của kế hoạch</h3>
            {!stages ? (
                <Loading />
            ) : (
                <ul className="space-y-3">
                    {stages.map((stage) =>
                        editingStage === stage.id ? (
                            <li key={stage.id} className="bg-white border rounded-xl p-4">
                                <form onSubmit={handleCustomSave} className="flex flex-col gap-2">
                                    <input
                                        name="title"
                                        value={customForm.title || ""}
                                        onChange={handleChange}
                                        className="border rounded px-2 py-1"
                                    />
                                    <textarea
                                        name="description"
                                        value={customForm.description || ""}
                                        onChange={handleChange}
                                        className="border rounded px-2 py-1"
                                    />
                                    <button type="submit" className="bg-green-600 text-white rounded py-1">
                                        Lưu
                                    </button>
                                </form>
                            </li>
                        ) : (
                            <li key={stage.id} className="bg-gradient-to-br from-sky-50 to-blue-100 px-6 py-4 rounded-2xl shadow flex justify-between items-center">
                                <div>
                                    <b className="text-sky-700">{stage.title}</b>
                                    <div className="text-gray-600 text-sm">{stage.description}</div>
                                </div>
                                <button onClick={() => handleEdit(stage)} className="text-sky-600 hover:text-sky-800">
                                    <Pencil size={18} />
                                </button>
                            </li>
                        )
                    )}
                </ul>
            )}
            <div className="mt-6 text-gray-500 text-sm italic">
                Bạn có thể chỉnh sửa các giai đoạn cho phù hợp với bản thân.
            </div>
        </div>
    );
}
