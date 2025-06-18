'use client';

import { useTranslations } from "next-intl";
import { HeartHandshake, Users, Target, Eye, LockKeyhole, BrainCircuit, MessageCircle, ShieldCheck } from 'lucide-react';
import { motion } from "framer-motion";
import Breadcrumbs from "@/components/common/BreadCrumb";

export default function AboutUs() {
    const t = useTranslations('aboutUs');
    const coreValues: { name: string; desc: string; icon: React.ReactNode }[] = [
        {
            name: t('coreValues.0.name'),
            desc: t('coreValues.0.desc'),
            icon: <HeartHandshake size={28} className="text-[#60C3A4]" />
        },
        {
            name: t('coreValues.1.name'),
            desc: t('coreValues.1.desc'),
            icon: <BrainCircuit size={28} className="text-[#60C3A4]" />
        },
        {
            name: t('coreValues.2.name'),
            desc: t('coreValues.2.desc'),
            icon: <LockKeyhole size={28} className="text-[#60C3A4]" />
        },
        {
            name: t('coreValues.3.name'),
            desc: t('coreValues.3.desc'),
            icon: <MessageCircle size={28} className="text-[#60C3A4]" />
        },
        {
            name: t('coreValues.4.name'),
            desc: t('coreValues.4.desc'),
            icon: <Users size={28} className="text-[#60C3A4]" />
        },
        {
            name: t('coreValues.5.name'),
            desc: t('coreValues.5.desc'),
            icon: <ShieldCheck size={28} className="text-[#60C3A4]" />
        },
    ];

    const teamMembers: { name: string; role: string; desc: string }[] = [
        {
            name: t('members.0.name'),
            role: t('members.0.role'),
            desc: t('members.0.desc')
        },
        {
            name: t('members.1.name'),
            role: t('members.1.role'),
            desc: t('members.1.desc')
        },
        {
            name: t('members.2.name'),
            role: t('members.2.role'),
            desc: t('members.2.desc')
        },
        {
            name: t('members.3.name'),
            role: t('members.3.role'),
            desc: t('members.3.desc')
        }
    ];

    const fadeUp = {
        hidden: { opacity: 0, y: 40 },
        visible: (i = 1) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.12, duration: 0.45, type: "spring", stiffness: 180 }
        }),
    };

    return (
        <div className="min-h-screen py-10 flex flex-col items-center">
            
            <Breadcrumbs
                items={[
                    { label: "Trang chủ", href: "/" },
                    { label: "Về chúng tôi", active: true }
                ]}
            />
            
            <motion.div
                className="w-full max-w-4xl bg-white rounded-2xl px-8 py-10"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.08 } }
                }}
            >
                <motion.h1
                    className="text-4xl font-bold text-center text-[#60C3A4] mb-2"
                    variants={fadeUp}
                    custom={0}
                >
                    {t('title')}
                </motion.h1>
                <motion.p
                    className="text-lg text-center text-gray-600 mb-10"
                    variants={fadeUp}
                    custom={0.2}
                >
                    {t('intro')}
                </motion.p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <motion.div
                        className="bg-[#e6faf3] rounded-xl p-6 flex flex-col items-center shadow"
                        variants={fadeUp}
                        custom={0.3}
                        whileHover={{ scale: 1.03 }}
                    >
                        <Target size={40} className="text-[#60C3A4] mb-2" />
                        <h2 className="font-bold text-xl text-[#60C3A4] mb-2">{t('missionTitle')}</h2>
                        <p className="text-center text-gray-600">{t('mission')}</p>
                    </motion.div>
                    <motion.div
                        className="bg-[#f1fbf7] rounded-xl p-6 flex flex-col items-center shadow"
                        variants={fadeUp}
                        custom={0.4}
                        whileHover={{ scale: 1.03 }}
                    >
                        <Eye size={40} className="text-[#60C3A4] mb-2" />
                        <h2 className="font-bold text-xl text-[#60C3A4] mb-2">{t('visionTitle')}</h2>
                        <p className="text-center text-gray-600">{t('vision')}</p>
                    </motion.div>
                </div>

                <motion.h2
                    className="text-2xl font-bold text-[#60C3A4] mt-4 mb-4 text-center"
                    variants={fadeUp}
                    custom={0.5}
                >
                    {t('coreValuesTitle')}
                </motion.h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    {coreValues.map((val, idx) => (
                        <motion.div
                            key={idx}
                            className="flex items-start gap-4 p-4 bg-[#f7f7fa] rounded-lg shadow"
                            variants={fadeUp}
                            custom={0.6 + idx * 0.08}
                            whileHover={{ scale: 1.04, boxShadow: "0px 4px 16px #60C3A444" }}
                        >
                            <motion.div whileHover={{ rotate: [0, -12, 12, 0], transition: { duration: 0.4 } }}>
                                {val.icon}
                            </motion.div>
                            <div>
                                <h3 className="font-semibold text-[#60C3A4]">{val.name}</h3>
                                <p className="text-gray-600 text-sm">{val.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.h2
                    className="text-2xl font-bold text-[#60C3A4] mb-2 text-center"
                    variants={fadeUp}
                    custom={0.7}
                >
                    {t('teamTitle')}
                </motion.h2>
                <motion.p
                    className="text-center text-gray-600 mb-6"
                    variants={fadeUp}
                    custom={0.8}
                >
                    {t('teamIntro')}
                </motion.p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {teamMembers.map((member, idx) => (
                        <motion.div
                            key={idx}
                            className="p-4 bg-[#e6faf3] rounded-lg shadow flex flex-col items-center"
                            variants={fadeUp}
                            custom={0.9 + idx * 0.08}
                            whileHover={{ scale: 1.03, boxShadow: "0px 4px 18px #60C3A444" }}
                        >
                            <Users size={32} className="mb-2 text-[#60C3A4]" />
                            <h3 className="font-bold text-[#60C3A4]">{member.name}</h3>
                            <p className="text-gray-700 text-sm">{member.role}</p>
                            <p className="text-gray-500 text-sm text-center">{member.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
