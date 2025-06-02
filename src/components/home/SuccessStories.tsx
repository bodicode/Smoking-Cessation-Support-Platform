'use client'

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

const keys = ['1', '2', '3', '4', '5', '6', '7'] as const;

export default function SuccessStories() {
    const t = useTranslations('successStories');

    return (
        <section className="py-8 px-2 sm:py-12 sm:px-4">
            <h2 className="text-4xl font-bold text-center text-blue-900 mb-10">
                {t('sectionTitle')}
            </h2>
            <div
                className="
                    flex flex-nowrap gap-4 sm:gap-6 overflow-x-auto scrollbar-hide
                    snap-x snap-mandatory
                    pb-4
                "
                style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                }}
            >
                {keys.map((key, idx) => (
                    <motion.div
                        key={key}
                        className={`
                            snap-center
                            rounded-xl p-4 sm:p-6 w-[90vw] max-w-[340px] sm:w-60 md:w-72 min-h-[200px] sm:min-h-[250px]
                            flex flex-col justify-between
                            ${idx % 2 === 1 ? 'bg-[#60C3A4] text-white' : 'bg-white text-blue-900'} shadow
                        `}
                        style={{
                            flex: "0 0 auto",
                        }}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.4, delay: idx * 0.08, type: "spring", stiffness: 240 }}
                        whileHover={{ scale: 1.04 }}
                    >
                        <div className="text-4xl leading-none mb-4">“</div>
                        <p className="text-lg font-medium mb-4 min-h-[120px] sm:min-h-[200px]">
                            {t(`testimonials.${key}.text`)}
                        </p>
                        <p className="italic font-semibold">– {t(`testimonials.${key}.name`)}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
