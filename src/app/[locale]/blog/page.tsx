"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import Loading from "@/components/common/Loading";
import { getBlogs, getBlogsInSidebar } from "@/services/blogService";
import { useSelector } from "react-redux";
import Pagination from "@/components/common/Pagination";

const BLOGS_PER_PAGE = 6;

export default function BlogPage() {
  const [page, setPage] = useState(1);
  const t = useTranslations("blogSection");
  const params = useParams();
  const locale = (params?.locale as string) || "vi";

  const { blogs, totalPages, loading, error } = getBlogs({
    page,
    limit: BLOGS_PER_PAGE,
    search: "",
    orderBy: "created_at",
    sortOrder: "asc",
  });

  const { blogs: allBlogs, loading: loadingAll } = getBlogsInSidebar();

  const mostPopular = useMemo(() => {
    if (!allBlogs.length) return [];
    const shuffled = [...allBlogs].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(6, allBlogs.length));
  }, [allBlogs]);

  return (
    <div className="bg-[#faf7f4] min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 flex flex-col gap-12">

          {loading ? (
            <div className="text-center py-12">
              <Loading />
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">
              Lỗi tải dữ liệu blogs.
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              Không có blog nào.
            </div>
          ) : (
            blogs.map((blog: any) => (
              <Link
                href={`/${locale}/blog/${blog.slug}`}
                key={blog.id}
                className="flex flex-col md:flex-row gap-7 p-6 rounded-2xl shadow-sm bg-white"
              >
                <div className="md:w-80 w-full aspect-video rounded-xl overflow-hidden relative flex-shrink-0">
                  <Image
                    src={blog.cover_image || "/images/blog2.jpg"}
                    alt={blog.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex gap-3 items-center text-sm text-gray-400 mb-2">
                      <span>
                        {blog.created_at
                          ?.split("T")[0]
                          ?.split("-")
                          .reverse()
                          .join(".") || ""}
                      </span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-extrabold mb-3 text-gray-900 leading-tight">
                      {blog.title}
                    </h2>
                    <p className="text-gray-700 text-base line-clamp-3 mb-4">
                      {blog.content?.replace(/<[^>]+>/g, "").slice(0, 130) ||
                        ""}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          )}

          {/* PAGINATION */}
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            hasNext={blogs.length === BLOGS_PER_PAGE && page < totalPages}
          />
        </div>

        {/* POPULAR BLOGS SIDEBAR */}
        <aside className="sticky top-24 self-start flex flex-col gap-10 pt-1 h-fit">
          <div>
            <h3 className="font-bold text-2xl mb-10">
              {t("popularBlogs.sectionTitle")}
            </h3>
            <div className="flex flex-col gap-6">
              {mostPopular.map((item: any) => (
                <Link
                  href={`/${locale}/blog/${item.slug}`}
                  key={item.id}
                  className="flex gap-3 items-center"
                >
                  <div className="w-14 h-14 relative rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.cover_image || "/images/blog1.jpg"}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-sm font-semibold leading-tight text-gray-900 line-clamp-2">
                      {item.title}
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.content?.replace(/<[^>]+>/g, "").slice(0, 36) || ""}
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.author?.name} -{" "}
                      {item.created_at
                        ?.split("T")[0]
                        ?.split("-")
                        .reverse()
                        .join(".") || ""}
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
