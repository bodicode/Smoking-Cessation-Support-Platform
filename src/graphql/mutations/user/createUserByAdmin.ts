import { gql } from "@apollo/client";

export const CREATE_USER_BY_ADMIN = gql`
  mutation createUserByAdmin($createUserInput: CreateUserInput!) {
    createUserByAdmin(createUserInput: $createUserInput) {
      data {
        session {
          access_token
          expires_in
          provider_token
          refresh_token
          token_type
        }
        user {
          email
          id
          user_metadata {
            name
            role
            user_name
          }
        }
        weakPassword {
          isWeak
          message
        }
      }
    }
  }
`; 