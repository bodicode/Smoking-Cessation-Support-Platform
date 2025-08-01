import { useSubscription } from "@/context/SubscriptionContext";
import { useAuth } from "@/hooks/useAuth";
import { Crown, X } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MembershipBanner = () => {
  const { isSubscribed, loading, fetchSubscription } = useSubscription();
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(true);

  // Reset lại isVisible khi user hoặc trạng thái sub đổi
  useEffect(() => {
    setIsVisible(true);
  }, [user?.id, isSubscribed]);

  // Force refetch subscription khi user thay đổi
  useEffect(() => {
    if (user?.id) {
      fetchSubscription(user.id);
    }
  }, [user?.id]);

    const handleDismiss = () => {
        setIsVisible(false);
    };

      // Debug logging - chỉ log khi có thay đổi quan trọng
  // useEffect(() => {
  //   if (user?.accessToken) {
  //     console.log('MembershipBanner Debug:', {
  //       hasUser: !!user?.accessToken,
  //       userId: user?.id,
  //       loading,
  //       isSubscribed,
  //       isVisible,
  //       shouldShow: !(!user?.accessToken || !user?.id || loading || isSubscribed || !isVisible)
  //     });
  //   }
  // }, [user?.accessToken, user?.id, loading, isSubscribed, isVisible]);

  // Đặt điều kiện trực tiếp ở đây, không cần useMemo
  if (
    !user?.accessToken ||
    !user?.id ||
    loading ||
    isSubscribed ||
    !isVisible
  ) {
    return null;
  }

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white shadow-lg z-50"
                >
                    <div className="max-w-7xl mx-auto px-4 py-3 mb-3">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                            <div className="flex items-center space-x-3 flex-1">
                                <Crown className="w-5 h-5 text-yellow-200 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-center sm:text-left">
                                        <span className="font-bold">Nâng cấp thành viên</span> để truy cập tất cả tính năng và nhận hỗ trợ từ coach chuyên nghiệp!
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 flex-shrink-0">
                                <Link
                                    href="/membership"
                                    className="text-sm hover:underline"
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
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default MembershipBanner;
