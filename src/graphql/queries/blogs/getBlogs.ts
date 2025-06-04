import { gql } from "@apollo/client";

export const GET_BLOGS = gql`
  query GetBlogs($page: Int!, $limit: Int!, $search: String, $orderBy: String, $sortOrder: String) {
    blogs(params: {
      page: $page
      limit: $limit
      search: $search
      orderBy: $orderBy
      sortOrder: $sortOrder
    }) {
      data {
        id
        title
        content
        slug
        created_at
        author {
          name
        }
        cover_image
        }
      total
      page
      limit
      hasNext
    }
  }
`;
