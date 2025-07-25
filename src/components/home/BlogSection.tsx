'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useQuery } from '@apollo/client';
import { GET_BLOGS } from '@/graphql/queries/blogs/getBlogs';

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

    const { data, loading, error } = useQuery(GET_BLOGS, {
        variables: { page: 1, limit: 6, search: "", orderBy: "created_at", sortOrder: "asc" }
    });

    const blogs = data?.blogs?.data || [];

    return (
        <section className="py-12 bg-[#f7f4ee] px-6 lg:px-36">
            <motion.h2
                className="text-3xl font-bold text-center text-[#03256C] mb-10"
                initial={{ opacity: 0, y: -28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 180 }}
            >
                Bài viết
            </motion.h2>
            {loading ? (
                <div className="text-center py-8">Đang tải blog...</div>
            ) : error ? (
                <div className="text-red-600 text-center py-8">Lỗi tải dữ liệu.</div>
            ) : (
                <motion.div
                    className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
                    variants={gridVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    {blogs.map((blog: any) => {
                        const title = blog.title;
                        const excerpt = blog.content?.replace(/<[^>]+>/g, '').slice(0, 100) + "...";
                        const author = blog.author.name

                        return (
                            <motion.div
                                key={blog.id}
                                variants={cardVariants}
                                whileHover={{ scale: 1.04, boxShadow: "0px 4px 24px rgba(96,195,164,0.12)" }}
                                transition={{ type: "spring", stiffness: 220, damping: 18 }}
                            >
                                <Link
                                    href={`/blog/${blog.slug}`}
                                    className="bg-[#ffffff] rounded-xl shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer h-full flex flex-col"
                                >
                                    <div className="relative h-52 w-full">
                                        <Image
                                            src={blog.cover_image}
                                            alt={title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="p-4 grid grid-rows-[auto,auto,1fr] h-[180px]">
                                        <h3 className="text-xl font-bold text-[#03256C] min-h-[45px]">
                                            {title}
                                        </h3>
                                        <p className="text-gray-500 text-xs italic min-h-[20px]">
                                            {author}
                                        </p>
                                        <p className="text-gray-700 text-sm line-clamp-3 mt-1">{excerpt}</p>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </motion.div >
            )}

            <motion.div
                className="flex justify-center mt-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 180 }}
            >
                <motion.div whileHover={{ scale: 1.08, y: -4, boxShadow: "0px 4px 18px rgba(96,195,164,0.10)" }}>
                    <Link
                        href={`/blog`}
                        className="inline-block bg-[#60C3A4] hover:bg-[#37836a] text-white font-bold px-6 py-3 rounded-full shadow-md transition"
                    >
                        Đọc thêm
                    </Link>
                </motion.div>
            </motion.div>
        </section >
    );
};

export default BlogSection;
