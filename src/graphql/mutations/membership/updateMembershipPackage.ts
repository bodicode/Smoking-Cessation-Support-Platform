import { gql } from "@apollo/client";

export const UPDATE_MEMBERSHIP_PACKAGE = gql`
  mutation($input: UpdateMembershipPackageInput!) {
    updateMembershipPackage(input: $input) {
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
