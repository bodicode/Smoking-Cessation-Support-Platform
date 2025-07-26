"use client";

import { useAuth } from "@/hooks/useAuth";
import { Crown, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const MembershipBannerSimple = () => {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(true);

  // Chỉ hiển thị nếu user đã đăng nhập
  if (!user?.accessToken || !isVisible) {
    return null;
  }

  const handleDismiss = () => {
    setIsVisible(false);
  };

  return (
    <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-3 flex-1">
            <Crown className="w-5 h-5 text-yellow-200 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-center sm:text-left">
                <span className="font-bold">Nâng cấp thành viên</span> để truy cập tất cả tính năng!
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 flex-shrink-0">
            <Link
              href="/membership"
              className="bg-white text-orange-600 hover:bg-gray-100 px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 shadow-md whitespace-nowrap"
            >
              Đăng ký ngay
            </Link>
            
            <button
              onClick={handleDismiss}
              className="text-white hover:text-gray-200 transition-colors duration-200 flex-shrink-0"
              aria-label="Đóng thông báo"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipBannerSimple; 