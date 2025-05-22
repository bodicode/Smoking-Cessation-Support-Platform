'use client';

import { useTranslations } from 'next-intl';

const Achieveboard = () => {
    const t = useTranslations('achieve');

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

    return (
        <div className="max-w-4xl mx-auto mt-4 p-4 bg-white rounded-xl shadow-md">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
                {t('leaderboardTitle')}
            </h2>

            <div className="space-y-4">
                {leaderboard.map((user, idx) => (
                    <div
                        key={idx}
                        className="flex items-center justify-between bg-gray-100 p-4 rounded-lg shadow-sm"
                    >
                        <div className="flex items-center space-x-4">
                            <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-12 h-12 rounded-full"
                            />
                            <div>
                                <p className="text-lg font-semibold text-gray-700">
                                    {user.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {t('daysSmokeFree', { days: user.daysSmokeFree })}
                                </p>
                                <p className="text-sm text-green-600 font-medium">
                                    {t('moneySaved', {
                                        amount: user.moneySaved.toLocaleString(),
                                    })}
                                </p>
                            </div>
                        </div>

                        <div className="text-sm text-right space-y-1">
                            {user.badges.map((badge, i) => (
                                <span
                                    key={i}
                                    className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full inline-block"
                                >
                                    {badge}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Achieveboard;
