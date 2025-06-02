'use client';

import { AlertCircle, Bell, CheckCircle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { notifications } from '../../../data';
import { motion } from "framer-motion";

export default function Notification() {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        if (open) document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [open]);

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="relative mt-1.5" ref={ref}>
            <button
                className="cursor-pointer relative p-2 rounded-full hover:bg-[#B5D8EB]/30 transition"
                onClick={() => setOpen(o => !o)}
                aria-label="Thông báo"
            >
                <motion.span
                    whileHover={{
                        rotate: [0, -18, 18, -12, 12, -7, 7, 0],
                        transition: { duration: 0.6 },
                    }}
                    style={{ display: "inline-block" }}
                >
                    <Bell className="w-5 h-5" />
                </motion.span>
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 leading-none">
                        {unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 z-50 mt-2 w-80 max-w-[90vw] bg-white rounded-xl shadow-xl border text-black">
                    <div style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                    }}
                        className="max-h-80 rounded-3xl overflow-y-auto scrollbar-">
                        {notifications.length === 0 && (
                            <div className="p-4 text-gray-500 text-sm text-center">Không có thông báo mới.</div>
                        )}
                        {notifications.map(n => (
                            <div
                                key={n.id}
                                className={`px-4 py-3 flex gap-3 items-start border-b last:border-0 
                  ${n.read ? 'bg-white' : 'bg-[#E6F8F2]'}`}
                            >
                                {n.read ? (
                                    <CheckCircle className="w-5 h-5 mt-1 flex-shrink-0 text-gray-300" />
                                ) : (
                                    <AlertCircle className="w-5 h-5 mt-1 flex-shrink-0 text-green-500" />
                                )}
                                <div className="flex-1">
                                    <div className="font-semibold">{n.title}</div>
                                    {n.description && <div className="text-sm text-gray-600">{n.description}</div>}
                                    <div className="text-xs text-gray-400 mt-1">{n.time}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
