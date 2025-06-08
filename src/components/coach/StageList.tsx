import { useQuery } from "@apollo/client";
import { Clock } from "lucide-react";
import Loading from "../common/Loading";
import { GET_PLAN_STAGE_TEMPLATES_BY_TEMPLATE } from "@/graphql/queries/templates/getPlanStageTemplateByTemplate";


export function StageList({ templateId }: { templateId: string }) {
    const { data, loading, error } = useQuery(GET_PLAN_STAGE_TEMPLATES_BY_TEMPLATE, {
        variables: { templateId }
    });

    if (loading) return <div className="p-3 text-sky-600 flex items-center gap-2"><Loading size={18} /> Đang tải stage...</div>;
    if (error) return <div className="text-red-500 p-3">Lỗi tải stages.</div>;

    const stages = data?.planStageTemplates?.data ?? [];
    if (!stages.length) return <div className="p-3 text-gray-400">Chưa có stage nào.</div>;

    return (
        <ul className="flex flex-col gap-2 px-3 pb-2">
            {stages.map((stage: any) => (
                <li key={stage.id} className="bg-[#f2f7fa] rounded-lg px-4 py-3 shadow flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div>
                        <span className="font-semibold text-[#03256C]">Bước {stage.stage_order}:</span> <span className="font-semibold">{stage.title}</span>
                        <div className="text-gray-500 text-sm mt-1">{stage.description}</div>
                    </div>
                    <div className="flex gap-4 text-xs text-gray-600 min-w-fit md:justify-end">
                        <span className="flex items-center gap-1"><Clock size={14} /> {stage.duration_days} ngày</span>
                    </div>
                </li>
            ))}
        </ul>
    );
}