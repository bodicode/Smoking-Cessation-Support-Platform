'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const keys = ['1', '2', '3', '4', '5', '6', '7'] as const;
const VISIBLE_CARDS = 4;

export default function SuccessStories() {
    const t = useTranslations('successStories');
    const [start, setStart] = useState(0);
    const sliceKeys = keys.slice(start, start + VISIBLE_CARDS);

    const handlePrev = () => setStart(prev => Math.max(prev - 1, 0));
    const handleNext = () => setStart(prev => Math.min(prev + 1, keys.length - VISIBLE_CARDS));

    return (
        <section className="py-8 px-2 sm:py-12 sm:px-4">
            <h2 className="text-4xl font-bold text-center text-blue-900 mb-10">
                {t('sectionTitle')}
            </h2>
            <div className="flex flex-nowrap justify-center gap-4 sm:gap-6 overflow-x-auto scrollbar-hide">
                {sliceKeys.map((key, idx) => (
                    <div
                        key={key}
                        className={`
        rounded-xl p-4 sm:p-6 w-[100vw] max-w-[340px] sm:w-60 md:w-72 min-h-[200px] sm:min-h-[250px] flex flex-col justify-between
        ${idx % 2 === 1 ? 'bg-[#60C3A4] text-white' : 'bg-white text-blue-900'} shadow
      `}
                        style={{ flex: "0 0 auto" }}
                    >
                        <div className="text-4xl leading-none mb-4">“</div>
                        <p className="text-lg font-medium mb-4 min-h-[120px] sm:min-h-[200px]">
                            {t(`testimonials.${key}.text`)}
                        </p>
                        <p className="italic font-semibold">– {t(`testimonials.${key}.name`)}</p>
                    </div>
                ))}
            </div>
            <div className="flex justify-center gap-4 mt-10">
                <button
                    onClick={handlePrev}
                    disabled={start === 0}
                    className="bg-[#60C3A4] hover:bg-[#37836a] text-white rounded-full p-2 disabled:opacity-50"
                >
                    <ArrowLeft />
                </button>
                <button
                    onClick={handleNext}
                    disabled={start >= keys.length - VISIBLE_CARDS}
                    className="bg-[#60C3A4] hover:bg-[#37836a] text-white rounded-full p-2 disabled:opacity-50"
                >
                    <ArrowRight />
                </button>
            </div>
        </section>
    );
}
