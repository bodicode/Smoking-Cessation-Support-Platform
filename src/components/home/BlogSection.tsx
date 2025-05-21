'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

const BlogSection = () => {
    const t = useTranslations('blogSection');
    const blogKeys = ['blog1', 'blog2', 'blog3'] as const;

    return (
        <section className="py-12 bg-[#f7f4ee] px-6 lg:px-36">
            <h2 className="text-3xl font-bold text-center text-[#03256C] mb-10">
                {t('sectionTitle')}
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {blogKeys.map((key) => (
                    <div key={key} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer">
                        <div className="relative h-52 w-full">
                            <Image
                                src={`/${t(`${key}.link`).slice(1)}.jpg`} // hoặc lấy imageSrc tương tự
                                alt={t(`${key}.title`)}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="p-4 flex flex-col h-[220px] justify-between">
                            <div>
                                <h3 className="text-xl font-semibold text-[#03256C] mb-2 min-h-[60px]">
                                    {t(`${key}.title`)}
                                </h3>
                                <p className="text-gray-600 text-sm line-clamp-3">
                                    {t(`${key}.excerpt`)}
                                </p>
                            </div>
                            <div className="mt-4">
                                <Link href={t(`${key}.link`)}>
                                    <span className="text-blue-600 hover:underline font-medium">
                                        {t('readMore')}
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default BlogSection;
