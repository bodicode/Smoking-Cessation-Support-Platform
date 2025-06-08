import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation Login($loginInput: LoginBodyDTO!) {
    login(loginInput: $loginInput) {
      data {
        session {
          access_token
        }
        user {
          email
        }
      }
    }
  }
`;
