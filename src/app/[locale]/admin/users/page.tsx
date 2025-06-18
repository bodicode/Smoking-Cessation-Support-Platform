"use client";

import { useTranslations } from 'next-intl';
import { Pencil, Trash2, Medal } from 'lucide-react';
import { useState } from 'react';

export default function AdminUsers() {
  const t = useTranslations('adminUsers');

  // Dummy data for demonstration
  const allUsers = [
    { name: 'Nguyen Van A', email: 'a@email.com', role: 'Admin', membership: 'Premium', smokeFreeDays: 45, badges: ['🔥 7-Day Streak', '💰 500K Saved'] },
    { name: 'Tran Thi B', email: 'b@email.com', role: 'User', membership: 'Free', smokeFreeDays: 12, badges: ['⭐ 7-Day Streak'] },
  ];

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [membershipFilter, setMembershipFilter] = useState('');

  const filteredUsers = allUsers.filter(user =>
    (user.name.toLowerCase().includes(search.toLowerCase()) || user.email.toLowerCase().includes(search.toLowerCase())) &&
    (roleFilter ? user.role === roleFilter : true) &&
    (membershipFilter ? user.membership === membershipFilter : true)
  );

  const roles = Array.from(new Set(allUsers.map(u => u.role)));
  const memberships = Array.from(new Set(allUsers.map(u => u.membership)));

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#03256C] mb-1">{t('userManagement')}</h1>
          <p className="text-gray-500 text-sm">{t('manageUsers')}</p>
        </div>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full md:w-1/3"
          />
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full md:w-1/4"
          >
            <option value="">{t('allRoles')}</option>
            {roles.map(role => <option key={role} value={role}>{role}</option>)}
          </select>
          <select
            value={membershipFilter}
            onChange={e => setMembershipFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full md:w-1/4"
          >
            <option value="">{t('allMemberships')}</option>
            {memberships.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">No</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">{t('userList')}</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">Email</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">{t('role')}</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">{t('membership')}</th>
                <th className="px-8 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">{t('smokeFreeDays')}</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">{t('badges')}</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50" + " hover:bg-blue-50 transition-colors"}>
                  <td className="px-4 py-3 whitespace-nowrap">{idx + 1}</td>
                  <td className="px-6 py-3 whitespace-nowrap">{user.name}</td>
                  <td className="px-6 py-3 whitespace-nowrap">{user.email}</td>
                  <td className="px-6 py-3 whitespace-nowrap">{user.role}</td>
                  <td className="px-6 py-3 whitespace-nowrap">{user.membership}</td>
                  <td className="px-8 py-3 whitespace-nowrap text-center">{user.smokeFreeDays}</td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {user.badges.map((badge, i) => (
                        <span key={i} className="inline-flex items-center bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full text-xs font-semibold">
                          <Medal className="w-4 h-4 mr-1 inline" />{badge}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap space-x-2">
                    <button className="inline-flex items-center gap-1 border border-blue-500 text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-50 transition text-sm font-medium">
                      <Pencil className="w-4 h-4" /> {t('editUser')}
                    </button>
                    <button className="inline-flex items-center gap-1 border border-red-500 text-red-600 px-3 py-1 rounded-lg hover:bg-red-50 transition text-sm font-medium">
                      <Trash2 className="w-4 h-4" /> {t('deleteUser')}
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-6 text-gray-400">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 