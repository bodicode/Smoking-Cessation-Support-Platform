import { gql } from "@apollo/client";

export const CREATE_MEMBERSHIP_PACKAGE = gql`
  mutation($input: CreateMembershipPackageInput!) {
    createMembershipPackage(input: $input) {
      id
      name
      price
      description
      duration_days
      created_at
      updated_at
    }
  }
`;
