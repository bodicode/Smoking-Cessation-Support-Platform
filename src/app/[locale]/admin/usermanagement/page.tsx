'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function UserManagement() {
    const t = useTranslations('admin');
    const [users, setUsers] = useState([
        { id: 1, name: 'John Doe', email: 'john@example.com', joinDate: '2023-05-20', status: 'active', role: 'user' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', joinDate: '2023-05-19', status: 'active', role: 'admin' },
        { id: 3, name: 'Robert Johnson', email: 'robert@example.com', joinDate: '2023-05-18', status: 'inactive', role: 'user' },
        { id: 4, name: 'Emily Davis', email: 'emily@example.com', joinDate: '2023-05-17', status: 'active', role: 'user' },
        { id: 5, name: 'Michael Wilson', email: 'michael@example.com', joinDate: '2023-05-16', status: 'inactive', role: 'user' },
        { id: 6, name: 'Sarah Brown', email: 'sarah@example.com', joinDate: '2023-05-15', status: 'active', role: 'moderator' },
        { id: 7, name: 'David Lee', email: 'david@example.com', joinDate: '2023-05-14', status: 'active', role: 'user' },
        { id: 8, name: 'Lisa Anderson', email: 'lisa@example.com', joinDate: '2023-05-13', status: 'inactive', role: 'user' },
        { id: 9, name: 'Thomas Martin', email: 'thomas@example.com', joinDate: '2023-05-12', status: 'active', role: 'moderator' },
        { id: 10, name: 'Jennifer Garcia', email: 'jennifer@example.com', joinDate: '2023-05-11', status: 'active', role: 'user' },
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [currentFilter, setCurrentFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newUser, setNewUser] = useState({ name: '', email: '', role: 'user' });

    const itemsPerPage = 5;
    const totalPages = Math.ceil(
        users.filter(user => {
            const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                user.email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = currentFilter === 'all' || user.status === currentFilter;
            return matchesSearch && matchesFilter;
        }).length / itemsPerPage
    );

    const filteredUsers = users
        .filter(user => {
            const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                user.email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = currentFilter === 'all' || user.status === currentFilter;
            return matchesSearch && matchesFilter;
        })
        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleAddUser = () => {
        if (newUser.name && newUser.email) {
            const id = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
            setUsers([
                ...users,
                {
                    id,
                    ...newUser,
                    joinDate: new Date().toISOString().split('T')[0],
                    status: 'active'
                }
            ]);
            setNewUser({ name: '', email: '', role: 'user' });
            setShowAddModal(false);
        }
    };

    const toggleUserStatus = (id: number) => {
        setUsers(users.map(user => {
            if (user.id === id) {
                return { ...user, status: user.status === 'active' ? 'inactive' : 'active' };
            }
            return user;
        }));
    };

    const deleteUser = (id: number) => {
        setUsers(users.filter(user => user.id !== id));
    };

    return (
        <div className="space-y-6">
            {/* Header with search and filter */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">                <div className="relative flex-grow max-w-md">
                    <input
                        type="text"
                        placeholder={t('searchUsers')}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#60C3A4]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <select
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#60C3A4]"
                        value={currentFilter}
                        onChange={(e) => setCurrentFilter(e.target.value)}
                    >
                        <option value="all">{t('allUsers')}</option>
                        <option value="active">{t('active')}</option>
                        <option value="inactive">{t('inactive')}</option>
                    </select>

                    <button
                        onClick={() => setShowAddModal(true)}
                        className="bg-[#60C3A4] hover:bg-[#4EB399] text-white px-4 py-2 rounded-lg flex items-center"
                    >
                        <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        {t('addUser')}
                    </button>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('name')}</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('email')}</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('joinDate')}</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('role')}</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('status')}</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('actions')}</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredUsers.map(user => (
                            <tr key={user.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-8 w-8 rounded-full bg-[#B5D8EB] flex items-center justify-center">
                                            <span className="text-[#03256C] font-semibold">{user.name.charAt(0)}</span>
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">{user.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">{user.joinDate}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">{user.role}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex space-x-2">                                        <button 
                                            onClick={() => toggleUserStatus(user.id)} 
                                            className={`px-3 py-1 rounded ${
                                                user.status === 'active' ? 'bg-red-100 text-red-800 hover:bg-red-200' : 'bg-green-100 text-green-800 hover:bg-green-200'
                                            }`}
                                        >
                                            {user.status === 'active' ? t('deactivate') : t('activate')}
                                        </button>
                                        <button 
                                            onClick={() => deleteUser(user.id)} 
                                            className="px-3 py-1 bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
                                        >
                                            {t('delete')}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                        <div>                            <p className="text-sm text-gray-700">
                                {t('showing')} <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> {t('to')}{' '}
                                <span className="font-medium">{Math.min(currentPage * itemsPerPage, users.length)}</span> {t('of')}{' '}
                                <span className="font-medium">{users.length}</span> {t('results')}
                            </p>
                        </div>
                        <div>
                            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 ${
                                        currentPage === 1 ? 'bg-gray-100' : 'hover:bg-gray-50'
                                    }`}
                                >
                                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                                    </svg>
                                </button>
                                
                                {/* Page numbers */}
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                            page === currentPage
                                                ? 'bg-[#60C3A4] text-white'
                                                : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                                
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 ${
                                        currentPage === totalPages ? 'bg-gray-100' : 'hover:bg-gray-50'
                                    }`}
                                >
                                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            )}

            {/* Add User Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">{t('addNewUser')}</h3>
                            <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">{t('name')}</label>
                                <input
                                    type="text"
                                    id="name"
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-[#60C3A4] focus:border-[#60C3A4]"
                                    value={newUser.name}
                                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">{t('email')}</label>
                                <input
                                    type="email"
                                    id="email"
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-[#60C3A4] focus:border-[#60C3A4]"
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="role" className="block text-sm font-medium text-gray-700">{t('role')}</label>
                                <select
                                    id="role"
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-[#60C3A4] focus:border-[#60C3A4]"
                                    value={newUser.role}
                                    onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                                >
                                    <option value="user">User</option>
                                    <option value="moderator">Moderator</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                {t('cancel')}
                            </button>
                            <button
                                onClick={handleAddUser}
                                className="px-4 py-2 bg-[#60C3A4] hover:bg-[#4EB399] text-white rounded-md"
                                disabled={!newUser.name || !newUser.email}
                            >
                                {t('addUser')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
