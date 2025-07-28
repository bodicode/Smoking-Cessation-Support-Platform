import { gql } from "@apollo/client";

export const DELETE_MEMBERSHIP_PACKAGE = gql`
  mutation DeleteMembershipPackage($deleteMembershipPackageId: String!) {
    deleteMembershipPackage(id: $deleteMembershipPackageId)
  }
`;
