"use client";

import { useEffect, useRef, useState } from "react";
import { Phone, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import Logo from "../common/Logo";
import Notification from "./Notification";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const Header = () => {
  const [isPhoneHover, setPhoneIsHover] = useState(false);
  const [isGlobeHover, setIsGlobeHover] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showHeader, setShowHeader] = useState(true);

  const { user, logout } = useAuth();
  const router = useRouter();
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 64 || currentScrollY < lastScrollY.current) {
        setShowHeader(true);
      } else if (currentScrollY > lastScrollY.current) {
        setShowHeader(false);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = () => setShowUserDropdown(false);
    if (showUserDropdown) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [showUserDropdown]);

  return (
    <header
      className={`
        sticky top-2 z-50
        flex flex-wrap items-center justify-between
        px-2 sm:px-4 md:px-6 py-2 md:py-3
        bg-[#60C3A4] backdrop-blur-md text-white
        rounded-xl sm:rounded-3xl max-w-full sm:max-w-[95%] min-h-16 sm:min-h-20 mx-auto shadow-lg transition-transform duration-300
        ${showHeader ? "translate-y-0" : "-translate-y-[120px]"}
      `}
      style={{ willChange: "transform" }}
    >
      <Link href={"/"} className="ml-4">
        <Logo />
      </Link>

      <div className="flex flex-1 flex-wrap items-center justify-end gap-3 sm:gap-5 text-xs sm:text-sm">
        <motion.div
          className="flex items-center gap-1 sm:gap-2"
          onHoverStart={() => setPhoneIsHover(true)}
          onHoverEnd={() => setPhoneIsHover(false)}
        >
          <motion.div
            animate={
              isPhoneHover
                ? { rotate: [0, -15, 15, -10, 10, -5, 5, 0] }
                : { rotate: 0 }
            }
            transition={{ duration: 0.7 }}
          >
            <Phone className="text-[#B5D8EB]" size={18} />
          </motion.div>
          <a
            href="tel:0123456789"
            className="underline font-semibold text-xs sm:text-sm ml-2"
          >
            0123456789
          </a>
        </motion.div>

        <div>
          <Notification />
        </div>

        {!user?.accessToken ? (
          <motion.div
            whileHover={{
              scale: 1.09,
              boxShadow: "0px 4px 18px #B5D8EB99",
            }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 380, damping: 15 }}
            className="inline-block"
          >
            <Link
              href={`/login`}
              className="
                bg-[#B5D8EB] hover:bg-[#95cce9] text-white font-bold px-3 py-1 sm:px-4 sm:py-2 
                rounded-full shadow-2xl cursor-pointer text-xs sm:text-sm whitespace-nowrap 
                transition-all duration-200"
            >
              Đăng nhập
            </Link>
          </motion.div>
        ) : (
          <div className="relative">
            <div
              className="bg-[#B5D8EB] hover:bg-[#95cce9] text-white font-bold px-3 py-1 sm:px-4 sm:py-2 rounded-full shadow-2xl cursor-pointer flex items-center gap-1 sm:gap-2 select-none text-xs sm:text-sm"
              onClick={(e) => {
                e.stopPropagation();
                setShowUserDropdown((show) => !show);
              }}
            >
              {user?.name}
              <ChevronDown size={16} className="ml-1" />
            </div>

            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-44 sm:w-48 bg-white rounded-lg shadow-lg z-20 py-2 transition-all">
                <Link
                  href={`/profile`}
                  className="block px-4 py-2 text-xs sm:text-sm text-gray-900 hover:bg-[#e0f2f1] hover:text-[#03256C]"
                  onClick={() => setShowUserDropdown(false)}
                >
                  Hồ sơ
                </Link>
                {user.role === "COACH" &&
                  <Link
                    href={`/coach`}
                    className="block px-4 py-2 text-xs sm:text-sm text-gray-900 hover:bg-[#e0f2f1] hover:text-[#03256C]"
                    onClick={() => setShowUserDropdown(false)}
                  >
                    Coach Dashboard
                  </Link>
                }
                <button
                  className="cursor-pointer block w-full text-left px-4 py-2 text-xs sm:text-sm text-red-600 hover:bg-red-50"
                  onClick={() => {
                    logout();
                    setShowUserDropdown(false);
                    router.push("/login");
                  }}
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
