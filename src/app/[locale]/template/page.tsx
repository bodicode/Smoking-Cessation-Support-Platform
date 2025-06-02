"use client";

import { useTranslations } from "next-intl";
import { CheckCircle, Sparkles, Users, Clock } from "lucide-react";
import Link from "next/link";
import { JSX } from "react";
import { motion } from "framer-motion";

const iconMap: Record<string, JSX.Element> = {
    CheckCircle: <CheckCircle className="w-7 h-7 text-green-500" />,
    Sparkles: <Sparkles className="w-7 h-7 text-blue-500" />,
    Users: <Users className="w-7 h-7 text-pink-500" />,
    Clock: <Clock className="w-7 h-7 text-amber-500" />
};

const cardVariants = {
    hidden: { opacity: 0, y: 32, scale: 0.97 },
    visible: (i = 1) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { delay: i * 0.13, type: "spring", stiffness: 170, damping: 17 }
    })
};

export default function PlanTemplatesPage() {
    const t = useTranslations("template");
    const templates = t.raw("templateList") as {
        icon: string;
        title: string;
        desc: string;
        steps: string[];
    }[];

    return (
        <div className="max-w-5xl mx-auto py-12 px-4">
            <motion.h1
                className="text-4xl font-extrabold text-center mb-6 text-gradient bg-gradient-to-r from-sky-600 to-green-400 inline-block text-transparent bg-clip-text"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {t("title")}
            </motion.h1>
            <motion.p
                className="text-left text-gray-500 mb-10"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
            >
                {t("description")}
            </motion.p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {templates.map((tpl, idx) => (
                    <motion.div
                        key={idx}
                        custom={idx}
                        initial="hidden"
                        animate="visible"
                        variants={cardVariants}
                        className="bg-white shadow-lg rounded-2xl p-6 flex flex-col gap-3 border-t-4 border-transparent hover:border-blue-400 transition-all"
                        whileHover={{
                            y: -6,
                            scale: 1.03,
                            boxShadow: "0 8px 32px 0 #60C3A422",
                        }}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            {iconMap[tpl.icon] || <CheckCircle className="w-7 h-7" />}
                            <span className="font-bold text-lg">{tpl.title}</span>
                        </div>
                        <p className="text-gray-500 mb-1">{tpl.desc}</p>
                        <ul className="list-disc pl-6 text-gray-700 text-sm space-y-1 min-h-52">
                            {tpl.steps.map((step, i) => (
                                <li key={i}>{step}</li>
                            ))}
                        </ul>
                        <motion.button
                            type="button"
                            className="cursor-pointer mt-4 bg-gradient-to-r from-sky-500 to-green-400 hover:to-green-600 text-white font-semibold py-2 px-5 rounded-xl shadow transition-all"
                            whileHover={{ scale: 1.045 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => alert(t("apply"))}
                        >
                            {t("apply")}
                        </motion.button>
                    </motion.div>
                ))}
            </div>
            <div className="text-center mt-8">
                <Link
                    href="/plan"
                    className="text-blue-600 underline hover:text-blue-800 font-medium"
                >
                    {t("back")}
                </Link>
            </div>
        </div>
    );
}
