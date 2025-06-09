"use client";

import { useParams, notFound, useRouter } from "next/navigation";
import Image from "next/image";
import { RxAvatar } from "react-icons/rx";
import PopularBlogs from "@/components/blog/PopularBlogs";
import { useQuery } from "@apollo/client";
import { GET_BLOG_BY_SLUG } from "@/graphql/queries/blogs/getBlogBySlug";
import Loading from "@/components/common/Loading";
import Breadcrumbs from "@/components/common/BreadCrumb";

export default function BlogDetail() {
  const params = useParams();
  const slug = params?.slug as string;

  const { data, loading, error } = useQuery(GET_BLOG_BY_SLUG, {
    variables: { slug },
  });

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loading />
      </div>
    );

  if (error)
    return (
      <div className="text-center py-10 text-red-500">
        Không tìm thấy blog hoặc đã bị xoá.
      </div>
    );

  if (!data?.blogBySlug)
    return (
      <div className="text-center py-10 text-gray-500">
        Bài viết không tồn tại.
      </div>
    );

  if (!data?.blogBySlug) return notFound();

  const blog = data.blogBySlug;

  return (
    <div className="min-h-screen py-12 px-2 sm:px-8 bg-[#f9f5ec]">

      <Breadcrumbs
        items={[
          { label: "Trang chủ", href: "/" },
          { label: "Blogs", href: "/blog" },
          { label: `${slug}`, active: true }
        ]}
      />

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-2">
          <h1 className="text-5xl font-extrabold text-[#03256C] mb-8 leading-tight">
            {blog.title}
          </h1>

          <div className="flex items-center gap-3 mb-8">
            <RxAvatar size={45} />
            <div>
              <div className="font-semibold text-[#03256C]">
                Tác giả: {blog.author.name || "Admin"}
              </div>
              <div className="text-sm">
                Ngày đăng:{" "}
                {blog.created_at
                  ?.split("T")[0]
                  ?.split("-")
                  .reverse()
                  .join(".") || ""}
              </div>
            </div>
          </div>

          <div
            className="prose prose-blue mb-6"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>
        <div className="flex flex-col gap-8">
          <div className="w-full aspect-video relative rounded-xl overflow-hidden">
            <Image
              src={blog.cover_image || "/images/default-blog.jpg"}
              alt={blog.title || slug}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <div className="flex flex-col gap-5">
              <PopularBlogs />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
