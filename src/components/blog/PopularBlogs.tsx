'use client';

import { useQuery } from "@apollo/client";
import { GET_BLOGS } from "@/graphql/queries/blogs/getBlogs";
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Loading from "../common/Loading";

const BLOGS_PER_FETCH = 6;

const PopularBlogs = () => {

    const { data, loading, error } = useQuery(GET_BLOGS, {
        variables: {
            page: 1,
            limit: BLOGS_PER_FETCH,
            orderBy: "created_at",
            sortOrder: "desc"
        }
    });

    if (loading) return <div className="text-center text-sm py-4">
        <Loading />
    </div>;
    if (error) return <div className="text-center text-red-500 py-4">Lỗi khi tải blogs</div>;

    const blogs = data?.blogs?.data || [];

    if (blogs.length === 0) return null;

    return (
        <aside className="sticky top-0 self-start flex flex-col gap-10 pt-1 h-fit">
            <div>
                <h3 className="font-bold text-2xl mb-10">Bài viết nổi bật</h3>
                <div className="flex flex-col gap-6">
                    {blogs.map((item: any) => (
                        <Link href={`/blog/${item.slug}`} key={item.id} className="flex gap-3 items-center">
                            <div className="w-14 h-14 relative rounded-lg overflow-hidden flex-shrink-0">
                                <Image src={item.cover_image || '/images/blog2.jpg'} alt={item.title} fill className="object-cover" />
                            </div>
                            <div>
                                <div className="text-sm font-semibold leading-tight text-gray-900 line-clamp-2">
                                    {item.title}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {item.content?.replace(/<[^>]+>/g, '').slice(0, 36) || ''}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {item.author?.name || "Admin"} - {(item.created_at || "").split('T')[0]?.split('-').reverse().join('.')}
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
