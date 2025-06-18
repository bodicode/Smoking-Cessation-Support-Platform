'use client';

import { Clock, CigaretteOff, PiggyBank } from "lucide-react";

export default function SmokeFreeSummary({
    planCreatedAt,
    records,
    avgPricePerPack = 15000,
    cigarettesPerPack = 20,
}: {
    planCreatedAt: string,
    records: any[],
    avgPricePerPack?: number,
    cigarettesPerPack?: number
}) {
    const lastRecord = records.length ? records[records.length - 1] : null;
    const start = new Date(planCreatedAt);
    const end = lastRecord
        ? new Date(lastRecord.record_date)
        : new Date();
    const diff = end.getTime() - start.getTime();
    const days = Math.max(1, Math.floor(diff / (1000 * 60 * 60 * 24)));

    const totalCigs = records.reduce((acc, cur) => acc + (cur.cigarettes_smoked ?? 0), 0);
    const totalMoney = (totalCigs / cigarettesPerPack) * avgPricePerPack;
    const avgHealth = records.length
        ? (records.reduce((acc, cur) => acc + (cur.health_score ?? 0), 0) / records.length).toFixed(1)
        : "--";

    return (
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-7">
            <div className="flex-1 flex flex-col items-center">
                <Clock className="w-7 h-7 mb-1 text-[#01613B]" />
                <div className="text-sm text-[#01613B] font-medium">Tổng số ngày</div>
                <div className="font-mono text-2xl font-bold text-[#01613B]">{days}</div>
            </div>
            <div className="flex-1 flex flex-col items-center">
                <CigaretteOff className="w-7 h-7 mb-1 text-[#60C3A4]" />
                <div className="text-sm text-[#60C3A4] font-medium">Điếu không hút</div>
                <div className="font-mono text-2xl font-bold text-[#60C3A4]">{totalCigs}</div>
            </div>
            <div className="flex-1 flex flex-col items-center">
                <PiggyBank className="w-7 h-7 mb-1 text-[#F4B400]" />
                <div className="text-sm text-[#F4B400] font-medium">Tiền tiết kiệm</div>
                <div className="font-mono text-2xl font-bold text-[#F4B400]">{totalMoney.toLocaleString("vi-VN")} ₫</div>
            </div>
            <div className="flex-1 flex flex-col items-center">
                <span className="w-7 h-7 mb-1 flex items-center justify-center text-blue-600 font-extrabold text-lg">❤️</span>
                <div className="text-sm text-blue-600 font-medium">Sức khỏe TB</div>
                <div className="font-mono text-2xl font-bold text-blue-600">{avgHealth}</div>
            </div>
        </div>
    );
}
