"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FileText,
  BookOpen,
  LogOut,
  MessageCircle,
  Award,
  User,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { clearUser } from "@/store/userSlice";
import { useEffect, useState } from "react";
import { ChatService } from "@/services/chatService";

const menu = [
  { label: "Chat", icon: MessageCircle, href: "/coach/chat" },
  { label: "Quản lý Blog", icon: BookOpen, href: "/coach/blogs" },
  { label: "Quản lý Kế hoạch", icon: FileText, href: "/coach/templates" },
  {
    label: "Quản lý Tiêu chí Sức khỏe",
    icon: Award,
    href: "/coach/health-criteria",
  },
  { label: "Hồ sơ cá nhân", icon: User, href: "/coach/profile" },
];

export default function SidebarCoach() {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();

  // Hydrate from localStorage for instant feedback
  const [unreadCount, setUnreadCount] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("coach_unread_count");
      return stored ? parseInt(stored, 10) : 0;
    }
    return 0;
  });

  useEffect(() => {
    // Subscribe to unread count changes (totalCount for the account)
    const unsubscribe = ChatService.subscribeToUnreadCountChanged(
      ({ totalCount }) => {
        setUnreadCount(totalCount > 0 ? totalCount : 0);
        // Save to localStorage for next mount
        localStorage.setItem("coach_unread_count", String(totalCount > 0 ? totalCount : 0));
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <aside
      className="
        w-[330px] min-h-screen flex flex-col p-5
        rounded-tr-3xl rounded-br-3xl shadow-2xl border-0
        bg-gradient-to-b from-[#b6f7c1] via-[#e0fae7] to-white
      "
    >
      <div className="flex items-center gap-3 mb-10 mt-2 px-1">
        <img
          src="/images/logo.png"
          alt="logo"
          className="w-10 h-10 rounded-full"
        />
        <span className="text-xl font-extrabold text-[#03256C] tracking-tight">
          Coach Panel
        </span>
      </div>

      <nav className="flex flex-col gap-2">
        {menu.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all
                ${isActive
                  ? "bg-white text-green-700 border-l-4 border-green-600 shadow-sm scale-[1.02]"
                  : "text-gray-600 hover:bg-green-50 hover:text-green-700"
                }`}
            >
              <item.icon
                className={`w-4 h-4 transition-transform duration-200
                  ${isActive ? "text-green-600 scale-110" : "group-hover:scale-105"}
                `}
              />
              <span className="relative flex items-center">
                {item.label}
                {item.label === "Chat" && unreadCount > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center rounded-full bg-red-600 text-white text-xs font-bold w-5 h-5">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="flex-1" />

      <button
        onClick={() => {
          dispatch(clearUser());
          localStorage.removeItem("access_token");
          router.push("/login");
        }}
        className="cursor-pointer flex items-center gap-2 px-4 py-2 mt-6 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-800 font-semibold transition shadow"
      >
        <LogOut className="w-4 h-4" />
        Đăng xuất
      </button>

      <div className="text-xs text-gray-400 pl-2 pt-8">© 2025 ReAir</div>
    </aside>
  );
}