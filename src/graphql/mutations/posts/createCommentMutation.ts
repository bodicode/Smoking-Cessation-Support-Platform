import { gql } from "@apollo/client";

export const ADD_POST_COMMENT = gql`
  mutation AddCommentToPost($input: CreatePostCommentInput!) {
    createPostComment(input: $input) {
      id
      content
      parent_comment_id
      user {
        id
        name
      }
      created_at
    }
  }
`;
