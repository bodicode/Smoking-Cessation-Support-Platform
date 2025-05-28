'use client';

import { usePathname, useParams } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const params = useParams();
    const locale = (params.locale as string) || 'vi';
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const t = useTranslations('admin');

    return (
        <div className="flex h-screen bg-[#f9f5ec]">
            {/* Sidebar */}
            <div className={`
                ${isSidebarOpen ? 'w-64' : 'w-20'}
                bg-[#60C3A4] text-white transition-all duration-300 overflow-hidden
                min-h-screen shadow-lg flex flex-col
            `}>
                <div className="p-5 flex items-center justify-between">
                    <Link href={`/${locale}/admin/dashboard`} className={`font-bold text-xl ${!isSidebarOpen && 'hidden'}`}>
                        ReAir Admin
                    </Link>
                    <Link href={`/${locale}/admin/dashboard`} className={`font-bold text-xl ${isSidebarOpen && 'hidden'}`}>
                        RA
                    </Link>
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-white">
                        {isSidebarOpen ? '◀' : '▶'}
                    </button>
                </div>

                <div className="flex flex-col flex-1 mt-8">                    <Link 
                        href={`/${locale}/admin/dashboard`}
                        className={`
                            flex items-center px-5 py-3
                            ${pathname?.includes('/admin/dashboard') ? 'bg-[#03256C] text-white' : 'hover:bg-[#4EB399] text-white'}
                        `}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" />
                        </svg>
                        {isSidebarOpen && <span className="ml-3">{t('dashboard')}</span>}
                    </Link>

                    <Link 
                        href={`/${locale}/admin/usermanagement`}
                        className={`
                            flex items-center px-5 py-3
                            ${pathname?.includes('/admin/usermanagement') ? 'bg-[#03256C] text-white' : 'hover:bg-[#4EB399] text-white'}
                        `}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        {isSidebarOpen && <span className="ml-3">{t('userManagement')}</span>}
                    </Link>
                </div>                <div className="p-5">
                    <Link 
                        href={`/${locale}/`}
                        className="flex items-center text-white hover:bg-[#4EB399] px-4 py-2 rounded"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        {isSidebarOpen && <span className="ml-3">{t('backToSite')}</span>}
                    </Link>
                </div>
            </div>

            {/* Main content */}
            <div className="flex-1 overflow-auto">                <div className="bg-[#60C3A4] text-white shadow-md p-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold">{pathname?.includes('dashboard') ? t('dashboard') : t('userManagement')}</h1>
                        <div className="flex items-center space-x-4">
                            <span className="font-medium">Admin User</span>
                            <div className="h-10 w-10 rounded-full bg-[#B5D8EB] text-center flex items-center justify-center">
                                <span className="text-[#03256C] font-bold">A</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
}
