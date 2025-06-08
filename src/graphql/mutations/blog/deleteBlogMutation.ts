import { gql } from "@apollo/client";

export const REMOVE_BLOG = gql`
  mutation removeBlog($removeBlogId: String!) {
    removeBlog(id: $removeBlogId) {
      content
      is_deleted
      id
    }
  }
`;
