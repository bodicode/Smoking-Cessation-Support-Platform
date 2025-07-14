import { useState, useCallback, useEffect } from "react";
import {
  getPostComments,
  addPostComment,
  replyToComment,
  editPostComment,
  deletePostComment,
} from "@/services/postsService";

export function usePostComments(postId: string, page = 1, limit = 10) {
  const [comments, setComments] = useState<any[]>([]);
  const [pageInfo, setPageInfo] = useState({
    total: 0,
    page: 1,
    limit: 10,
    hasNext: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  const [replyLoading, setReplyLoading] = useState(false);
  const [replyError, setReplyError] = useState<string | null>(null);

  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    if (!postId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getPostComments(postId, { page, limit });
      setComments(res.data);
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
  }, [postId, page, limit]);

  const submitComment = useCallback(
    async (input: {
      shared_post_id: string;
      content: string;
      parent_comment_id?: string;
    }) => {
      setAddLoading(true);
      setAddError(null);
      try {
        const comment = await addPostComment(input);
        await fetchComments();
        return comment;
      } catch (e: any) {
        setAddError(e.message);
        throw e;
      } finally {
        setAddLoading(false);
      }
    },
    [fetchComments]
  );

  const submitReply = useCallback(
    async (input: {
      shared_post_id: string;
      content: string;
      parent_comment_id: string;
    }) => {
      setReplyLoading(true);
      setReplyError(null);
      try {
        const reply = await replyToComment(input);
        await fetchComments();
        return reply;
      } catch (e: any) {
        setReplyError(e.message);
        throw e;
      } finally {
        setReplyLoading(false);
      }
    },
    [fetchComments]
  );

  const submitEdit = useCallback(
    async (commentId: string, content: string) => {
      setEditLoading(true);
      setEditError(null);
      try {
        const comment = await editPostComment(commentId, { content });
        await fetchComments();
        return comment;
      } catch (e: any) {
        setEditError(e.message);
        throw e;
      } finally {
        setEditLoading(false);
      }
    },
    [fetchComments]
  );

  const submitDelete = useCallback(
    async (commentId: string) => {
      setDeleteLoading(true);
      setDeleteError(null);
      try {
        const result = await deletePostComment(commentId);
        await fetchComments();
        return result;
      } catch (e: any) {
        setDeleteError(e.message);
        throw e;
      } finally {
        setDeleteLoading(false);
      }
    },
    [fetchComments]
  );

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return {
    comments,
    ...pageInfo,
    loading,
    error,
    refetch: fetchComments,

    submitComment,
    addLoading,
    addError,

    submitReply,
    replyLoading,
    replyError,

    submitEdit,
    editLoading,
    editError,

    submitDelete,
    deleteLoading,
    deleteError,
  };
}
