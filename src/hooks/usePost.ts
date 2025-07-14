import { useState, useCallback, useEffect, useMemo } from "react";
import {
  createPost,
  updateSharedPost,
  deleteSharedPost,
  getFeed,
  getPostLikers,
  unlikePost,
  likePost,
} from "@/services/postsService";
import {
  CreateSharedPostInput,
  UpdateSharedPostInput,
  Post,
  PaginationParamsInput,
  SharedPostFiltersInput,
  SharedPostsResponse,
} from "@/types/api/post";
import { useAuth } from "./useAuth";

export function usePost(
  params?: PaginationParamsInput,
  filters?: SharedPostFiltersInput
) {
  const [data, setData] = useState<Post[]>([]);
  const [pageInfo, setPageInfo] = useState({
    total: 0,
    page: 1,
    limit: 10,
    hasNext: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const memoParams = useMemo(() => params, [JSON.stringify(params)]);
  const memoFilters = useMemo(() => filters, [JSON.stringify(filters)]);

  const { user } = useAuth();
  const currentUserId = user?.id;

  const fetchPostsWithLiked = useCallback(
    async (posts: Post[]) => {
      if (!currentUserId) return posts.map((p) => ({ ...p, liked: false }));
      const postsWithLiked = await Promise.all(
        posts.map(async (post) => {
          try {
            const res = await getPostLikers(post.id, { page: 1, limit: 10 });
            const liked = res.data.some(
              (like: any) => like.user.id === currentUserId
            );
            return { ...post, liked };
          } catch {
            return { ...post, liked: false };
          }
        })
      );
      return postsWithLiked;
    },
    [currentUserId]
  );

  const fetchFeed = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res: SharedPostsResponse = await getFeed(memoParams, memoFilters);
      const postsWithLiked = await fetchPostsWithLiked(res.data);
      setData(postsWithLiked);
      setPageInfo({
        total: res.total,
        page: res.page,
        limit: res.limit,
        hasNext: res.hasNext,
      });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [memoParams, memoFilters, fetchPostsWithLiked]);

  const submitPost = useCallback(
    async (input: CreateSharedPostInput): Promise<Post> => {
      setLoading(true);
      setError(null);
      try {
        const newPost = await createPost(input);
        await fetchFeed();
        return newPost;
      } catch (e: any) {
        setError(e.message);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [fetchFeed]
  );

  const editPost = useCallback(
    async (postId: string, input: UpdateSharedPostInput): Promise<Post> => {
      setLoading(true);
      setError(null);
      try {
        const updated = await updateSharedPost(postId, input);
        await fetchFeed();
        return updated;
      } catch (e: any) {
        setError(e.message);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [fetchFeed]
  );

  const deletePost = useCallback(
    async (postId: string): Promise<Post> => {
      setLoading(true);
      setError(null);
      try {
        const removed = await deleteSharedPost(postId);
        await fetchFeed();
        return removed;
      } catch (e: any) {
        setError(e.message);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [fetchFeed]
  );

  // --- Optimistic UI cho LIKE ---
  const handleLikePost = useCallback(async (postId: string) => {
    setData((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, liked: true, likes_count: p.likes_count + 1 }
          : p
      )
    );
    try {
      await likePost({ shared_post_id: postId });
    } catch (e: any) {
      // rollback nếu lỗi
      setData((prev) =>
        prev.map((p) =>
          p.id === postId
            ? { ...p, liked: false, likes_count: p.likes_count - 1 }
            : p
        )
      );
      setError(e.message);
      throw e;
    }
  }, []);

  // --- Optimistic UI cho UNLIKE ---
  const handleUnlikePost = useCallback(async (postId: string) => {
    setData((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, liked: false, likes_count: Math.max(0, p.likes_count - 1) }
          : p
      )
    );
    try {
      await unlikePost({ shared_post_id: postId });
    } catch (e: any) {
      // rollback nếu lỗi
      setData((prev) =>
        prev.map((p) =>
          p.id === postId
            ? { ...p, liked: true, likes_count: p.likes_count + 1 }
            : p
        )
      );
      setError(e.message);
      throw e;
    }
  }, []);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  return {
    data,
    ...pageInfo,
    loading,
    error,
    refetch: fetchFeed,
    submitPost,
    editPost,
    deletePost,
    likePost: handleLikePost,
    unlikePost: handleUnlikePost,
    setData, // Cho phép cập nhật state ngoài nếu cần
  };
}
