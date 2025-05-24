'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { blogs } from '../../../../data';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useParams } from 'next/navigation';
import { getRandomItems } from '@/utils';
import { useTranslations } from 'next-intl';

const BLOGS_PER_PAGE = 6;

export default function BlogPage() {
    const [page, setPage] = useState(1);

    const t = useTranslations('blogSection');
    const params = useParams();
    const locale = (params?.locale as string) || 'vi';

    const totalPages = Math.ceil(blogs.length / BLOGS_PER_PAGE);
    const startIdx = (page - 1) * BLOGS_PER_PAGE;
    const endIdx = startIdx + BLOGS_PER_PAGE;
    const blogsToShow = blogs.slice(startIdx, endIdx);

    const mostPopular = getRandomItems(blogs, 6);

    return (
        <div className="bg-[#faf7f4] min-h-screen py-12 px-4">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 flex flex-col gap-12">
                    {blogsToShow.map((blog) => (
                        <Link
                            href={`/${locale}/blog/${blog.slug}`}
                            key={blog.id}
                            className="flex flex-col md:flex-row gap-7 p-6 rounded-2xl shadow-sm bg-white"
                        >
                            <div className="md:w-80 w-full aspect-video rounded-xl overflow-hidden relative flex-shrink-0">
                                <Image
                                    src={blog.image}
                                    alt={t(`${blog.slug}.title`, { fallback: blog.title })}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 400px"
                                />
                            </div>
                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex gap-3 items-center text-sm text-gray-400 mb-2">
                                        <span>{blog.date.split('-').reverse().join('.')}</span>
                                    </div>
                                    <h2 className="text-2xl md:text-3xl font-extrabold mb-3 text-gray-900 leading-tight">
                                        {t(`${blog.slug}.title`, { fallback: blog.title })}
                                    </h2>
                                    <p className="text-gray-700 text-base line-clamp-3 mb-4">
                                        {t(`${blog.slug}.excerpt`, { fallback: blog.excerpt })}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}

                    {/* PAGINATION */}
                    <div className="flex justify-center gap-2 mt-4">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                            className={`px-4 py-2 rounded-full font-bold ${page === 1 ? 'bg-gray-200 text-gray-400' : 'bg-[#60C3A4] text-white hover:bg-[#e3efe7] cursor-pointer'}`}
                        >
                            <ChevronLeft />
                        </button>
                        {[...Array(totalPages)].map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setPage(idx + 1)}
                                className={`px-4 py-2 rounded-full font-bold ${page === idx + 1 ? 'bg-[#60C3A4] text-white' : 'bg-gray-200 text-gray-700 hover:bg-[#e3efe7] cursor-pointer'}`}
                            >
                                {idx + 1}
                            </button>
                        ))}
                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage(page + 1)}
                            className={`px-4 py-2 rounded-full font-bold ${page === totalPages ? 'bg-gray-200 text-gray-400' : 'bg-[#60C3A4] text-white hover:bg-[#e3efe7] cursor-pointer'}`}
                        >
                            <ChevronRight />
                        </button>
                    </div>
                </div>

                {/* POPULAR BLOGS SIDEBAR */}
                <aside className="sticky top-24 self-start flex flex-col gap-10 pt-1 h-fit">
                    <div>
                        <h3 className="font-bold text-2xl mb-10">{t('popularBlogs.sectionTitle')}</h3>
                        <div className="flex flex-col gap-6">
                            {mostPopular.map((item) => (
                                <Link
                                    href={`/${locale}/blog/${item.slug}`}
                                    key={item.id}
                                    className="flex gap-3 items-center"
                                >
                                    <div className="w-14 h-14 relative rounded-lg overflow-hidden flex-shrink-0">
                                        <Image
                                            src={item.image}
                                            alt={t(`${item.slug}.title`, { fallback: item.title })}
                                            fill
                                            className="object-cover"
                                        />
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
            </div>
        </div>
    );
}
