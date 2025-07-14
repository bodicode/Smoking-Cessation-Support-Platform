import { gql } from '@apollo/client';

export const LIKE_POST = gql`
  mutation LikePost($input: ManagePostLikeInput!) {
    likeSharedPost(input: $input) {
      id
      user {
        id
        name
      }
    }
  }
`;