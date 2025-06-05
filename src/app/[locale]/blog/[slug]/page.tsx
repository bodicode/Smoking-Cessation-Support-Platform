"use client";

import { useParams, notFound, useRouter } from "next/navigation";
import Image from "next/image";
import { RxAvatar } from "react-icons/rx";
import PopularBlogs from "@/components/blog/PopularBlogs";
import { useQuery } from "@apollo/client";
import { GET_BLOG_BY_SLUG } from "@/graphql/queries/blogs/getBlogBySlug";
import Loading from "@/components/common/Loading";
import { useSelector } from "react-redux";
import { removeBlog } from "@/services/blogService";
import client from "@/apollo/apolloClient";
import { useState } from "react";
import ConfirmModal from "@/components/common/ModalConfirm";

export default function BlogDetail() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();
  const [openConfirm, setOpenConfirm] = useState(false);

  const { data, loading, error } = useQuery(GET_BLOG_BY_SLUG, {
    variables: { slug },
  });

  const user = useSelector((state: any) => state.user);

  const handleDelete = async () => {
    setOpenConfirm(false);
    try {
      await removeBlog(blog.id);
      alert("Xóa thành công!");
      client.cache.evict({
        id: client.cache.identify({ __typename: "Blog", id: blog.id }),
      });
      client.cache.gc();
      router.push("/blog");
    } catch (err: any) {
      alert(err.message || "Xóa blog thất bại!");
    }
  };

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

  const isOwner =
    user &&
    blog.author &&
    (blog.author.id
      ? blog.author.id === user.id
      : blog.author.name === user.name);

  return (
    <div className="min-h-screen py-12 px-2 sm:px-8 bg-[#f9f5ec]">
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

          {isOwner && (
            <div className="flex gap-2 mb-6 justify-end">
              <button
                onClick={() => router.push(`/blog/new?edit=${slug}`)}
                className="cursor-pointer px-4 py-2 bg-gradient-to-r from-sky-600 to-green-400 hover:to-green-500 rounded hover:scale-105 active:scale-100 transition-all duration-150"
              >
                Chỉnh sửa
              </button>
              <button
                onClick={() => setOpenConfirm(true)}
                className="cursor-pointer px-4 py-2 
                      bg-gradient-to-r from-rose-500 via-red-500 to-pink-500 
                      text-white rounded
                      hover:from-red-600 hover:to-pink-600 
                      hover:scale-105 active:scale-100 
                      transition-all duration-150"
              >
                Xóa
              </button>
            </div>
          )}
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

      <ConfirmModal
        open={openConfirm}
        title="Xác nhận xóa"
        message="Bạn chắc chắn muốn xóa blog này?"
        onConfirm={handleDelete}
        onCancel={() => setOpenConfirm(false)}
      />
    </div>
  );
}
