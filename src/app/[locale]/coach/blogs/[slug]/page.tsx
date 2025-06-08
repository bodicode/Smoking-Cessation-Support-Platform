'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@apollo/client';
import { GET_BLOG_BY_SLUG } from '@/graphql/queries/blogs/getBlogBySlug';
import Loading from '@/components/common/Loading';
import Image from 'next/image';
import Link from 'next/link';
import { RxAvatar } from 'react-icons/rx';
import { Calendar } from 'lucide-react';
import { removeBlog } from '@/services/blogService';
import toast from 'react-hot-toast';
import { ErrorToast, SuccessToast } from '@/components/common/CustomToast';
import client from '@/apollo/apolloClient';
import { useState } from 'react';
import ConfirmModal from '@/components/common/ModalConfirm';

export default function CoachBlogDetailPage() {
    const { slug } = useParams() as { slug: string };
    const { data, loading, error } = useQuery(GET_BLOG_BY_SLUG, { variables: { slug } });
    const blog = data?.blogBySlug;
    const [openConfirm, setOpenConfirm] = useState(false);
    const router = useRouter()

    const handleDelete = async () => {
        setOpenConfirm(false);
        try {
            await removeBlog(blog.id); // Gọi service xoá
            toast.custom(<SuccessToast message="Xoá thành công!" />);
            client.cache.evict({ id: client.cache.identify({ __typename: "Blog", id: blog.id }) });
            client.cache.gc();
            router.push("/coach/blogs");
        } catch (err: any) {
            toast.custom(<ErrorToast message={err?.message || "Xoá thất bại!"} />);
        }
    };
    if (loading) return <div className="py-12 text-center"><Loading /></div>;
    if (error || !blog) return <div className="py-12 text-center text-red-600">Không tìm thấy blog.</div>;

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 bg-white rounded-2xl mt-6">
            <div className="mb-4 flex items-center gap-3">
                <Link href="/coach/blogs" className="text-blue-600 hover:underline">&larr; Quay lại</Link>
            </div>
            <h1 className="text-3xl font-extrabold text-sky-700 mb-6 text-center">{blog.title}</h1>
            <div className="flex items-center gap-2 justify-between mb-6">
                <div className='flex items-center gap-2 text-sm text-gray-400 ml-2'>
                    <RxAvatar size={20} />
                    <span>{blog.author.name}</span>
                </div>
                <span className="text-sm text-gray-400 ml-2 flex items-center gap-2">
                    <Calendar size={15} /> {new Date(blog.created_at).toLocaleDateString("vi-VN")}</span>
            </div>
            {blog.cover_image && (
                <Image
                    src={blog.cover_image}
                    alt={blog.title}
                    width={700}
                    height={360}
                    className="rounded-lg object-cover mb-5 w-full"
                />
            )}
            <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: blog.content }}
            />
            <div className="mt-8 flex gap-4">
                <Link
                    href={`/coach/blogs/new?edit=${slug}`}
                    className="bg-gradient-to-r from-sky-500 to-green-400 hover:to-green-600 text-white font-semibold py-2 px-6 rounded-lg shadow transition"
                >
                    Sửa
                </Link>
                <button
                    className="cursor-pointer bg-gradient-to-r from-rose-500 via-red-500 to-pink-500 text-white font-semibold py-2 px-6 rounded-lg shadow transition hover:from-red-600 hover:to-pink-600"
                    onClick={() => setOpenConfirm(true)}
                >
                    Xoá
                </button>
            </div>
            <ConfirmModal
                open={openConfirm}
                title="Xác nhận xoá"
                message="Bạn chắc chắn muốn xoá blog này?"
                onConfirm={handleDelete}
                onCancel={() => setOpenConfirm(false)}
            />
        </div>
    );
}
