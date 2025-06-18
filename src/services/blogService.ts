import client from "@/apollo/apolloClient";
import { CREATE_BLOG_MUTATION } from "@/graphql/mutations/blog/createBlogMutation";
import { REMOVE_BLOG } from "@/graphql/mutations/blog/deleteBlogMutation";
import { UPDATE_BLOG } from "@/graphql/mutations/blog/updateBlogMutation";
import { GET_BLOG_BY_SLUG } from "@/graphql/queries/blogs/getBlogBySlug";
import { GET_BLOGS } from "@/graphql/queries/blogs/getBlogs";
import {
  BlogInput,
  BlogUpdateInput,
  Blog,
  BlogList
} from "@/types/api/blog";
import { useQuery } from "@apollo/client";

export async function createBlog({ title, content, coverImage }: BlogInput): Promise<Blog> {
  const variables = {
    input: { title, content },
    coverImage: coverImage || null,
  };

  const { data, errors } = await client.mutate<{ createBlog: Blog }>({
    mutation: CREATE_BLOG_MUTATION,
    variables,
  });

  if (errors && errors.length > 0)
    throw new Error(errors[0].message || "Đăng blog thất bại");
  return data!.createBlog;
}

export function getBlogs({
  page = 1,
  limit = 6,
  search = "",
  orderBy = "created_at",
  sortOrder = "asc",
  filters = undefined,
}: {
  page?: number;
  limit?: number;
  search?: string;
  orderBy?: string;
  sortOrder?: string;
  filters?: { authorId?: string };
} = {}) {
  const { data, loading, error } = useQuery<{ blogs: BlogList }>(GET_BLOGS, {
    variables: { page, limit, search, orderBy, sortOrder, filters },
    fetchPolicy: "cache-and-network",
  });

  const blogs = data?.blogs?.data || [];
  const total = data?.blogs?.total || 0;
  const totalPages = Math.ceil(total / limit);

  return { blogs, total, totalPages, loading, error };
}


export function getBlogBySlug(slug?: string) {
  const { data, loading, error } = useQuery<{ blogBySlug: Blog }>(GET_BLOG_BY_SLUG, {
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
  const { data, loading, error } = useQuery<{ blogs: BlogList }>(GET_BLOGS, {
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
}: BlogUpdateInput): Promise<Blog> {
  const variables: any = { input: { id, title, content } };
  if (coverImage) variables.coverImage = coverImage;
  const { data } = await client.mutate<{ updateBlog: Blog }>({
    mutation: UPDATE_BLOG,
    variables,
    context: { fetchOptions: { useMultipart: true } },
  });
  return data!.updateBlog;
}

export async function removeBlog(blogId: string): Promise<Blog> {
  const variables = { removeBlogId: blogId };
  const { data, errors } = await client.mutate<{ removeBlog: Blog }>({
    mutation: REMOVE_BLOG,
    variables,
  });
  if (errors && errors.length > 0)
    throw new Error(errors[0].message || "Xóa blog thất bại");
  return data!.removeBlog;
}
