'use client'

import { getRandomItems } from '@/utils';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { blogs } from '../../../data';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const PopularBlogs = () => {
    const t = useTranslations('blogSection');
    const [mostPopular, setMostPopular] = useState<typeof blogs>([]);

    const params = useParams();
    const locale = (params?.locale as string) || 'vi';

    useEffect(() => {
        setMostPopular(getRandomItems(blogs, 6));
    }, []);

    if (mostPopular.length === 0) return null;

    return (
        <aside className="sticky top-0 self-start flex flex-col gap-10 pt-1 h-fit">
            <div>
                <h3 className="font-bold text-2xl mb-10">{t('popularBlogs.sectionTitle')}</h3>
                <div className="flex flex-col gap-6">
                    {mostPopular.map((item) => (
                        <Link href={`/${locale}/blog/${item.slug}`} key={item.id} className="flex gap-3 items-center">
                            <div className="w-14 h-14 relative rounded-lg overflow-hidden flex-shrink-0">
                                <Image src={item.image} alt={t(`${item.slug}.title`)} fill className="object-cover" />
                            </div>
                            <div>
                                <div className="text-sm font-semibold leading-tight text-gray-900 line-clamp-2">
                                    {t(`${item.slug}.title`, { fallback: item.title })}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {t(`${item.slug}.excerpt`, { fallback: item.excerpt })}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {item.author} - {item.date.split('-').reverse().join('.')}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </aside>
    );
};

export default PopularBlogs;
