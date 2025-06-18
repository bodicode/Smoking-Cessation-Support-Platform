import { gql } from "@apollo/client";

export const UPDATE_SHARED_POST = gql`
  mutation EditMySharedPost($postId: ID!, $input: UpdateSharedPostInput!) {
    updateSharedPost(id: $postId, input: $input) {
      id
      caption
      updated_at
      user_badge {
        user {
          id
        }
      }
    }
  }
`;
