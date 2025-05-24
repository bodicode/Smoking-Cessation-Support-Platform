'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const hideLayout = pathname?.includes('/login') || pathname?.includes('/signup');

    return (
        <div className='bg-[#f9f5ec]'>
            {!hideLayout && <Header />}
            {children}
            {!hideLayout && <Footer />}
        </div>
    );
}
