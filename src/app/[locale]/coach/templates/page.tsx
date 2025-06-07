'use client';

import { useQuery, gql } from '@apollo/client';
import Link from 'next/link';
import { useState } from 'react';
import {
    Plus, Edit, Clock, Zap, Star, ChartNoAxesColumnDecreasing, ChevronDown, ChevronUp, List
} from 'lucide-react';
import Loading from '@/components/common/Loading';
import { GET_PLAN_TEMPLATES } from '@/graphql/queries/templates/getPlanTemplates';
import { GET_PLAN_STAGE_TEMPLATES_BY_TEMPLATE } from '@/graphql/queries/templates/getPlanStageTemplateByTemplate';

function StageList({ templateId }: { templateId: string }) {
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

export default function CoachTemplatesPage() {
    const { data, loading, error } = useQuery(GET_PLAN_TEMPLATES);
    const templates = data?.cessationPlanTemplates?.data || [];
    const [openTemplateIds, setOpenTemplateIds] = useState<string[]>([]);

    const handleDropdown = (id: string) => {
        setOpenTemplateIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-sky-800">Quản lý Kế hoạch</h1>
                <Link
                    href="/coach/templates/new"
                    className="flex items-center gap-2 bg-gradient-to-r from-sky-500 to-green-400 hover:to-green-600 text-white font-semibold py-2 px-5 rounded-xl shadow transition"
                >
                    <Plus className="w-5 h-5" />
                    Tạo template mới
                </Link>
            </div>
            {loading ? (
                <div className="py-12 text-center text-sky-600 font-semibold"><Loading /></div>
            ) : error ? (
                <div className="py-12 text-center text-red-600 font-semibold">Lỗi tải kế hoạch.</div>
            ) : templates.length === 0 ? (
                <div className="py-24 text-center text-gray-500">
                    Chưa có kế hoạch nào. Nhấn "Tạo template mới" để bắt đầu!
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    {templates.map((tpl: any) => (
                        <div
                            key={tpl.id}
                            className="bg-white rounded-2xl shadow-md p-7 flex flex-col gap-2 border-l-8 border-sky-200 hover:border-sky-500 transition-all duration-200 hover:shadow-lg"
                        >
                            <div className="flex items-start justify-between mb-2">
                                <h2 className="text-xl font-extrabold text-sky-700">{tpl.name}</h2>
                                <Link
                                    href={`/coach/templates/${tpl.id}/edit`}
                                    className="text-sky-600 hover:text-sky-800 font-medium inline-flex items-center gap-1"
                                >
                                    <Edit className="w-5 h-5" /> Sửa
                                </Link>
                            </div>
                            <p className="text-gray-600 mb-3 truncate">{tpl.description}</p>
                            <div className="flex flex-col gap-2 text-base text-gray-700 mt-3">
                                <span className="flex items-center gap-2">
                                    <Clock size="16px" />
                                    Thời lượng: <b>{tpl.estimated_duration_days} ngày</b>
                                </span>
                                <span className="flex items-center gap-2">
                                    <Zap size="16px" className='text-red-400' />
                                    Độ khó: <b>{tpl.difficulty_level}</b>
                                </span>
                                <span className="flex items-center gap-2">
                                    <Star size="16px" className='text-yellow-600' />
                                    Đánh giá: <b>{tpl.average_rating ?? "0"}</b>
                                </span>
                                <span className="flex items-center gap-2">
                                    <ChartNoAxesColumnDecreasing size="16px" />
                                    Lượt đánh giá: <b>{tpl.total_reviews ?? "0"}</b>
                                </span>
                            </div>
                            {/* Dropdown */}
                            <button
                                className={`cursor-pointer flex items-center justify-between gap-2 mt-4 py-2 px-4 rounded-lg bg-gradient-to-r from-sky-50 to-green-50 hover:bg-sky-100 text-sky-700 font-semibold border border-sky-100 shadow transition
                                    ${openTemplateIds.includes(tpl.id) ? "ring-2 ring-sky-300" : ""}`
                                }
                                onClick={() => handleDropdown(tpl.id)}
                            >
                                <div className='flex items-center gap-x-2'>
                                    <List className="w-5 h-5" />
                                    Xem các giai đoạn
                                </div>
                                {openTemplateIds.includes(tpl.id) ? <ChevronUp /> : <ChevronDown />}
                            </button>
                            {openTemplateIds.includes(tpl.id) && (
                                <div className="mt-2 animate-fade-in-down">
                                    <StageList templateId={tpl.id} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
