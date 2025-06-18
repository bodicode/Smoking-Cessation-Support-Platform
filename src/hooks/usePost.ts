import { useState, useCallback, useEffect } from "react";
import {
    createPost,
    updateSharedPost,
    deleteSharedPost,
    getFeed,
} from "@/services/postsService";
import {
    CreateSharedPostInput,
    UpdateSharedPostInput,
    Post,
    PaginationParamsInput,
    SharedPostFiltersInput,
    SharedPostsResponse,
} from "@/types/api/post";

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

    const fetchFeed = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res: SharedPostsResponse = await getFeed(params, filters);
            setData(res.data);
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
    }, [params, filters]);

    const submitPost = useCallback(async (input: CreateSharedPostInput): Promise<Post> => {
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
    }, [fetchFeed]);

    const editPost = useCallback(async (postId: string, input: UpdateSharedPostInput): Promise<Post> => {
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
    }, [fetchFeed]);

    const deletePost = useCallback(async (postId: string): Promise<Post> => {
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
    }, [fetchFeed]);

    useEffect(() => {
        fetchFeed();
    }, []);

    return {
        data,
        ...pageInfo,
        loading,
        error,
        refetch: fetchFeed,
        submitPost,
        editPost,
        deletePost,
    };
}
