'use client';

import { SmokeStatsProps } from '@/types/components/smokeStats';
import { pad } from '@/utils';
import { useEffect, useState } from 'react';
import {
    CalendarCheck2,
    CigaretteOff,
    PiggyBank,
    Clock,
} from 'lucide-react';
import Loading from '../Loading';

export default function SmokeFreeStats({
    startDate,
    avgPerDay = 10,
    avgPricePerPack = 32000,
    cigarettesPerPack = 20,
}: SmokeStatsProps) {
    const [mounted, setMounted] = useState(false);
    const [now, setNow] = useState<Date>(new Date());

    useEffect(() => {
        setMounted(true);
        const interval = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    if (!mounted) return <Loading />;

    const start = new Date(startDate);
    const diff = now.getTime() - start.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    const totalCigs = Math.round((diff / (1000 * 60 * 60 * 24)) * avgPerDay);
    const totalMoney = ((totalCigs / cigarettesPerPack) * avgPricePerPack);

    return (
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-[#F2F9F1] to-[#D6ECE1] shadow-xl rounded-3xl p-8 md:p-12 flex flex-col items-center gap-7 border border-[#bde8ce]">
            <h2 className="text-3xl md:text-4xl font-bold text-[#01613B] mb-2 flex items-center gap-2">
                <CalendarCheck2 className="w-8 h-8 text-[#1cb178]" /> Thời gian bỏ thuốc của bạn
            </h2>
            <div className="flex gap-3 text-4xl md:text-5xl font-mono font-bold text-[#2E6E4C]">
                <span className="flex flex-col items-center">
                    {pad(days)}
                    <span className="block text-xs font-normal text-gray-500 -mt-1">ngày</span>
                </span>
                <span className="text-[#B5D8EB]">:</span>
                <span className="flex flex-col items-center">
                    {pad(hours)}
                    <span className="block text-xs font-normal text-gray-500 -mt-1">giờ</span>
                </span>
                <span className="text-[#B5D8EB]">:</span>
                <span className="flex flex-col items-center">
                    {pad(minutes)}
                    <span className="block text-xs font-normal text-gray-500 -mt-1">phút</span>
                </span>
                <span className="text-[#B5D8EB]">:</span>
                <span className="flex flex-col items-center">
                    {pad(seconds)}
                    <span className="block text-xs font-normal text-gray-500 -mt-1">giây</span>
                </span>
            </div>
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
                <div className="flex items-center gap-3 bg-white rounded-xl shadow p-4 border-l-4 border-[#01613B]">
                    <Clock className="w-8 h-8 text-[#01613B]" />
                    <div>
                        <span className="text-lg font-medium text-[#01613B]">Tổng số ngày</span>
                        <div className="font-bold text-xl">{days} ngày</div>
                    </div>
                </div>
                <div className="flex items-center gap-3 bg-white rounded-xl shadow p-4 border-l-4 border-[#60C3A4]">
                    <CigaretteOff className="w-8 h-8 text-[#60C3A4]" />
                    <div>
                        <span className="text-lg font-medium text-[#60C3A4]">Điếu thuốc bạn đã không hút</span>
                        <div className="font-bold text-xl">{totalCigs} điếu</div>
                    </div>
                </div>
                <div className="flex items-center gap-3 bg-white rounded-xl shadow p-4 border-l-4 border-[#F4B400]">
                    <PiggyBank className="w-8 h-8 text-[#F4B400]" />
                    <div>
                        <span className="text-lg font-medium text-[#F4B400]">Tiền tiết kiệm</span>
                        <div className="font-bold text-xl">{totalMoney.toLocaleString('vi-VN')} ₫</div>
                    </div>
                </div>
            </div>
            <div className="text-xs text-gray-500 mt-3 text-center">
                * Số liệu tính dựa trên trung bình <span className="font-semibold">{avgPerDay} điếu/ngày</span>, <span className="font-semibold">{avgPricePerPack.toLocaleString('vi-VN')}₫/bao</span> {cigarettesPerPack} điếu.
            </div>
        </div>
    );
}
