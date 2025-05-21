'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

const SuccessStories = () => {
    const t = useTranslations('successStories');
    const keys = ['1', '2', '3', '4', '5', '6', '7'] as const;
    const [start, setStart] = useState(0);
    const visible = 4;

    const handlePrev = () => setStart(prev => Math.max(prev - 1, 0));
    const handleNext = () => setStart(prev => Math.min(prev + 1, keys.length - visible));

    const sliceKeys = keys.slice(start, start + visible);

    return (
        <section className="bg-orange-400 py-12 px-4">
            <h2 className="text-4xl font-bold text-center text-blue-900 mb-10">
                {t('sectionTitle')}
            </h2>
            <div className="flex justify-center gap-6 overflow-hidden">
                {sliceKeys.map((key, idx) => (
                    <div
                        key={key}
                        className={`rounded-xl p-6 w-64 min-h-[280px] ${idx % 2 === 1 ? 'bg-blue-900 text-white' : 'bg-white text-blue-900'}`}
                    >
                        <div className="text-4xl leading-none mb-4">“</div>
                        <p className="text-lg font-medium mb-4 min-h-[200px]">
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
                    className="bg-blue-900 text-white rounded-full p-2 hover:bg-blue-800 disabled:opacity-50"
                >
                    <ArrowLeft />
                </button>
                <button
                    onClick={handleNext}
                    disabled={start >= keys.length - visible}
                    className="bg-blue-900 text-white rounded-full p-2 hover:bg-blue-800 disabled:opacity-50"
                >
                    <ArrowRight />
                </button>
            </div>
        </section>
    );
};

export default SuccessStories;
