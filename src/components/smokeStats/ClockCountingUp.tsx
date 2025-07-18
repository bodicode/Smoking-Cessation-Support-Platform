'use client';

import { useEffect, useState } from "react";
import { CalendarCheck2 } from "lucide-react";

function pad(num: number) {
    return num.toString().padStart(2, "0");
}

export default function ClockCountUp({ startDate, targetDate }: { startDate: string, targetDate?: string }) {
    const [now, setNow] = useState(new Date());
    const target = targetDate ? new Date(targetDate) : undefined;
    const isStopped = target && now >= target;

    useEffect(() => {
        if (isStopped) return;
        const interval = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(interval);
    }, [isStopped]);

    const start = new Date(startDate);
    const end = isStopped && target ? target : now;
    const diff = end.getTime() - start.getTime();

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return (
        <div className="w-full flex flex-col items-center bg-[#ecf7f1] py-8 px-4 rounded-2xl mb-8">

            <div className="flex gap-3 md:gap-7 items-end font-bold text-4xl md:text-6xl text-[#a78bfa] mt-2 mb-3">
                <span>{pad(days)}</span>
                <span className="text-[#b5d8eb]">:</span>
                <span>{pad(hours)}</span>
                <span className="text-[#b5d8eb]">:</span>
                <span>{pad(minutes)}</span>
                <span className="text-[#b5d8eb]">:</span>
                <span>{pad(seconds)}</span>
            </div>
            <div className="flex gap-10 text-[#7ca09c] text-lg md:text-xl font-semibold">
                <span className="flex flex-col items-center -mt-1">
                    <span className="text-sm md:text-base font-normal">ngày</span>
                </span>
                <span className="flex flex-col items-center -mt-1">
                    <span className="text-sm md:text-base font-normal">giờ</span>
                </span>
                <span className="flex flex-col items-center -mt-1">
                    <span className="text-sm md:text-base font-normal">phút</span>
                </span>
                <span className="flex flex-col items-center -mt-1">
                    <span className="text-sm md:text-base font-normal">giây</span>
                </span>
            </div>
        </div>
    );
}
