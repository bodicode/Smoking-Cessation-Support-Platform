import { gql } from "@apollo/client";

export const SIGNUP_MUTATION = gql`
  mutation signup($signupInput: SignupBodyDTO!) {
    signup(signupInput: $signupInput) {
      message
    }
  }
`;
