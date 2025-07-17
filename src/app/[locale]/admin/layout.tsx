'use client';

import useRequireRole from '@/hooks/useRequireRole';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import {
    Users,
    Settings,
    BarChart3,
    FileText,
    LayoutDashboard,
    Medal,
    LogOut
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { clearUser } from '@/store/userSlice';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    useRequireRole("ADMIN");
    const params = useParams();
    const locale = (params.locale as string) || 'vi';
    const pathname = usePathname();

    const dispatch = useDispatch()
    const router = useRouter()

    const menu = [
        { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/admin/users', label: 'Người dùng', icon: Users },
        { href: '/admin/reports', label: 'Báo cáo', icon: BarChart3 },
        { href: '/admin/templates', label: 'Mẫu kế hoạch', icon: FileText },
        { href: '/admin/badges', label: 'Huy hiệu', icon: Medal },
        { href: '/admin/profile-quiz', label: 'Quiz', icon: Medal },
    ];

    return (
        <div className="min-h-screen flex bg-[#f9f5ec]">
            <aside className="w-64 bg-white shadow-lg p-4 flex flex-col">
                <div className="mb-8 flex justify-center items-center">
                    <Image src="/images/logo.png" alt="Logo" width={120} height={40} className="object-contain" />
                </div>
                <nav className="flex flex-col gap-2 flex-1">
                    {menu.map(item => (
                        <Link
                            href={`/${locale}${item.href}`}
                            key={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-nowrap transition-all text-base
                                ${pathname.startsWith(item.href)
                                    ? 'bg-[#60C3A4] text-white shadow'
                                    : 'text-gray-600 hover:bg-[#e0f2f1] hover:text-[#03256C]'
                                }`}
                        >
                            <item.icon className="w-4 h-4" />
                            {item.label}
                        </Link>
                    ))}
                </nav>
                <button
                    onClick={() => {
                        dispatch(clearUser());
                        localStorage.removeItem("access_token");
                        router.push(`/login`);
                    }}
                    className="cursor-pointer flex items-center gap-2 px-4 py-2 mt-6 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-800 font-semibold transition shadow"
                >
                    <LogOut className="w-4 h-4" />
                    Đăng xuất
                </button>
            </aside>

            <main className="flex-1 min-h-screen p-5 md:p-8 w-[700px]">
                {children}
            </main>
        </div>
    );
}
