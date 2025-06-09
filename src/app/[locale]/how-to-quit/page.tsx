'use client';

import Breadcrumbs from "@/components/common/BreadCrumb";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function HowToQuit() {
    const t = useTranslations("howto");
    const steps = t.raw("steps") as {
        title: string;
        desc: string;
        img: string;
    }[];

    return (
        <div className="min-h-screen py-10">
            <div className="flex justify-center">
                <Breadcrumbs
                    items={[
                        { label: "Trang chủ", href: "/" },
                        { label: "Cách bỏ thuốc", active: true }
                    ]}
                />
            </div>
            <div className="w-full max-w-5xl mx-auto bg-white rounded-2xl px-4 md:px-12 py-10">
                <h1 className="text-4xl font-bold text-[#60C3A4] mb-4 text-center">{t("title")}</h1>
                <p className="text-lg text-center text-gray-600 mb-10">{t("intro")}</p>
                <div className="space-y-12">
                    {steps.map((step, idx) => (
                        <div
                            key={idx}
                            className={`flex flex-col md:flex-row ${idx % 2 === 1 ? "md:flex-row-reverse" : ""} items-center gap-8`}
                        >
                            <div className="flex-1 w-full">
                                <Image
                                    src={step.img}
                                    alt={step.title}
                                    width={420}
                                    height={260}
                                    className="rounded-xl shadow border border-[#e0e0e0] object-cover w-full aspect-[16/9]"
                                />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-[#60C3A4] mb-2">{step.title}</h2>
                                <p className="text-gray-700 text-lg">{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-12 text-center">
                    <p className="text-xl text-[#60C3A4] font-semibold mb-2">
                        {t("ctaTitle")}
                    </p>
                    <p className="text-gray-500 mb-6">{t("ctaDesc")}</p>
                </div>
            </div>
        </div>
    );
}
