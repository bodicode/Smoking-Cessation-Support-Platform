"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import {
    User,
    CalendarDays,
    Award,
    Heart,
    Zap,
    Target,
    ShieldCheck,
    Users,
    ListTodo,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Breadcrumbs from "@/components/common/BreadCrumb";

const questionKeys = [
    { key: "cigarettesPerDay", type: "number", icon: <User className="w-5 h-5 text-blue-400" /> },
    { key: "yearsSmoking", type: "number", icon: <Award className="w-5 h-5 text-yellow-400" /> },
    { key: "startAge", type: "number", icon: <CalendarDays className="w-5 h-5 text-emerald-400" /> },
    { key: "quitAttempts", type: "select", icon: <ShieldCheck className="w-5 h-5 text-purple-400" /> },
    { key: "familySmoker", type: "select", icon: <Users className="w-5 h-5 text-pink-400" /> },
    { key: "relatedDisease", type: "select", icon: <Heart className="w-5 h-5 text-red-400" /> },
    { key: "motivation", type: "text", icon: <Zap className="w-5 h-5 text-orange-400" /> },
    { key: "trigger", type: "text", icon: <Target className="w-5 h-5 text-blue-600" /> },
    { key: "strategy", type: "text", icon: <ListTodo className="w-5 h-5 text-green-600" /> },
    { key: "quitDate", type: "date", icon: <CalendarDays className="w-5 h-5 text-emerald-600" /> },
];

const cardVariants = {
    hidden: { opacity: 0, y: 32, scale: 0.97 },
    visible: (i = 1) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { delay: i * 0.09, type: "spring", stiffness: 180, damping: 17 }
    })
};

const sectionVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function QuitPlanFullForm() {
    const t = useTranslations("plan");
    const router = useRouter();
    const [answers, setAnswers] = useState<any>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const personal = questionKeys.slice(0, 6);
    const plan = questionKeys.slice(6);

    const getToday = () => {
        const d = new Date();
        return d.toISOString().split("T")[0];
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
        key: string,
        type?: string
    ) => {
        let value = e.target.value;
        if (type === "number") {
            value = value === "" ? "" : String(Math.max(0, Number(value)));
        }
        setAnswers({ ...answers, [key]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            localStorage.setItem("quitPlanAnswers", JSON.stringify(answers));
            router.push("/template");
        }, 800);
    };

    const percent = Math.round(
        (Object.keys(answers).filter((k) => !!answers[k]).length / questionKeys.length) * 100
    );

    return (
        <motion.div
            className="max-w-4xl mx-auto py-10 px-4"
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
        >
            <Breadcrumbs
                items={[
                    { label: "Trang chủ", href: "/" },
                    { label: "Kế hoạch bỏ thuốc", active: true }
                ]}
            />

            <motion.h1
                className="text-4xl font-extrabold mb-4 text-center text-gradient bg-gradient-to-r from-sky-600 to-green-400 inline-block text-transparent bg-clip-text"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
            >
                {t("title")}
            </motion.h1>
            <motion.p
                className="text-left text-gray-500 mb-8"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18, duration: 0.4 }}
            >
                {t("description")}
            </motion.p>
            <motion.div
                className="w-full h-3 bg-gray-200 rounded-full mb-8 overflow-hidden"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "100%" }}
                transition={{ delay: 0.24, duration: 0.5 }}
            >
                <motion.div
                    className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all"
                    animate={{ width: `${percent}%` }}
                    transition={{ duration: 0.6 }}
                />
            </motion.div>
            <form onSubmit={handleSubmit} className="space-y-12">
                {/* Personal Info */}
                <motion.div
                    variants={sectionVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.17, duration: 0.4 }}
                >
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <User className="w-6 h-6 text-blue-400" />
                        {t("personalInfo")}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {personal.map((q, idx) => (
                            <motion.div
                                key={q.key}
                                custom={idx}
                                initial="hidden"
                                animate="visible"
                                variants={cardVariants}
                                className="bg-white rounded-2xl shadow-md hover:shadow-lg p-5 transition-all flex flex-col gap-2 border-t-4 border-transparent hover:border-blue-300"
                                whileHover={{ scale: 1.03, borderTopColor: "#38bdf8" }}
                            >
                                <label className="font-semibold flex items-center gap-2 mb-1">
                                    {q.icon} {t(`${q.key}.label`)}
                                </label>
                                {t(`${q.key}.sub`) && (
                                    <span className="text-xs text-gray-400 mb-1">{t(`${q.key}.sub`)}</span>
                                )}
                                {q.type === "select" ? (
                                    <select
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                        value={answers[q.key] || ""}
                                        onChange={(e) => handleChange(e, q.key, q.type)}
                                        required
                                    >
                                        <option value="">{t("notAnswered")}</option>
                                        {t.raw(`${q.key}.options`).map((opt: string) => (
                                            <option value={opt} key={opt}>{opt}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                        type={q.type}
                                        placeholder={t(`${q.key}.placeholder`)}
                                        value={answers[q.key] || ""}
                                        min={q.type === "number" ? 0 : undefined}
                                        onChange={(e) => handleChange(e, q.key, q.type)}
                                        required
                                    />
                                )}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Kế hoạch */}
                <motion.div
                    variants={sectionVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.27, duration: 0.4 }}
                >
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Zap className="w-6 h-6 text-orange-400" />
                        {t("actionPlan")}
                    </h2>
                    <div className="space-y-6">
                        {plan.map((q, idx) => (
                            <motion.div
                                key={q.key}
                                custom={idx}
                                initial="hidden"
                                animate="visible"
                                variants={cardVariants}
                                className="bg-white rounded-2xl shadow-md hover:shadow-lg p-5 transition-all flex flex-col gap-2 border-t-4 border-transparent hover:border-orange-300"
                                whileHover={{ scale: 1.03, borderTopColor: "#fb923c" }}
                            >
                                <label className="font-semibold flex items-center gap-2 mb-1">
                                    {q.icon} {t(`${q.key}.label`)}
                                </label>
                                {t(`${q.key}.sub`) && (
                                    <span className="text-xs text-gray-400 mb-1">{t(`${q.key}.sub`)}</span>
                                )}
                                {q.type === "select" ? (
                                    <select
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-300"
                                        value={answers[q.key] || ""}
                                        onChange={(e) => handleChange(e, q.key)}
                                        required
                                    >
                                        <option value="">{t("notAnswered")}</option>
                                        {t.raw(`${q.key}.options`).map((opt: string) => (
                                            <option value={opt} key={opt}>{opt}</option>
                                        ))}
                                    </select>
                                ) : q.type === "date" ? (
                                    <input
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-300"
                                        type="date"
                                        min={getToday()}
                                        value={answers[q.key] || ""}
                                        onChange={(e) => handleChange(e, q.key)}
                                        required
                                    />
                                ) : (
                                    <input
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-300"
                                        type={q.type}
                                        placeholder={t(`${q.key}.placeholder`)}
                                        value={answers[q.key] || ""}
                                        onChange={(e) => handleChange(e, q.key, q.type)}
                                        required
                                    />
                                )}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
                <motion.button
                    type="submit"
                    className="cursor-pointer mt-4 w-full bg-gradient-to-r from-sky-600 to-green-500 hover:to-green-600 text-white font-bold py-3 rounded-xl text-lg shadow-lg transition-all"
                    whileHover={{ scale: 1.035 }}
                    whileTap={{ scale: 0.98 }}
                    animate={isSubmitting ? { opacity: 0.7 } : { opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    disabled={isSubmitting}
                >
                    {t("submit")}
                </motion.button>
            </form>
            <motion.div
                className="text-center mt-4 text-sm text-gray-400"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.38, duration: 0.3 }}
            >
                {t("progress", { percent })}
            </motion.div>
        </motion.div>
    );
}
