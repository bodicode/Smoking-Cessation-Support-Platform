'use client';

import { Crown, Calendar, Gift } from "lucide-react";
import { JSX } from "react";
import { motion } from "framer-motion";
import Breadcrumbs from "@/components/common/BreadCrumb";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createPayment } from "@/services/paymentService";
import { useMembership } from "@/hooks/useMembership";
import Loading from "@/components/common/Loading";
import toast from "react-hot-toast";

const iconMap: Record<string, JSX.Element> = {
    crown: <Crown className="w-8 h-8 text-yellow-400" />,
    calendar: <Calendar className="w-8 h-8 text-sky-400" />,
    gift: <Gift className="w-8 h-8 text-emerald-400" />,
};

const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.97 },
    visible: (i = 1) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { delay: i * 0.13, type: "spring", stiffness: 170, damping: 18 }
    })
};

export default function MembershipPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { membershipPackages, loading: packagesLoading, error, refetch } = useMembership();
    const [pendingMembershipId, setPendingMembershipId] = useState<string | null>(null);
    const [pendingPaymentId, setPendingPaymentId] = useState<string | null>(null);
    const [filteredPackages, setFilteredPackages] = useState(membershipPackages);
    const [loadingPackageId, setLoadingPackageId] = useState<string | null>(null);

    // On mount, check for pending payment in sessionStorage
    useEffect(() => {
        const storedMembershipId = sessionStorage.getItem("pendingMembershipId");
        const storedPaymentId = sessionStorage.getItem("pendingPaymentId");
        setPendingMembershipId(storedMembershipId);
        setPendingPaymentId(storedPaymentId);
        if (storedMembershipId && storedPaymentId) {
            setFilteredPackages(membershipPackages.filter(pkg => pkg.id === storedMembershipId));
        } else {
            setFilteredPackages(membershipPackages);
        }
    }, [membershipPackages]);

    // Placeholder for createPayment mutation (replace with actual GraphQL mutation)
    async function initiatePayment(membershipPackageId: string) {
        setLoadingPackageId(membershipPackageId);
        try {
            // Use centralized payment service - user ID is automatically extracted from JWT token
            const payment = await createPayment(membershipPackageId);
            sessionStorage.setItem("pendingMembershipId", membershipPackageId);
            sessionStorage.setItem("pendingPaymentId", payment.id);
            router.push(`/payment/${payment.id}`);
        } catch (error) {
            let msg = (error instanceof Error ? error.message : 'Unknown error');
            if (msg.includes('You already have an active subscription. Cannot create new payment')) {
                toast.error('Bạn đã đăng ký gói thành viên rồi');
            } else {
                toast.error('Payment initiation failed: ' + msg);
            }
        } finally {
            setLoadingPackageId(null);
        }
    }

    if (packagesLoading) {
        return (
            <div className="max-w-5xl mx-auto py-10 px-4">
                <Loading />
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-5xl mx-auto py-10 px-4">
                <div className="text-center">
                    <p className="text-red-500 mb-4">Error loading membership packages: {error}</p>
                    <button
                        onClick={refetch}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto py-10 px-4">
            <Breadcrumbs
                items={[
                    { label: "Trang chủ", href: "/" },
                    { label: "Gói thành viên", active: true }
                ]}
            />

            <motion.h1
                className="w-full text-4xl font-extrabold text-center mb-6 text-gradient bg-gradient-to-r from-sky-600 to-green-400 inline-block text-transparent bg-clip-text"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                Gói thành viên
            </motion.h1>
            <motion.p
                className="text-center mb-8 text-gray-500"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08, duration: 0.4 }}
            >
                Chọn gói thành viên phù hợp với bạn
            </motion.p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {filteredPackages.map((plan, idx) => (
                    <motion.div
                        key={plan.id}
                        custom={idx}
                        initial="hidden"
                        animate="visible"
                        variants={cardVariants}
                        className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center border-t-8 border-transparent hover:border-green-400 transition-all"
                        whileHover={{
                            y: -7,
                            scale: 1.04,
                            boxShadow: "0 12px 36px 0 #22c55e22"
                        }}
                    >
                        <div className="mb-4">{iconMap[plan.id.includes('yearly') ? 'crown' : plan.id.includes('quarterly') ? 'calendar' : 'gift']}</div>
                        <h2 className="text-xl font-bold mb-2 text-center">{plan.name}</h2>
                        <div className="text-3xl font-extrabold text-green-600 mb-2">
                            {plan.price.toLocaleString('vi-VN')} <span className="text-base font-normal">đ</span>
                        </div>
                        <p className="text-gray-600 mb-4 text-center">Đăng ký linh hoạt, không lo cam kết.</p>
                        <div className="mb-6 space-y-2 w-full min-h-32">
                            {Array.isArray(plan.description)
                                ? plan.description.map((desc: string, i: number) => (
                                    <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                                        <span className="inline-block w-2 h-2 bg-green-400 rounded-full" />
                                        {desc}
                                    </div>
                                ))
                                : (
                                    <div className="flex items-center gap-2 text-sm text-gray-700">
                                        <span className="inline-block w-2 h-2 bg-green-400 rounded-full" />
                                        {plan.description}
                                    </div>
                                )
                            }
                        </div>
                        {pendingMembershipId === plan.id && pendingPaymentId ? (
                            <motion.button
                                type="button"
                                className="cursor-pointer w-full bg-gradient-to-r from-sky-600 to-green-400 hover:to-green-600 text-white font-bold py-2 rounded-lg text-lg transition-all"
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.96 }}
                                onClick={() => router.push(`/payment/${pendingPaymentId}`)}
                                disabled={loadingPackageId === plan.id}
                            >
                                Tiếp tục thanh toán
                            </motion.button>
                        ) : (
                            <motion.button
                                type="button"
                                className="cursor-pointer w-full bg-gradient-to-r from-sky-600 to-green-400 hover:to-green-600 text-white font-bold py-2 rounded-lg text-lg transition-all"
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.96 }}
                                onClick={() => initiatePayment(plan.id)}
                                disabled={loadingPackageId === plan.id}
                            >
                                {loadingPackageId === plan.id ? <Loading color="#FFF" /> : "Mua ngay"}
                            </motion.button>
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
