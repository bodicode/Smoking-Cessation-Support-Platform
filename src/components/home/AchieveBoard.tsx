'use client';

import { motion } from 'framer-motion';

const Achieveboard = () => {
    const leaderboard = [
        {
            name: "Nguyễn Văn A",
            avatar: "https://i.pravatar.cc/100?img=1",
            daysSmokeFree: 45,
            moneySaved: 90.000,
            badges: ["🔥 7-Day Streak", "💰 500K Saved"],
        },
        {
            name: "Trần Thị B",
            avatar: "https://i.pravatar.cc/100?img=2",
            daysSmokeFree: 30,
            moneySaved: 60.000,
            badges: ["💪 30-Day Clean", "🎯 Goal Setter"],
        },
        {
            name: "Lê Văn C",
            avatar: "https://i.pravatar.cc/100?img=3",
            daysSmokeFree: 15,
            moneySaved: 30.000,
            badges: ["⭐ 15-Day Mark"],
        },
    ];

    const listVariants = {
        hidden: { opacity: 0, y: 32 },
        visible: (i: any) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.16,
                type: "spring",
                stiffness: 200,
                damping: 16
            }
        })
    };

    return (
        <motion.div
            className="max-w-5xl mx-auto mt-4 p-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            transition={{ staggerChildren: 0.16 }}
        >
            <motion.h2
                className="text-2xl font-bold text-center mb-6 text-[#03256C]"
                initial={{ opacity: 0, y: -32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, type: "spring", stiffness: 200 }}
            >
                Bảng xếp hạng
            </motion.h2>

            <div className="space-y-4">
                {leaderboard.map((user, idx) => (
                    <motion.div
                        key={idx}
                        className="flex flex-col sm:flex-row items-center justify-between bg-gray-100 p-4 rounded-lg shadow-sm gap-4"
                        custom={idx}
                        variants={listVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <div className="flex items-center space-x-4 w-full sm:w-auto">
                            <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-12 h-12 rounded-full object-cover"
                            />
                            <div>
                                <p className="text-lg font-semibold text-[#03256C]">
                                    {user.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {user.daysSmokeFree} ngày không hút thuốc
                                </p>
                                <p className="text-sm text-green-600 font-medium">
                                    {user.moneySaved.toLocaleString()} đồng đã tiết kiệm
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 justify-start sm:justify-end w-full sm:w-auto mt-2 sm:mt-0">
                            {user.badges.map((badge, i) => (
                                <motion.span
                                    key={i}
                                    whileHover={{ scale: 1.1, rotate: -2 }}
                                    transition={{ type: "spring", stiffness: 280, damping: 14 }}
                                    className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium cursor-pointer"
                                >
                                    {badge}
                                </motion.span>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default Achieveboard;
