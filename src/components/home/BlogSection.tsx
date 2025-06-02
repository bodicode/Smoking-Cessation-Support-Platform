'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { blogs } from '../../../data';
import { Blog } from '@/types/components/blog';
import { getRandomItems } from '@/utils';
import { motion } from 'framer-motion';

const gridVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.14
        }
    }
};

const cardVariants = {
    hidden: { opacity: 0, y: 36, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 220, damping: 18 } }
};

const BlogSection = () => {
    const t = useTranslations('blogSection');
    const [displayBlogs, setDisplayBlogs] = useState<Blog[]>([]);
    const params = useParams();
    const locale = (params?.locale as string) || 'vi';

    useEffect(() => {
        setDisplayBlogs(getRandomItems(blogs, 6));
    }, []);

    return (
        <section className="py-12 bg-[#f7f4ee] px-6 lg:px-36">
            <motion.h2
                className="text-3xl font-bold text-center text-[#03256C] mb-10"
                initial={{ opacity: 0, y: -28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 180 }}
            >
                {t('sectionTitle')}
            </motion.h2>
            <motion.div
                className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
                variants={gridVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
            >
                {displayBlogs.map((blog) => {
                    const title = t(`${blog.slug}.title`, { fallback: blog.title });
                    const excerpt = t(`${blog.slug}.excerpt`, { fallback: blog.excerpt });

                    return (
                        <motion.div
                            key={blog.id}
                            variants={cardVariants}
                            whileHover={{ scale: 1.04, boxShadow: "0px 4px 24px rgba(96,195,164,0.12)" }}
                            transition={{ type: "spring", stiffness: 220, damping: 18 }}
                        >
                            <Link href={`/${locale}/blog/${blog.slug}`} className="bg-[#ffffff] rounded-xl shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer h-full flex flex-col">
                                <div className="relative h-52 w-full">
                                    <Image
                                        src={blog.image}
                                        alt={title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="p-4 flex flex-col h-[180px] justify-between flex-1">
                                    <div>
                                        <h3 className="text-xl font-semibold text-[#03256C] mb-2 min-h-[60px]">
                                            {title}
                                        </h3>
                                        <p className="text-gray-600 text-sm line-clamp-3">
                                            {excerpt}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    );
                })}
            </motion.div>
            <motion.div
                className="flex justify-center mt-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 180 }}
            >
                <motion.div whileHover={{ scale: 1.08, y: -4, boxShadow: "0px 4px 18px rgba(96,195,164,0.10)" }}>
                    <Link
                        href={`/${locale}/blog`}
                        className="inline-block bg-[#60C3A4] hover:bg-[#37836a] text-white font-bold px-6 py-3 rounded-full shadow-md transition"
                    >
                        {t('popularBlogs.readMore', { fallback: t('readMore') })}
                    </Link>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default BlogSection;
