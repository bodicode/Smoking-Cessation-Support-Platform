'use client';

import { SmokeFreeStatsProps } from '@/types/components/smokeFreeStats';
import Loading from '../common/Loading';
import ClockCountUp from '../smokeStats/ClockCountingUp';
import SmokeFreeChart from '../smokeStats/SmokeFreeChart';
import SmokeFreeSummary from '../smokeStats/SmokeFreeSummary';

export default function SmokeFreeStats({
    plan,
    records,
    loading,
    avgPricePerPack = 15000,
    cigarettesPerPack = 20,
}: SmokeFreeStatsProps) {
    if (loading) return <Loading />;

    return (
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-[#F2F9F1] to-[#D6ECE1] shadow-xl rounded-3xl p-8 md:p-12 flex flex-col gap-8 border border-[#bde8ce] mb-12">

            <h2 className="text-3xl md:text-4xl font-bold text-[#01613B] flex items-center justify-center gap-2 mb-2">
                Thống kê quá trình bỏ thuốc của bạn
            </h2>

            <ClockCountUp startDate={plan.created_at} targetDate={plan.target_date} />

            <SmokeFreeSummary
                planCreatedAt={plan.created_at}
                records={records}
                avgPricePerPack={avgPricePerPack}
                cigarettesPerPack={cigarettesPerPack}
            />

            <div className="mt-4">
                <h3 className="font-bold text-3xl mb-3 text-[#01613B] text-center">Biểu đồ quá trình thực tế</h3>
                <SmokeFreeChart records={records} />
            </div>
            <div className="text-xs text-gray-500 mt-3 text-center">
                * Số liệu thực tế lấy từ ghi nhận mỗi ngày của bạn, nên phiền bạn hãy cập nhật mỗi ngày nhé!
            </div>
        </div>
    );
}
