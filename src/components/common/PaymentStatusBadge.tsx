import React from "react";
import { PaymentStatus } from "@/types/api/payment";

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  className?: string;
}

const statusMap: Record<PaymentStatus, { text: string; className: string }> = {
  PENDING: {
    text: "Đang chờ thanh toán...",
    className: "bg-yellow-100 text-yellow-700",
  },
  SUCCESS: {
    text: "Thanh toán thành công!",
    className: "bg-green-100 text-green-700",
  },
  FAILED: {
    text: "Thanh toán thất bại.",
    className: "bg-red-100 text-red-700",
  },
};

const PaymentStatusBadge: React.FC<PaymentStatusBadgeProps> = ({ status, className }) => {
  const { text, className: statusClass } = statusMap[status];
  return (
    <span className={`px-4 py-2 rounded-full font-semibold ${statusClass} ${className || ""}`}>{text}</span>
  );
};

export default PaymentStatusBadge; 