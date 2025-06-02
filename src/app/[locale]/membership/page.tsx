'use client';

import { Crown, Calendar, Gift } from "lucide-react";
import { useTranslations } from "next-intl";
import { JSX } from "react";
import { membershipPlans } from "../../../../data";
import { motion } from "framer-motion";

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
    const t = useTranslations("membership");

    return (
        <div className="max-w-5xl mx-auto py-10 px-4">
            <motion.h1
                className="w-full text-4xl font-extrabold text-center mb-6 text-gradient bg-gradient-to-r from-sky-600 to-green-400 inline-block text-transparent bg-clip-text"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {t("title")}
            </motion.h1>
            <motion.p
                className="text-center mb-8 text-gray-500"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08, duration: 0.4 }}
            >
                {t("subtitle")}
            </motion.p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {membershipPlans.map((plan, idx) => (
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
                        <div className="mb-4">{iconMap[plan.icon]}</div>
                        <h2 className="text-xl font-bold mb-2 text-center">{plan.title}</h2>
                        <div className="text-3xl font-extrabold text-green-600 mb-2">
                            {plan.price.toLocaleString('vi-VN')} <span className="text-base font-normal">đ</span>
                        </div>
                        <p className="text-gray-600 mb-4 text-center">{plan.description}</p>
                        <ul className="mb-6 space-y-2 w-full min-h-32">
                            {plan.perks.map((perk, idx) => (
                                <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                                    <span className="inline-block w-2 h-2 bg-green-400 rounded-full" /> {perk}
                                </li>
                            ))}
                        </ul>
                        <motion.button
                            type="button"
                            className="cursor-pointer w-full bg-gradient-to-r from-sky-600 to-green-400 hover:to-green-600 text-white font-bold py-2 rounded-lg text-lg transition-all"
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                        >
                            {t("buyNow")}
                        </motion.button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
