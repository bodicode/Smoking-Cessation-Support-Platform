"use client";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Loading from "@/components/common/Loading";
import PaymentQRCode from "@/components/common/PaymentQRCode";
import PaymentStatusBadge from "@/components/common/PaymentStatusBadge";
import { usePayment, usePaymentStatus } from "@/hooks/usePayment";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function PaymentPage() {
  const { paymentId } = useParams();
  const router = useRouter();
  
  const { payment, loading, error, refetch } = usePayment(paymentId as string);
  const { status, checkStatus, checking } = usePaymentStatus(paymentId as string, payment?.status);
  const [redirecting, setRedirecting] = useState(false);

  if (loading) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center"
        >
          <h1 className="text-2xl font-bold text-center mb-4 text-red-600">Lỗi tải thông tin thanh toán</h1>
          <p className="text-gray-600 mb-6 text-center">{error}</p>
          <div className="flex gap-4">
            <button
              className="px-6 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-bold transition"
              onClick={refetch}
            >
              Thử lại
            </button>
            <button
              className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-bold transition"
              onClick={() => router.push("/membership")}
            >
              Quay lại
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center"
        >
          <h1 className="text-2xl font-bold text-center mb-4 text-gray-600">Không tìm thấy thông tin thanh toán</h1>
          <button
            className="px-6 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-bold transition"
            onClick={() => router.push("/membership")}
          >
            Quay lại trang gói thành viên
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center"
      >
        <h1 className="text-2xl font-bold text-center mb-4 text-sky-700">Thanh toán gói thành viên</h1>
        <div className="mb-2 text-lg text-gray-700">Gói: <span className="font-bold">{payment.packageName}</span></div>
        <div className="mb-2 text-lg text-gray-700">Số tiền: <span className="font-bold text-green-600">{payment.price.toLocaleString('vi-VN')} đ</span></div>
        <PaymentQRCode amount={payment.price} description={payment.content} />
        <div className="mb-4 mt-6">
          <PaymentStatusBadge status={status} />
        </div>
        {status === "SUCCESS" || redirecting ? (
          <button
            className="mt-2 px-6 py-2 bg-gray-400 text-white rounded-lg font-bold transition flex items-center gap-2 cursor-not-allowed"
            disabled
          >
            Đang trở về trang chủ
          </button>
        ) : (
          <button
            className="mt-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold transition flex items-center gap-2"
            onClick={async () => {
              const result = await checkStatus();
              if (result === "SUCCESS") {
                sessionStorage.removeItem("pendingMembershipId");
                sessionStorage.removeItem("pendingPaymentId");
                setRedirecting(true);
                setTimeout(() => {
                  router.push("/");
                }, 2000);
              }
            }}
            disabled={checking}
          >
            {checking ? "Đang kiểm tra..." : "Kiểm tra trạng thái thanh toán"}
          </button>
        )}
        <Link
          href="/membership"
          className="mt-4 flex items-center text-sky-700 hover:text-sky-900 font-bold transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Quay lại trang gói thành viên
        </Link>
      </motion.div>
    </div>
  );
} 