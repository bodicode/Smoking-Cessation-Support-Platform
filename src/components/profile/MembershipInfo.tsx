import React from "react";
import { useUserSubscription } from "@/hooks/useUserSubscription";
import { useMembershipById } from "@/hooks/useMembership";
import { Crown, Calendar, Gift, Clock, CheckCircle, XCircle } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

interface MembershipInfoProps {
  className?: string;
}

const MembershipInfo: React.FC<MembershipInfoProps> = ({ className = "" }) => {
  const t = useTranslations("profile");
  const locale = useLocale();
  const { subscription, loading, error } = useUserSubscription();
  const { membershipPackage } = useMembershipById(subscription?.package_id || "");

  if (loading) {
    return (
      <div className={`bg-[#e0f2fe] rounded-2xl p-7 shadow-md min-h-[180px] flex flex-col justify-center ${className}`}>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-blue-200 rounded w-1/3 mb-2"></div>
          <div className="h-7 bg-blue-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-blue-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (error || !subscription) {
    return (
      <div className={`bg-[#fef2f2] rounded-2xl p-7 shadow-md min-h-[180px] flex flex-col justify-center ${className}`}>
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="w-5 h-5 text-blue-400" />
          <span className="text-base font-semibold text-blue-700">{t("membership")}</span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <XCircle className="w-4 h-4 text-red-500" />
          <span className="text-sm text-red-600 font-medium">{t("membershipNone")}</span>
        </div>
      </div>
    );
  }

  const isActive = subscription.status?.toLowerCase() === "active";
  const endDate = new Date(subscription.end_date);
  const now = new Date();
  const isExpired = endDate < now;

  const getStatusColor = () => {
    if (isActive && !isExpired) return "text-green-600";
    if (isExpired) return "text-red-600";
    return "text-yellow-600";
  };

  const getStatusText = () => {
    if (isActive && !isExpired) return t("membershipActive");
    if (isExpired) return t("membershipExpired");
    return subscription.status || t("membershipInactive");
  };

  const getStatusIcon = () => {
    if (isActive && !isExpired) return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (isExpired) return <XCircle className="w-4 h-4 text-red-500" />;
    return <Clock className="w-4 h-4 text-yellow-500" />;
  };

  const getPackageIcon = () => {
    const packageName = membershipPackage?.name?.toLowerCase() || "";
    if (packageName.includes("năm") || packageName.includes("yearly") || packageName.includes("year")) return <Crown className="w-6 h-6 text-yellow-500" />;
    if (packageName.includes("tháng") || packageName.includes("monthly") || packageName.includes("month")) return <Calendar className="w-6 h-6 text-blue-500" />;
    return <Gift className="w-6 h-6 text-green-500" />;
  };

  const getBgColor = () => {
    if (isActive && !isExpired) return "bg-gradient-to-tr from-[#dcfce7] to-[#f0fdf4]"; // green gradient
    if (isExpired) return "bg-gradient-to-tr from-[#fef2f2] to-[#fff5f5]"; // red gradient
    return "bg-gradient-to-tr from-[#fef3c7] to-[#fffbeb]"; // yellow gradient
  };

  return (
    <div className={`${getBgColor()} rounded-2xl p-7 shadow-md min-h-[180px] flex flex-col justify-between relative overflow-hidden ${className}`}>
      {/* Background decoration */}
      <span className="absolute right-4 top-4 opacity-10 text-6xl font-black select-none">
        {isActive && !isExpired ? "✓" : isExpired ? "✗" : "⏸"}
      </span>
      
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {getPackageIcon()}
          <span className="text-base font-semibold text-gray-700">{t("membership")}</span>
        </div>
        <div className="flex items-center gap-1">
          {getStatusIcon()}
          <span className={`text-sm font-medium ${getStatusColor()}`}>{getStatusText()}</span>
        </div>
      </div>
      
      <div className="mt-3">
        <div className="text-xl font-bold text-gray-800 mb-1">
          {membershipPackage?.name || "Basic Plan"}
        </div>
        <div className="text-sm text-gray-600 font-medium">
          {t("membershipEndDate")}: <span className="font-bold text-gray-800">{endDate.toLocaleDateString(locale)}</span>
        </div>
        {subscription.start_date && (
          <div className="text-xs text-gray-500 mt-1">
            Bắt đầu: {new Date(subscription.start_date).toLocaleDateString(locale)}
          </div>
        )}
      </div>
    </div>
  );
};

export default MembershipInfo;