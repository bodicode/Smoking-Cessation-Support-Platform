"use client";

import { useTranslations } from "next-intl";
import { CheckCircle, Sparkles, Users, Clock } from "lucide-react";
import Link from "next/link";
import { JSX } from "react";

const iconMap: Record<string, JSX.Element> = {
    CheckCircle: <CheckCircle className="w-7 h-7 text-green-500" />,
    Sparkles: <Sparkles className="w-7 h-7 text-blue-500" />,
    Users: <Users className="w-7 h-7 text-pink-500" />,
    Clock: <Clock className="w-7 h-7 text-amber-500" />
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
            <h1 className="text-4xl font-extrabold text-center mb-6 text-gradient bg-gradient-to-r from-sky-600 to-green-400 inline-block text-transparent bg-clip-text">
                {t("title")}
            </h1>
            <p className="text-left text-gray-500 mb-10">{t("description")}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {templates.map((tpl, idx) => (
                    <div
                        key={idx}
                        className="bg-white shadow-lg rounded-2xl p-6 flex flex-col gap-3 border-t-4 border-transparent hover:border-blue-400 transition"
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
                        <button
                            className="cursor-pointer mt-4 bg-gradient-to-r from-sky-500 to-green-400 hover:to-green-600 text-white font-semibold py-2 px-5 rounded-xl shadow transition-all"
                            onClick={() => alert(t("apply"))}
                        >
                            {t("apply")}
                        </button>
                    </div>
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
