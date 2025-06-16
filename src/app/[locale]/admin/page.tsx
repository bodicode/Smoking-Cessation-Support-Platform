'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { 
    Users, 
    FileText, 
    BarChart3, 
    TrendingUp,
    Activity,
    Clock,
    PiggyBank,
    HeartPulse,
    MessageCircle,
    Star,
    UserCheck,
    Send,
    Medal
} from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function AdminDashboard() {
    const t = useTranslations('adminDashboard');

    const metrics = [
        { title: t('totalUsers'), value: '1,234', icon: Users, color: 'bg-blue-100 text-blue-600' },
        { title: t('revenue'), value: '12,340,000₫', icon: PiggyBank, color: 'bg-green-100 text-green-600' },
        { title: t('totalTemplates'), value: '42', icon: FileText, color: 'bg-pink-100 text-pink-600' },
        { title: t('activeCoaches'), value: '12', icon: UserCheck, color: 'bg-yellow-100 text-yellow-700' },
        { title: t('feedbackRatings'), value: '4.8/5', icon: Star, color: 'bg-purple-100 text-purple-600' },
    ];

    const recentActivities = [
        { type: 'motivation', message: 'Motivational message sent to John Doe', time: '2 hours ago', icon: Send },
        { type: 'interaction', message: 'Coach Anna replied to Mike', time: '3 hours ago', icon: MessageCircle },
        { type: 'badge', message: 'Jane earned ', badge: '7 Days Smoke-Free', time: '5 hours ago', icon: Medal },
        { type: 'badge', message: 'Sarah achieved ', badge: '30 Days Smoke-Free', time: '6 hours ago', icon: Medal },
    ];

    const revenueData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: t('revenueByMonth'),
                data: [2000000, 2500000, 3000000, 2200000, 2700000, 3400000],
                backgroundColor: '#60C3A4',
                borderRadius: 8,
            },
        ],
    };

    const revenueOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
            title: { display: false },
        },
        scales: {
            y: { beginAtZero: true, ticks: { callback: (v: number) => v.toLocaleString() + ' ₫' } },
        },
    };

    const quickActions = [
        { label: t('manageMembershipPlans'), icon: BarChart3, color: 'bg-[#60C3A4] hover:bg-[#4daa8c]', onClick: () => {} },
        { label: t('sendMotivationalMessage'), icon: Send, color: 'bg-[#B5D8EB] hover:bg-[#95cce9]', onClick: () => {} },
        { label: t('viewCommunityActivity'), icon: Users, color: 'bg-[#03256C] hover:bg-[#021a4d]', onClick: () => {} },
    ];

    return (
        <div className="space-y-8">
            <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold text-[#03256C]"
            >
                {t('dashboard')}
            </motion.h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                {metrics.map((metric, index) => (
                    <motion.div
                        key={metric.title}
                        custom={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.08, duration: 0.5, ease: 'easeOut' }}
                        className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center"
                    >
                        <div className={`p-3 rounded-lg mb-2 ${metric.color}`}>
                            <metric.icon className="w-6 h-6" />
                        </div>
                        <div className="text-sm text-gray-600 text-center">{metric.title}</div>
                        <div className="text-2xl font-bold mt-1 text-center">{metric.value}</div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white rounded-xl p-6 shadow-sm"
                >
                    <h2 className="text-xl font-semibold text-[#03256C] mb-4">{t('revenueByMonth')}</h2>
                    <div className="h-64"><Bar data={revenueData} options={revenueOptions as any} /></div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white rounded-xl p-6 shadow-sm"
                >
                    <h2 className="text-xl font-semibold text-[#03256C] mb-4">{t('quickActions')}</h2>
                    <div className="grid grid-cols-1 gap-4">
                        {quickActions.map((action, idx) => (
                            <button
                                key={action.label}
                                className={`w-full flex items-center justify-center gap-2 p-4 text-white rounded-lg font-semibold text-base transition-colors ${action.color}`}
                                onClick={action.onClick}
                            >
                                <action.icon className="w-5 h-5" /> {action.label}
                            </button>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
} 