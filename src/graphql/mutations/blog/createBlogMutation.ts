import { gql } from "@apollo/client";

export const CREATE_BLOG_MUTATION = gql`
  mutation createBlog($input: CreateBlogInput!, $coverImage: FileUpload) {
    createBlog(input: $input, coverImage: $coverImage) {
      id
      title
      slug
      cover_image
    }
  }
`;
