'use client'

import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const tipList = [
    {
        icon: "/images/brain.png",
        alt: "Know the triggers",
        headingKey: "tip1.heading",
        bodyKey: "tip1.body",
    },
    {
        icon: "/images/idea.png",
        alt: "Be patient and positive",
        headingKey: "tip2.heading",
        bodyKey: "tip2.body",
    },
    {
        icon: "/images/help.png",
        alt: "Keep the conversation going",
        headingKey: "tip3.heading",
        bodyKey: "tip3.body",
    },
];

const containerVariant = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.35,
            when: "beforeChildren",
            staggerChildren: 0.12,
        },
    },
};

const tipVariant = {
    hidden: { opacity: 0, y: 32, scale: 0.96 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: "spring", stiffness: 210, damping: 15, duration: 0.26 }
    }
};

const imageVariant = {
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.36, ease: "easeOut" } }
};

const SupportTips = () => {
    const t = useTranslations('supportTips');

    return (
        <motion.div
            className="bg-[#f7f4ee] py-12 px-6 lg:px-36 flex flex-col-reverse lg:flex-row items-center gap-10 mt-8 rounded-t-4xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariant}
        >
            <motion.div
                className="lg:w-1/2 flex flex-col gap-8"
                variants={containerVariant}
            >
                <motion.div variants={tipVariant}>
                    <h2 className="text-4xl font-bold text-[#03256C] mb-4">{t('title')}</h2>
                    <p>{t('intro')}</p>
                </motion.div>

                {tipList.map((tip, idx) => (
                    <motion.div
                        key={idx}
                        className="flex items-start gap-4"
                        variants={tipVariant}
                        whileHover={{ scale: 1.04, x: 4 }}
                        transition={{ type: "spring", stiffness: 180, damping: 18 }}
                    >
                        <div className="flex-shrink-0">
                            <Image src={tip.icon} alt={tip.alt} width={48} height={48} />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-[#03256C]">{t(tip.headingKey)}</h3>
                            <p className="text-gray-700">
                                {t(tip.bodyKey)}
                            </p>
                        </div>
                    </motion.div>
                ))}

                <motion.div variants={tipVariant}>
                    <Link
                        href="/community"
                        className="mt-2 hover:underline font-semibold flex justify-center text-[#03256C]"
                    >
                        {t('cta.text')}
                    </Link>
                </motion.div>
            </motion.div>

            <motion.div
                className="lg:w-1/2"
                variants={imageVariant}
            >
                <Image
                    src="/images/community.png"
                    alt="Community"
                    width={700}
                    height={600}
                />
            </motion.div>
        </motion.div>
    );
};

export default SupportTips;
