"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FileText, BookOpen, LogOut, MessageCircle } from "lucide-react";
import { useDispatch } from "react-redux";
import { clearUser, setUser } from "@/store/userSlice";

const menu = [
  { label: "Quản lý Blog", icon: BookOpen, href: "/coach/blogs" },
  { label: "Quản lý Kế hoạch", icon: FileText, href: "/coach/templates" },
  { label: "Chat", icon: MessageCircle, href: "/coach/chat" },
];

export default function SidebarCoach() {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();

  return (
    <aside
      className="
                w-[240px]
                min-h-screen
                flex flex-col
                p-5
                rounded-tr-3xl rounded-br-3xl
                shadow-2xl
                border-0
                bg-gradient-to-b
                from-[#b6f7c1]
                via-[#e0fae7]
                to-white
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
        {menu.map((item) => (
          <Link
            href={item.href}
            key={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-nowrap transition-all text-base
                    ${
                      pathname.startsWith(item.href)
                        ? "bg-green-100 text-green-700 shadow"
                        : "text-gray-600 hover:bg-green-50 hover:text-green-800"
                    }`}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="flex-1"></div>
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
      <div className="text-xs text-gray-400 pl-2 pt-8">© 2025 ReAir</div>
    </aside>
  );
}
