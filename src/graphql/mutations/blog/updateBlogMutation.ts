import { gql } from "@apollo/client";

export const UPDATE_BLOG = gql`
  mutation updateBlog($input: UpdateBlogInput!, $coverImage: FileUpload) {
    updateBlog(input: $input, coverImage: $coverImage) {
      id
      title
      slug
      cover_image
    }
  }
`;
