import { gql } from "@apollo/client";

export const EDIT_POST_COMMENT = gql`
  mutation EditMyComment(
    $commentIdToUpdate: ID!
    $input: UpdatePostCommentInput!
  ) {
    updatePostComment(commentId: $commentIdToUpdate, input: $input) {
      id
      content
      updated_at
      user {
        id
        name
      }
    }
  }
`;
