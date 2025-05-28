'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';
import AdminLayout from '@/components/admin/AdminLayout';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const hideLayout = pathname?.includes('/login') || pathname?.includes('/signup');
    const isAdminRoute = pathname?.includes('/admin');

    if (isAdminRoute) {
        return <AdminLayout>{children}</AdminLayout>;
    }

    return (
        <div className='bg-[#f9f5ec]'>
            {!hideLayout && <Header />}
            {children}
            {!hideLayout && <Footer />}
        </div>
    );
}
