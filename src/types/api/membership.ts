// Membership-related TypeScript types

export interface MembershipPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  duration_days: number;
  created_at: string;
  updated_at: string;
}

export interface GetMembershipPackagesResponse {
  getMembershipPackages: MembershipPackage[];
} 