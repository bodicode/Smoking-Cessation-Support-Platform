import { gql } from "@apollo/client";

export const UNLIKE_POST = gql`
  mutation UnlikePost($input: ManagePostLikeInput!) {
    unlikeSharedPost(input: $input) {
      id
      user {
        id
        name
      }
    }
  }
`;