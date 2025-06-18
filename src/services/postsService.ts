import client from "@/apollo/apolloClient";
import { SHARE_POST } from "@/graphql/mutations/posts/createPostMutation";
import { DELETE_SHARED_POST } from "@/graphql/mutations/posts/deletePostMutation";
import { UPDATE_SHARED_POST } from "@/graphql/mutations/posts/updatePostMutation";
import { GET_FEED } from "@/graphql/queries/posts/getPosts";
import { CreateSharedPostInput, PaginationParamsInput, Post, SharedPostFiltersInput, SharedPostsResponse, } from "@/types/api/post";

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

export async function updateSharedPost(postId: string, input: { caption: string }): Promise<Post> {
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