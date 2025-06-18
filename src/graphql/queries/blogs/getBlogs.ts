import { gql } from "@apollo/client";

export const GET_BLOGS = gql`
  query GetBlogs(
    $page: Int!
    $limit: Int!
    $search: String
    $orderBy: String
    $sortOrder: String
    $filters: BlogFilterInput
  ) {
    blogs(
      params: {
        page: $page
        limit: $limit
        search: $search
        orderBy: $orderBy
        sortOrder: $sortOrder
      }
      filters: $filters
    ) {
      data {
        id
        title
        content
        slug
        created_at
        cover_image
        author {
          name
        }
      }
      total
      page
      limit
      hasNext
    }
  }
`;