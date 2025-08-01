import { gql } from "@apollo/client";

export const GET_MEMBERSHIP_PACKAGES = gql`
  query GetMembershipPackages {
    getMembershipPackages {
      id
      name
      description
      price
      duration_days
      is_active
      created_at
      updated_at
    }
  }
`; 