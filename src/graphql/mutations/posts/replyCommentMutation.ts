import { gql } from "@apollo/client";

export const REPLY_TO_COMMENT = gql`
  mutation ReplyToComment($input: CreatePostCommentInput!) {
    createPostComment(input: $input) {
      id
      content
      shared_post_id
      parent_comment_id
      user {
        id
        name
      }
      created_at
    }
  }
`;
