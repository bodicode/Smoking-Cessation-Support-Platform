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

export default function QuitPlanFullForm() {
    const t = useTranslations("plan");
    const router = useRouter();
    const [answers, setAnswers] = useState<any>({});

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
        localStorage.setItem("quitPlanAnswers", JSON.stringify(answers));
        router.push("/template");
    };

    const percent = Math.round(
        (Object.keys(answers).filter((k) => !!answers[k]).length / questionKeys.length) * 100
    );

    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            <h1 className="text-4xl font-extrabold mb-4 text-center text-gradient bg-gradient-to-r from-sky-600 to-green-400 inline-block text-transparent bg-clip-text">
                {t("title")}
            </h1>
            <p className="text-left text-gray-500 mb-8">{t("description")}</p>
            <div className="w-full h-3 bg-gray-200 rounded-full mb-8 overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all"
                    style={{ width: `${percent}%` }}
                />
            </div>
            <form onSubmit={handleSubmit} className="space-y-12">
                <div>
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <User className="w-6 h-6 text-blue-400" />
                        {t("personalInfo")}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {personal.map((q) => (
                            <div
                                key={q.key}
                                className="bg-white rounded-2xl shadow-md hover:shadow-lg p-5 transition-all flex flex-col gap-2 border-t-4 border-transparent hover:border-blue-300"
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
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Zap className="w-6 h-6 text-orange-400" />
                        {t("actionPlan")}
                    </h2>
                    <div className="space-y-6">
                        {plan.map((q) => (
                            <div
                                key={q.key}
                                className="bg-white rounded-2xl shadow-md hover:shadow-lg p-5 transition-all flex flex-col gap-2 border-t-4 border-transparent hover:border-orange-300"
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
                            </div>
                        ))}
                    </div>
                </div>
                <button
                    type="submit"
                    className="cursor-pointer mt-4 w-full bg-gradient-to-r from-sky-600 to-green-500 hover:to-green-600 text-white font-bold py-3 rounded-xl text-lg shadow-lg transition-all"
                >
                    {t("submit")}
                </button>
            </form>
            <div className="text-center mt-4 text-sm text-gray-400">
                {t("progress", { percent })}
            </div>
        </div>
    );
}
