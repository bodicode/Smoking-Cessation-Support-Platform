'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { blogs } from '../../../data';
import { Blog } from '@/types/components/blog';

function getRandomBlogs<T>(data: T[], n = 3): T[] {
    const shuffled = [...data].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, n);
}

const BlogSection = () => {
    const t = useTranslations('blogSection');
    const [displayBlogs, setDisplayBlogs] = useState<Blog[]>([]);
    const params = useParams();
    const locale = (params?.locale as string) || 'vi';

    useEffect(() => {
        setDisplayBlogs(getRandomBlogs(blogs, 3));
    }, []);

    return (
        <section className="py-12 bg-[#f7f4ee] px-6 lg:px-36">
            <h2 className="text-3xl font-bold text-center text-[#03256C] mb-10">
                {t('sectionTitle')}
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {displayBlogs.map((blog) => {
                    const title = t(`${blog.slug}.title`, { fallback: blog.title });
                    const excerpt = t(`${blog.slug}.excerpt`, { fallback: blog.excerpt });
                    const readMore = t('readMore');
                    const link = `/blog/${blog.slug}`;

                    return (
                        <Link href={`/${locale}/blog/${blog.slug}`} key={blog.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer">
                            <div className="relative h-52 w-full">
                                <Image
                                    src={blog.image}
                                    alt={title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="p-4 flex flex-col h-[220px] justify-between">
                                <div>
                                    <h3 className="text-xl font-semibold text-[#03256C] mb-2 min-h-[60px]">
                                        {title}
                                    </h3>
                                    <p className="text-gray-600 text-sm line-clamp-3">
                                        {excerpt}
                                    </p>
                                </div>
                                <div className="mt-4">
                                    <span className="text-blue-600 hover:underline font-medium">
                                        {readMore}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
};

export default BlogSection;
