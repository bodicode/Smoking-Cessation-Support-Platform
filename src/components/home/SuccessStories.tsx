'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

const SuccessStories = () => {
    const t = useTranslations('successStories');
    const keys = ['1', '2', '3', '4', '5', '6', '7'] as const;

    const getVisible = () => {
        if (typeof window === "undefined") return 1;
        if (window.innerWidth >= 1024) return 4;
        if (window.innerWidth >= 640) return 2;
        return 1;
    };

    const [visible, setVisible] = useState(getVisible());
    const [start, setStart] = useState(0);

    useEffect(() => {
        function update() {
            setVisible(getVisible());
        }
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, []);

    const maxStart = Math.max(0, keys.length - visible);
    const handlePrev = () => setStart(prev => Math.max(prev - 1, 0));
    const handleNext = () => setStart(prev => Math.min(prev + 1, maxStart));

    const sliceKeys = keys.slice(start, start + visible);

    return (
        <section className="py-8 px-2 sm:px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-blue-900 mb-6 md:mb-10">
                {t('sectionTitle')}
            </h2>
            <div
                className="
                    flex flex-col sm:flex-row justify-center items-stretch gap-4 md:gap-6 overflow-x-auto
                    transition-all
                "
            >
                {sliceKeys.map((key, idx) => (
                    <div
                        key={key}
                        className={`
                            rounded-xl p-4 sm:p-6 w-full sm:w-72 md:w-80 min-h-[200px] sm:min-h-[250px] flex flex-col justify-between
                            ${idx % 2 === 1 ? 'bg-[#60C3A4] text-white' : 'bg-white text-blue-900'}
                            shadow
                        `}
                    >
                        <div className="text-3xl sm:text-4xl leading-none mb-2 sm:mb-4">“</div>
                        <p className="text-base sm:text-lg font-medium mb-2 sm:mb-4 flex-1 min-h-[120px] sm:min-h-[160px]">
                            {t(`testimonials.${key}.text`)}
                        </p>
                        <p className="italic font-semibold text-sm sm:text-base mt-2">– {t(`testimonials.${key}.name`)}</p>
                    </div>
                ))}
            </div>
            <div className="flex justify-center gap-4 mt-6 md:mt-10">
                <button
                    onClick={handlePrev}
                    disabled={start === 0}
                    className="cursor-pointer bg-[#60C3A4] text-white rounded-full p-2 sm:p-3 hover:bg-[#37836a] disabled:opacity-50"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <button
                    onClick={handleNext}
                    disabled={start >= maxStart}
                    className="cursor-pointer bg-[#60C3A4] text-white rounded-full p-2 sm:p-3 hover:bg-[#37836a] disabled:opacity-50"
                >
                    <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </section>
    );
};

export default SuccessStories;
