import { gql } from "@apollo/client";

export const GET_BLOG_BY_SLUG = gql`
  query getBlogBySlug($slug: String!) {
    blogBySlug(slug: $slug) {
      id
      author {
        avatar_url
        name
      }
      title
      created_at
      cover_image
      content
    }
  }
`;
