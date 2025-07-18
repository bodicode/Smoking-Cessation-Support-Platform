'use client';

import SidebarCoach from '@/components/coach/Sidebar';
import useRequireRole from '@/hooks/useRequireRole';

export default function CoachLayout({ children }: { children: React.ReactNode }) {
    useRequireRole("COACH");

    return (
        <div className="min-h-screen flex bg-[#f9f5ec]">
            <SidebarCoach />
            <main className="flex-1 p-5 md:p-8">{children}</main>
        </div>
    );
}
