import client from "@/apollo/apolloClient";
import { ADD_POST_COMMENT } from "@/graphql/mutations/posts/createCommentMutation";
import { SHARE_POST } from "@/graphql/mutations/posts/createPostMutation";
import { DELETE_POST_COMMENT } from "@/graphql/mutations/posts/deleteCommentMutation";
import { DELETE_SHARED_POST } from "@/graphql/mutations/posts/deletePostMutation";
import { EDIT_POST_COMMENT } from "@/graphql/mutations/posts/editCommentMutation";
import { LIKE_POST } from "@/graphql/mutations/posts/likePostMutation";
import { REPLY_TO_COMMENT } from "@/graphql/mutations/posts/replyCommentMutation";
import { UNLIKE_POST } from "@/graphql/mutations/posts/unlikePostMutation";
import { UPDATE_SHARED_POST } from "@/graphql/mutations/posts/updatePostMutation";
import { GET_COMMENTS_FOR_POST } from "@/graphql/queries/posts/getComments";
import { GET_LIKERS_FOR_POST } from "@/graphql/queries/posts/getPostLiker";
import { GET_FEED } from "@/graphql/queries/posts/getPosts";
import {
  CreatePostCommentInput,
  ReplyToCommentInput,
} from "@/types/api/comment";
import {
  CreateSharedPostInput,
  ManagePostLikeInput,
  PaginationParamsInput,
  Post,
  SharedPostFiltersInput,
  SharedPostsResponse,
} from "@/types/api/post";

export async function getFeed(
  params?: PaginationParamsInput,
  filters?: SharedPostFiltersInput
): Promise<SharedPostsResponse> {
  const { data, errors } = await client.query({
    query: GET_FEED,
    variables: { params, filters },
    fetchPolicy: "network-only",
  });

  if (errors && errors.length > 0) throw new Error(errors[0].message);
  return data.sharedPosts;
}

export async function createPost(input: CreateSharedPostInput): Promise<Post> {
  const { data, errors } = await client.mutate({
    mutation: SHARE_POST,
    variables: { input },
  });

  if (errors && errors.length > 0) throw new Error(errors[0].message);
  return data.createSharedPost;
}

export async function updateSharedPost(
  postId: string,
  input: { caption: string }
): Promise<Post> {
  const { data, errors } = await client.mutate({
    mutation: UPDATE_SHARED_POST,
    variables: { postId, input },
  });

  if (errors?.length) throw new Error(errors[0].message);
  return data.updateSharedPost;
}

export async function deleteSharedPost(postId: string): Promise<Post> {
  const { data, errors } = await client.mutate({
    mutation: DELETE_SHARED_POST,
    variables: { postId },
  });

  if (errors?.length) throw new Error(errors[0].message);
  return data.removeSharedPost;
}

export async function likePost(input: ManagePostLikeInput): Promise<Post> {
  const { data, errors } = await client.mutate({
    mutation: LIKE_POST,
    variables: { input },
  });
  if (errors?.length) throw new Error(errors[0].message);
  return data.likeSharedPost;
}

export async function unlikePost(input: ManagePostLikeInput): Promise<Post> {
  const { data, errors } = await client.mutate({
    mutation: UNLIKE_POST,
    variables: { input },
  });
  if (errors?.length) throw new Error(errors[0].message);
  return data.unlikeSharedPost.shared_post;
}

export async function getPostLikers(
  postId: string,
  params: { page?: number; limit?: number } = { page: 1, limit: 100 }
) {
  const { data, errors } = await client.query({
    query: GET_LIKERS_FOR_POST,
    variables: { postId, params },
    fetchPolicy: "network-only",
  });

  if (errors?.length) throw new Error(errors[0].message);
  return data.postLikes;
}

export async function getPostComments(
  postId: string,
  params: { page?: number; limit?: number } = { page: 1, limit: 10 }
) {
  const { data, errors } = await client.query({
    query: GET_COMMENTS_FOR_POST,
    variables: { postId, params },
    fetchPolicy: "network-only",
  });

  if (errors?.length) throw new Error(errors[0].message);
  return data.postComments;
}

export async function addPostComment(input: CreatePostCommentInput) {
  const { data, errors } = await client.mutate({
    mutation: ADD_POST_COMMENT,
    variables: { input },
  });

  if (errors?.length) throw new Error(errors[0].message);
  return data.createPostComment;
}

export async function replyToComment(input: ReplyToCommentInput) {
  const { data, errors } = await client.mutate({
    mutation: REPLY_TO_COMMENT,
    variables: { input },
  });

  if (errors?.length) throw new Error(errors[0].message);
  return data.createPostComment;
}

export async function editPostComment(
  commentId: string,
  input: { content: string }
) {
  const { data, errors } = await client.mutate({
    mutation: EDIT_POST_COMMENT,
    variables: { commentIdToUpdate: commentId, input },
  });
  if (errors?.length) throw new Error(errors[0].message);
  return data.updatePostComment;
}

export async function deletePostComment(commentId: string) {
  const { data, errors } = await client.mutate({
    mutation: DELETE_POST_COMMENT,
    variables: { commentIdToDelete: commentId },
  });
  if (errors?.length) throw new Error(errors[0].message);
  return data.deletePostComment;
}
