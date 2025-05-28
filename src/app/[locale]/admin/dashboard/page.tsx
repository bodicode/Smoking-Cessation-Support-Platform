'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function AdminDashboard() {
    const t = useTranslations('admin');
    
    // Sample data for the dashboard
    const [stats] = useState({
        totalUsers: 1245,
        activeUsers: 978,
        newUsers: 87,
        totalProgramsCompleted: 432
    });

    const [recentUsers] = useState([
        { id: 1, name: 'John Doe', email: 'john@example.com', joinDate: '2023-05-20', status: 'active' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', joinDate: '2023-05-19', status: 'active' },
        { id: 3, name: 'Robert Johnson', email: 'robert@example.com', joinDate: '2023-05-18', status: 'inactive' },
        { id: 4, name: 'Emily Davis', email: 'emily@example.com', joinDate: '2023-05-17', status: 'active' },
        { id: 5, name: 'Michael Wilson', email: 'michael@example.com', joinDate: '2023-05-16', status: 'inactive' }
    ]);

    return (
        <div className="space-y-6">
            {/* Stats Cards */}            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-gray-500 text-sm font-medium">{t('totalUsers')}</h3>
                    <p className="text-3xl font-bold text-[#03256C]">{stats.totalUsers}</p>
                    <div className="mt-2 flex items-center text-sm">
                        <span className="text-green-500">↑ 12%</span>
                        <span className="text-gray-500 ml-2">from last month</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-gray-500 text-sm font-medium">{t('activeUsers')}</h3>
                    <p className="text-3xl font-bold text-[#03256C]">{stats.activeUsers}</p>
                    <div className="mt-2 flex items-center text-sm">
                        <span className="text-green-500">↑ 8%</span>
                        <span className="text-gray-500 ml-2">from last month</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-gray-500 text-sm font-medium">{t('newUsers')}</h3>
                    <p className="text-3xl font-bold text-[#03256C]">{stats.newUsers}</p>
                    <div className="mt-2 flex items-center text-sm">
                        <span className="text-green-500">↑ 24%</span>
                        <span className="text-gray-500 ml-2">from last month</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-gray-500 text-sm font-medium">{t('programsCompleted')}</h3>
                    <p className="text-3xl font-bold text-[#03256C]">{stats.totalProgramsCompleted}</p>
                    <div className="mt-2 flex items-center text-sm">
                        <span className="text-green-500">↑ 15%</span>
                        <span className="text-gray-500 ml-2">from last month</span>
                    </div>
                </div>
            </div>

            {/* Charts Section */}            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold mb-4">{t('userGrowth')}</h2>
                    <div className="bg-gray-100 h-64 rounded flex items-center justify-center">
                        <p className="text-gray-500">Chart visualization would go here</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold mb-4">{t('activityOverview')}</h2>
                    <div className="bg-gray-100 h-64 rounded flex items-center justify-center">
                        <p className="text-gray-500">Chart visualization would go here</p>
                    </div>
                </div>
            </div>

            {/* Recent Users */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold mb-4">{t('recentUsers')}</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('name')}</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('email')}</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('joinDate')}</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('status')}</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {recentUsers.map((user) => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">{user.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">{user.joinDate}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                            {user.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
