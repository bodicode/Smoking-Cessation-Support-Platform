"use client";

import { useEffect, useState } from "react";
import { getMemberPaymentsWithTransactions, getMemberPaymentDetail } from "@/services/paymentService";
import Image from "next/image";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { FiSearch } from "react-icons/fi";
import Loading from "@/components/common/Loading";

export default function TransactionsPage() {
    const [payments, setPayments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [filterDate, setFilterDate] = useState("");
    const [filterPackage, setFilterPackage] = useState("");

    // Modal
    const [modalPayment, setModalPayment] = useState<any>(null);
    const [modalLoading, setModalLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        getMemberPaymentsWithTransactions()
            .then(data => setPayments(data))
            .finally(() => setLoading(false));
    }, []);

    // Filter logic
    const filteredPayments = payments.filter(payment => {
        let match = true;
        if (filterDate) {
            // Try to match transactionDate or created_at (fallback)
            const dateStr =
                payment.payment_transaction?.transactionDate ||
                payment.payment_transaction?.created_at ||
                payment.created_at ||
                "";
            match =
                match &&
                dateStr.startsWith(filterDate);
        }
        if (filterPackage) {
            match =
                match &&
                payment.subscription?.package?.name
                    ?.toLowerCase()
                    .includes(filterPackage.toLowerCase());
        }
        return match;
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#e0f7fa] via-[#f9f5ec] to-[#f1f8e9] py-10">
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-3xl font-extrabold text-[#03256C] mb-8 text-center tracking-tight">Lịch sử giao dịch</h1>
                <div className="flex flex-col md:flex-row gap-4 mb-10 items-center justify-center">
                    <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-3 shadow border border-gray-100">
                        <label className="text-gray-700 font-semibold mr-2">Ngày giao dịch</label>
                        <div
                            className="relative w-full"
                            tabIndex={0}
                            onClick={e => {
                                // Focus the input when clicking anywhere in the container
                                const input = (e.currentTarget.querySelector("input") as HTMLInputElement | null);
                                input?.focus();
                            }}
                        >
                            <input
                                type="date"
                                className="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#60C3A4] focus:border-transparent transition bg-gray-50 w-full cursor-pointer"
                                value={filterDate}
                                onChange={e => setFilterDate(e.target.value)}
                                // Make sure input is focusable and triggers calendar
                                onFocus={e => e.currentTarget.showPicker && e.currentTarget.showPicker()}
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-3 shadow border border-gray-100">
                        <label className="text-gray-700 font-semibold mr-2">Tên gói</label>
                        <input
                            type="text"
                            className="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#60C3A4] focus:border-transparent transition bg-gray-50"
                            placeholder="Nhập tên gói"
                            value={filterPackage}
                            onChange={e => setFilterPackage(e.target.value)}
                        />
                        <button className="ml-2 p-2 rounded-full bg-[#e0f2f1] hover:bg-[#b8ede3] transition">
                            <FiSearch className="text-[#60C3A4] w-5 h-5" />
                        </button>
                    </div>
                </div>
                {loading ? (
                    <div className="flex justify-center py-10">
                        <Loading />
                    </div>
                ) : filteredPayments.length === 0 ? (
                    <div className="text-center text-gray-500 py-10">Không có giao dịch nào phù hợp.</div>
                ) : (
                    <div className="grid grid-cols-1 gap-8">
                        {filteredPayments.map(payment => {
                            const pkg = payment.subscription?.package;
                            const transaction = payment.payment_transaction;
                            const isPending = payment.status === "PENDING";
                            const isSuccess = payment.status === "SUCCESS";
                            return (
                                <div key={payment.id} className="bg-white rounded-3xl shadow-lg p-8 flex flex-col gap-3 border border-gray-100 hover:shadow-xl transition relative">
                                    <div className="flex flex-wrap gap-4 items-center mb-2">
                                        <span className="font-bold text-lg text-[#03256C]">ID: {payment.id}</span>
                                        <span className={`px-3 py-1 rounded-full text-sm font-bold shadow-sm border ${isSuccess ? "bg-green-50 text-green-700 border-green-200" : isPending ? "bg-yellow-50 text-yellow-700 border-yellow-200" : "bg-red-50 text-red-700 border-red-200"}`}>
                                            {payment.status}
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-gray-700 font-medium">Tên gói: <span className="font-bold">{pkg?.name}</span></span>
                                        <span className="text-gray-700 font-medium">Tên người dùng: <span className="font-bold">{payment.user?.user_name}</span></span>
                                        {isPending && (
                                            <>
                                                <span className="text-gray-700 font-medium">Giá giao dịch: <span className="font-bold text-[#60C3A4]">{payment.price.toLocaleString()}₫</span></span>
                                                <span className="text-gray-700 font-medium">Giá gói: <span className="font-bold text-[#03256C]">{pkg?.price?.toLocaleString()}₫</span></span>
                                            </>
                                        )}
                                        {isSuccess && (
                                            <>
                                                <span className="text-gray-700 font-medium">Mã giao dịch: <span className="font-mono">{payment.payment_transaction_id || "-"}</span></span>
                                                <span className="text-gray-700 font-medium">Giá giao dịch: <span className="font-bold text-[#60C3A4]">{payment.price.toLocaleString()}₫</span></span>
                                            </>
                                        )}
                                    </div>
                                    {isSuccess && (
                                        <div className="flex justify-end mt-4">
                                            <button
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold transition"
                                                onClick={async () => {
                                                    setModalLoading(true);
                                                    const detail = await getMemberPaymentDetail(payment.id);
                                                    setModalPayment(detail);
                                                    setModalLoading(false);
                                                }}
                                            >
                                                Chi tiết
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
                {/* Modal for payment detail */}
                {modalPayment && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 relative animate-fade-in border border-[#60C3A4]">
                            <button
                                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors text-2xl font-bold"
                                onClick={() => setModalPayment(null)}
                                aria-label="Đóng"
                                tabIndex={0}
                            >×</button>
                            <h2 className="text-2xl font-extrabold mb-6 text-[#03256C] text-center tracking-tight">Chi tiết giao dịch</h2>
                            {modalLoading ? (
                                <div className="flex justify-center py-10"><Loading /></div>
                            ) : (
                                <div className="space-y-4 px-2">
                                    <div>
                                        <span className="font-semibold text-gray-700">Tên người dùng:</span>
                                        <span className="ml-2 font-bold">{modalPayment.user?.user_name}</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="font-semibold text-gray-700">ID:</span>
                                        <span className="font-mono text-[#03256C] break-all">{modalPayment.id}</span>
                                    </div>
                                    <div>
                                        <span className="font-semibold text-gray-700">Trạng thái:</span>
                                        <span className={`font-bold ml-2 ${modalPayment.status === "SUCCESS" ? "text-green-600" : "text-red-600"}`}>{modalPayment.status}</span>
                                    </div>
                                    <div>
                                        <span className="font-semibold text-gray-700">Tên gói:</span>
                                        <span className="ml-2 font-bold text-[#03256C]">{modalPayment.subscription?.package?.name}</span>
                                    </div>
                                    <div>
                                        <span className="font-semibold text-gray-700">Giá giao dịch:</span>
                                        <span className="ml-2 font-bold text-[#60C3A4] text-lg">{modalPayment.price?.toLocaleString()}₫</span>
                                    </div>
                                    <div>
                                        <span className="font-semibold text-gray-700">Mã giao dịch:</span>
                                        <span className="ml-2 font-mono text-[#03256C]">{modalPayment.payment_transaction?.id || "-"}</span>
                                    </div>
                                    <div>
                                        <span className="font-semibold text-gray-700">Gateway:</span>
                                        <span className="ml-2 font-bold">{modalPayment.payment_transaction?.gateway}</span>
                                    </div>
                                    <div>
                                        <span className="font-semibold text-gray-700">Ngày giao dịch:</span>
                                        <span className="ml-2">{modalPayment.payment_transaction?.transactionDate ? format(new Date(modalPayment.payment_transaction.transactionDate), "dd/MM/yyyy HH:mm", { locale: vi }) : "-"}</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="font-semibold text-gray-700">Nội dung:</span>
                                        <span className="text-gray-800 break-all">{modalPayment.content}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                        <style jsx global>{`
                            .animate-fade-in {
                                animation: fadeInModal 0.2s ease;
                            }
                            @keyframes fadeInModal {
                                from { opacity: 0; transform: translateY(24px);}
                                to { opacity: 1; transform: translateY(0);}
                            }
                        `}</style>
                    </div>
                )}
            </div>
        </div>
    );
}