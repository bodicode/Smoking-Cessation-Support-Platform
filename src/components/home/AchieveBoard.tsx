'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { getStreakLeaderboard } from '@/services/userService';
import { useAuth } from '@/hooks/useAuth';

const Achieveboard = () => {
    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const [myRank, setMyRank] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        // Chỉ gọi API khi có user đăng nhập
        if (user?.accessToken) {
            setLoading(true);
            getStreakLeaderboard(10, 0)
                .then((data) => {
                    setLeaderboard(data.data || []);
                    setMyRank(data.myRank || null);
                })
                .catch((error) => {
                    console.error('Error fetching leaderboard:', error);
                    setLeaderboard([]);
                    setMyRank(null);
                })
                .finally(() => setLoading(false));
        } else {
            // Reset data khi không có user
            setLeaderboard([]);
            setMyRank(null);
            setLoading(false);
        }
    }, [user?.accessToken]);

    const getRankIcon = (rank: number) => {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return `#${rank}`;
    };

    const listVariants = {
        hidden: { opacity: 0, y: 32 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.12,
                type: "spring",
                stiffness: 200,
                damping: 18,
            },
        }),
    };

    // Không hiển thị khi không có user
    if (!user?.accessToken) {
        return null;
    }

    if (loading)
        return (
            <div className="max-w-3xl mx-auto mt-8 p-4 space-y-4 animate-pulse">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div
                        key={i}
                        className="bg-gray-100 rounded-lg p-4 h-[88px]"
                    />
                ))}
            </div>
        );

    return (
        <motion.div
            className="max-w-5xl mx-auto mt-6 p-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            transition={{ staggerChildren: 0.1 }}
        >
            <motion.h2
                className="text-3xl font-bold text-center mb-6 text-[#03256C]"
                initial={{ opacity: 0, y: -24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className='flex items-center gap-2 justify-center'>
                    Bảng xếp hạng chuỗi ngày không hút thuốc
                </div>
            </motion.h2>

            <div className="space-y-4">
                {leaderboard.map((item, idx) => {
                    const isMe = myRank && item.userId === myRank.userId;
                    return (
                        <motion.div
                            key={item.userId}
                            className={`flex flex-col sm:flex-row items-center justify-between bg-white border border-gray-200 p-4 rounded-xl shadow-md transition-all duration-200 hover:shadow-lg ${isMe ? 'ring-2 ring-blue-400 bg-blue-50' : ''
                                }`}
                            custom={idx}
                            variants={listVariants}
                            initial="hidden"
                            whileInView="visible"
                        >
                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-lg font-bold text-blue-700">
                                    {getRankIcon(item.rank)}
                                </div>
                                <div>
                                    <p className={`text-lg font-semibold ${isMe ? 'text-blue-700' : 'text-gray-800'}`}>
                                        {item.name}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Chuỗi ngày không hút thuốc: <b>{item.streak}</b>
                                    </p>
                                </div>
                            </div>
                            {isMe && (
                                <span className="mt-2 sm:mt-0 text-xs font-bold bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                                    Bạn
                                </span>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
};

export default Achieveboard;
