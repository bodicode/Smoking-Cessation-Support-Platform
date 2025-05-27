'use client';

import { useTranslations } from "next-intl";
import { HeartHandshake, Users, Target, Eye, LockKeyhole, BrainCircuit, MessageCircle, ShieldCheck } from 'lucide-react';

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

    return (
        <div className="min-h-screen py-10 flex flex-col items-center">
            <div className="w-full max-w-4xl bg-white rounded-2xl px-8 py-10">
                <h1 className="text-4xl font-bold text-center text-[#60C3A4] mb-2">{t('title')}</h1>
                <p className="text-lg text-center text-gray-600 mb-10">{t('intro')}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="bg-[#e6faf3] rounded-xl p-6 flex flex-col items-center shadow">
                        <Target size={40} className="text-[#60C3A4] mb-2" />
                        <h2 className="font-bold text-xl text-[#60C3A4] mb-2">{t('missionTitle')}</h2>
                        <p className="text-center text-gray-600">{t('mission')}</p>
                    </div>
                    <div className="bg-[#f1fbf7] rounded-xl p-6 flex flex-col items-center shadow">
                        <Eye size={40} className="text-[#60C3A4] mb-2" />
                        <h2 className="font-bold text-xl text-[#60C3A4] mb-2">{t('visionTitle')}</h2>
                        <p className="text-center text-gray-600">{t('vision')}</p>
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-[#60C3A4] mt-4 mb-4 text-center">{t('coreValuesTitle')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    {coreValues.map((val, idx) => (
                        <div key={idx} className="flex items-start gap-4 p-4 bg-[#f7f7fa] rounded-lg shadow">
                            <div>{val.icon}</div>
                            <div>
                                <h3 className="font-semibold text-[#60C3A4]">{val.name}</h3>
                                <p className="text-gray-600 text-sm">{val.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <h2 className="text-2xl font-bold text-[#60C3A4] mb-2 text-center">{t('teamTitle')}</h2>
                <p className="text-center text-gray-600 mb-6">{t('teamIntro')}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {teamMembers.map((member, idx) => (
                        <div key={idx} className="p-4 bg-[#e6faf3] rounded-lg shadow flex flex-col items-center">
                            <Users size={32} className="mb-2 text-[#60C3A4]" />
                            <h3 className="font-bold text-[#60C3A4]">{member.name}</h3>
                            <p className="text-gray-700 text-sm">{member.role}</p>
                            <p className="text-gray-500 text-sm text-center">{member.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
