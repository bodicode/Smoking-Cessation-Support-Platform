"use client";

import { useEffect, useState } from "react";
import Loading from "@/components/common/Loading";
import Breadcrumbs from "@/components/common/BreadCrumb";
import CustomStages from "@/components/template/CustomStage";
import { getCessationPlan } from "@/services/cessationPlanService";

export default function MyPlanDetailPage() {
    const [plans, setPlans] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        getCessationPlan()
            .then(setPlans)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-80">
                <Loading />
            </div>
        );
    }

    if (!plans || plans.length === 0) {
        return (
            <div className="text-center text-red-500 py-20">
                Không tìm thấy kế hoạch nào.
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto mt-10">
            <Breadcrumbs
                items={[
                    { label: "Trang chủ", href: "/" },
                    { label: "Kế hoạch của tôi", active: true }
                ]}
            />

            {plans.map((plan) => (
                <div
                    key={plan.id}
                    className="bg-white rounded-2xl shadow p-6 mb-8"
                >
                    <h1 className="text-2xl font-extrabold text-sky-700 mb-2">
                        {plan.name || `Kế hoạch #${plan.id}`}
                    </h1>
                    <div className="text-gray-700 mb-2">
                        <b>Ngày bắt đầu:</b> {plan.start_date}
                    </div>
                    <div className="text-gray-700 mb-2">
                        <b>Ngày mục tiêu:</b> {plan.target_date}
                    </div>
                    {plan.reason && (
                        <div className="text-gray-700 mb-2">
                            <b>Lý do bỏ thuốc:</b> {plan.reason}
                        </div>
                    )}
                    <div className="text-gray-700 mb-2">
                        <b>Tiến độ:</b> {plan.completion_percentage ?? 0}%
                    </div>

                    <h2 className="font-bold text-xl mb-6 text-sky-700 mt-8">Các giai đoạn kế hoạch</h2>
                    <CustomStages
                        planId={plan.id}
                        stages={plan.stages || []}
                        refetch={async () => {
                            // Refetch toàn bộ danh sách
                            setLoading(true);
                            const data = await getCessationPlan();
                            setPlans(data);
                            setLoading(false);
                        }}
                    />
                </div>
            ))}
        </div>
    );
}
