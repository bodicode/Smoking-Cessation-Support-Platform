import { gql } from "@apollo/client";

export const DELETE_POST_COMMENT = gql`
  mutation RemoveComment($commentIdToDelete: ID!) {
    deletePostComment(commentId: $commentIdToDelete) {
      id
      is_deleted
      content
    }
  }
`;
