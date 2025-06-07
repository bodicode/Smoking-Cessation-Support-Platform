'use client';

import { useQuery } from '@apollo/client';
import Link from 'next/link';
import { Edit, Eye, Calendar, User, Trash2 } from 'lucide-react';
import { GET_BLOGS } from '@/graphql/queries/blogs/getBlogs';
import Loading from '@/components/common/Loading';
import Image from 'next/image';
import { useState } from 'react';
import Pagination from '@/components/common/Pagination';
import ConfirmModal from '@/components/common/ModalConfirm';
import toast from "react-hot-toast";
import { ErrorToast, SuccessToast } from "@/components/common/CustomToast";
import { removeBlog } from '@/services/blogService';
import client from "@/apollo/apolloClient";

export default function CoachBlogsPage() {
    const [page, setPage] = useState(1);
    const [deleteBlog, setDeleteBlog] = useState<any>(null);
    const limit = 4;

    const { data, loading, error, refetch } = useQuery(GET_BLOGS, {
        variables: {
            page,
            limit,
            search: "",
            orderBy: "created_at",
            sortOrder: "desc"
        }
    });

    const blogs = data?.blogs?.data || [];
    const total = data?.blogs?.total || 0;
    const hasNext = data?.blogs?.hasNext || false;

    const totalPages = Math.ceil(total / limit);

    const handleDelete = async () => {
        if (!deleteBlog) return;
        try {
            await removeBlog(deleteBlog.id);
            toast.custom(<SuccessToast message="Xoá thành công!" />);
            client.cache.evict({ id: client.cache.identify({ __typename: "Blog", id: deleteBlog.id }) });
            client.cache.gc();
            if (blogs.length === 1 && page > 1) {
                setPage(page - 1);
                refetch()
            } else {
                refetch();
            }

            setDeleteBlog(null);
        } catch (err: any) {
            toast.custom(<ErrorToast message={err?.message || "Xoá thất bại!"} />);
            setDeleteBlog(null);
        }
    };

    return (
        <div className=''>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <h1 className="text-2xl font-bold text-sky-800">Quản lý Blog</h1>
                <div className="flex-1 flex justify-center">
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                        hasNext={hasNext}
                    />
                </div>
                <Link
                    href="/coach/blogs/new"
                    className="flex items-center gap-2 bg-gradient-to-r from-sky-500 to-green-400 hover:to-green-600 text-white font-semibold py-2 px-5 rounded-xl shadow transition whitespace-nowrap"
                >
                    Tạo blog mới
                </Link>
            </div>
            {loading ? (
                <div className="py-12 text-center text-sky-600 font-semibold"><Loading /></div>
            ) : error ? (
                <div className="py-12 text-center text-red-600 font-semibold">Lỗi tải blogs.</div>
            ) : blogs.length === 0 ? (
                <div className="py-24 text-center text-gray-500">
                    Chưa có blog nào. Nhấn "Tạo blog mới" để bắt đầu!
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {blogs.map((blog: any) => (
                            <div
                                key={blog.id}
                                className="bg-white rounded-2xl shadow-md p-6 flex flex-col border-l-8 border-sky-200 hover:border-sky-500 transition-all duration-200 hover:shadow-lg h-full"
                                style={{ minHeight: 260 }}
                            >
                                <div className="flex justify-between items-start gap-3">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                                            <Calendar size={15} />
                                            {new Date(blog.created_at).toLocaleDateString("vi-VN")}
                                        </div>
                                        <h2 className="text-xl font-extrabold text-sky-700 mb-0 min-h-[50px]">{blog.title}</h2>
                                        <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                                            <User size={14} />
                                            {blog.author?.name}
                                        </div>
                                        <p className="text-gray-600 mt-2 mb-4 line-clamp-2 min-h-[40px]">{blog.content.replace(/<[^>]+>/g, '')}</p>
                                    </div>
                                    {blog.cover_image && (
                                        <div className="w-20 h-20 relative flex-shrink-0">
                                            <Image
                                                src={blog.cover_image}
                                                alt={blog.title}
                                                fill
                                                className="rounded-lg object-cover"
                                                sizes="80px"
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-3 mt-auto">
                                    <Link
                                        href={`/coach/blogs/${blog.slug}`}
                                        className="flex items-center gap-1 px-3 py-1 rounded bg-sky-50 text-sky-700 font-semibold hover:bg-sky-100 transition"
                                    >
                                        <Eye size={16} /> Xem
                                    </Link>
                                    <Link
                                        href={`/coach/blogs/new?edit=${blog.slug}`}
                                        className="flex items-center gap-1 px-3 py-1 rounded bg-green-50 text-green-700 font-semibold hover:bg-green-100 transition"
                                    >
                                        <Edit size={16} /> Sửa
                                    </Link>
                                    <button
                                        onClick={() => setDeleteBlog(blog)}
                                        className="cursor-pointer flex items-center gap-1 px-3 py-1 rounded bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition"
                                    >
                                        <Trash2 size={16} /> Xoá
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <ConfirmModal
                        open={!!deleteBlog}
                        title="Xác nhận xoá"
                        message={`Bạn chắc chắn muốn xoá blog "${deleteBlog?.title}"?`}
                        onConfirm={handleDelete}
                        onCancel={() => setDeleteBlog(null)}
                    />
                </>
            )}
        </div>
    );
}
