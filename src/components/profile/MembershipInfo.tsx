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
          <span className="text-sm text-red-600 font-medium">{t("membershipNone", { default: "Chưa đăng ký" })}</span>
        </div>
      </div>
    );
  }

  const isActive = subscription.status === "Active";
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
    return t("membershipInactive");
  };

  const getStatusIcon = () => {
    if (isActive && !isExpired) return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (isExpired) return <XCircle className="w-4 h-4 text-red-500" />;
    return <Clock className="w-4 h-4 text-yellow-500" />;
  };

  const getPackageIcon = () => {
    const packageName = membershipPackage?.name?.toLowerCase() || "";
    if (packageName.includes("năm") || packageName.includes("yearly")) return <Crown className="w-6 h-6 text-yellow-500" />;
    if (packageName.includes("tháng") || packageName.includes("monthly")) return <Calendar className="w-6 h-6 text-blue-500" />;
    return <Gift className="w-6 h-6 text-green-500" />;
  };

  return (
    <div className={`bg-[#e0f2fe] rounded-2xl p-7 shadow-md min-h-[180px] flex flex-col justify-between ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {getPackageIcon()}
          <span className="text-base font-semibold text-blue-700">{t("membership")}</span>
        </div>
        <div className="flex items-center gap-1">
          {getStatusIcon()}
          <span className={`text-sm font-medium ${getStatusColor()}`}>{getStatusText()}</span>
        </div>
      </div>
      <div className="mt-3">
        <div className="text-xl font-bold text-blue-900 mb-1">{membershipPackage?.name || t("membership")}</div>
        <div className="text-sm text-blue-700 font-medium">
          {t("membershipEndDate")}: <span className="font-bold text-blue-900">{endDate.toLocaleDateString(locale)}</span>
        </div>
      </div>
    </div>
  );
};

export default MembershipInfo; 