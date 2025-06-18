import { gql } from "@apollo/client";

export const SHARE_POST = gql`
  mutation ShareMyBadge($input: CreateSharedPostInput!) {
    createSharedPost(input: $input) {
      id
      caption
      user_badge {
        id
        user_id
        badge {
          id
          name
          icon_url
        }
      }
      likes_count
      comments_count
      created_at
    }
  }
`;
