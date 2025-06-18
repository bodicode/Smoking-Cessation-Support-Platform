import { gql } from "@apollo/client";

export const DELETE_SHARED_POST = gql`
  mutation DeleteMySharedPost($postId: ID!) {
    removeSharedPost(id: $postId) {
      id
      is_deleted
      caption
    }
  }
`;
