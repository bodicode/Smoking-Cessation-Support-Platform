'use client';

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
import { useQuery } from '@apollo/client';
import { GET_DASHBOARD_METRICS, type DashboardStats, type RevenueByMonth } from '@/graphql/queries/payments';

export default function AdminDashboard() {
    const { data, loading, error } = useQuery(GET_DASHBOARD_METRICS);
    const stats: DashboardStats | undefined = data?.getDashboardMetrics?.stats;
    const revenueByMonth: RevenueByMonth[] = data?.getDashboardMetrics?.revenueByMonth || [];

    // Get last 6 months including current month
    const now = new Date();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentMonthIdx = now.getMonth();
    const last6Months = [];
    for (let i = 5; i >= 0; i--) {
        let idx = (currentMonthIdx - i + 12) % 12;
        last6Months.push(monthNames[idx]);
    }
    const filteredRevenue = last6Months.map(month => {
        const found = revenueByMonth.find(r => r.month === month);
        return found ? found.revenue : 0;
    });

    const revenueData = {
        labels: last6Months,
        datasets: [
            {
                label: 'Doanh thu theo tháng',
                data: filteredRevenue,
                backgroundColor: '#60C3A4',
                borderRadius: 8,
            },
        ],
    };

    const metrics = [
        { title: 'Tổng người dùng', value: stats ? stats.totalUsers.toLocaleString() : '...', icon: Users, color: 'bg-blue-100 text-blue-600' },
        { title: 'Doanh thu', value: stats ? stats.totalRevenue.toLocaleString('vi-VN') + '₫' : '...', icon: PiggyBank, color: 'bg-green-100 text-green-600' },
        { title: 'Tổng số mẫu kế hoạch', value: stats ? stats.totalCessationTemplates.toLocaleString() : '...', icon: FileText, color: 'bg-pink-100 text-pink-600' },
        { title: 'Tổng số coach', value: stats ? stats.totalCoaches.toLocaleString() : '...', icon: UserCheck, color: 'bg-yellow-100 text-yellow-700' },
        { title: 'Đánh giá', value: stats ? stats.averageTemplateRating.toFixed(2) + '/5' : '...', icon: Star, color: 'bg-purple-100 text-purple-600' },
    ];

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
        { label: 'Quản lý gói thành viên', icon: BarChart3, color: 'bg-[#60C3A4] hover:bg-[#4daa8c]', onClick: () => {} },
        { label: 'Gửi tin nhắn khích lệ', icon: Send, color: 'bg-[#B5D8EB] hover:bg-[#95cce9]', onClick: () => {} },
        { label: 'Xem hoạt động cộng đồng', icon: Users, color: 'bg-[#03256C] hover:bg-[#021a4d]', onClick: () => {} },
    ];

    if (loading) return <div className="p-8 text-center">Đang tải dữ liệu dashboard...</div>;
    if (error) return <div className="p-8 text-center text-red-500">Lỗi tải dữ liệu dashboard</div>;

    return (
        <div className="space-y-8">
            <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold text-[#03256C]"
            >
                Dashboard
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
                    <h2 className="text-xl font-semibold text-[#03256C] mb-4">Doanh thu theo tháng</h2>
                    <div className="h-64"><Bar data={revenueData} options={revenueOptions as any} /></div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white rounded-xl p-6 shadow-sm"
                >
                    <h2 className="text-xl font-semibold text-[#03256C] mb-4">Hành động nhanh</h2>
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