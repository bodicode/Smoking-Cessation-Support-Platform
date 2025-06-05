import client from "@/apollo/apolloClient";
import { CREATE_BLOG_MUTATION } from "@/graphql/mutations/createBlogMutation";
import { REMOVE_BLOG } from "@/graphql/mutations/deleteBlogMutation";
import { UPDATE_BLOG } from "@/graphql/mutations/updateBlogMutation";
import { GET_BLOG_BY_SLUG } from "@/graphql/queries/blogs/getBlogBySlug";
import { GET_BLOGS } from "@/graphql/queries/blogs/getBlogs";
import { BlogInput } from "@/types/api/blog";
import { useQuery } from "@apollo/client";

export async function createBlog({ title, content, coverImage }: BlogInput) {
  const variables = {
    input: { title, content },
    coverImage: coverImage || null,
  };

  const { data, errors } = await client.mutate({
    mutation: CREATE_BLOG_MUTATION,
    variables,
  });

  if (errors && errors.length > 0)
    throw new Error(errors[0].message || "Đăng blog thất bại");
  return data.createBlog;
}

export function getBlogs({
  page = 1,
  limit = 6,
  search = "",
  orderBy = "created_at",
  sortOrder = "asc",
}) {
  const { data, loading, error } = useQuery(GET_BLOGS, {
    variables: { page, limit, search, orderBy, sortOrder },
  });

  const blogs = data?.blogs?.data || [];
  const total = data?.blogs?.total || 0;
  const totalPages = Math.ceil(total / limit);

  return { blogs, total, totalPages, loading, error };
}

export function getBlogBySlug(slug?: string) {
  const { data, loading, error } = useQuery(GET_BLOG_BY_SLUG, {
    variables: { slug },
    skip: !slug,
  });

  const blog = data?.blogBySlug || null;

  return {
    blog,
    loading,
    error,
  };
}

export function getBlogsInSidebar() {
  const { data, loading, error } = useQuery(GET_BLOGS, {
    variables: {
      page: 1,
      limit: 8,
      search: "",
      orderBy: "created_at",
      sortOrder: "asc",
    },
  });

  const blogs = data?.blogs?.data || [];
  return { blogs, loading, error };
}

export async function updateBlog({
  id,
  title,
  content,
  coverImage,
}: {
  id: string;
  title: string;
  content: string;
  coverImage?: File | null;
}) {
  const variables: any = { input: { id, title, content } };
  if (coverImage) variables.coverImage = coverImage;
  const { data } = await client.mutate({
    mutation: UPDATE_BLOG,
    variables,
    context: { fetchOptions: { useMultipart: true } },
  });
  return data?.updateBlog;
}

export async function removeBlog(blogId: string) {
  const variables = { removeBlogId: blogId };
  const { data, errors } = await client.mutate({
    mutation: REMOVE_BLOG,
    variables,
  });
  if (errors && errors.length > 0)
    throw new Error(errors[0].message || "Xóa blog thất bại");
  return data?.removeBlog;
}
