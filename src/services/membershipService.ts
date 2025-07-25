import { gql } from "@apollo/client";
import client from "@/apollo/apolloClient";
import { GET_MEMBERSHIP_PACKAGES } from "@/graphql/queries/membership";
import { MembershipPackage, GetMembershipPackagesResponse } from "@/types/api/membership";

// Get all membership packages
export async function getMembershipPackages(): Promise<MembershipPackage[]> {
  try {
    const { data, errors } = await client.query<GetMembershipPackagesResponse>({
      query: GET_MEMBERSHIP_PACKAGES,
      fetchPolicy: "network-only",
    });

    if (errors && errors.length > 0) {
      throw new Error(errors[0].message);
    }

    return data.getMembershipPackages;
  } catch (error) {
    console.error("Error fetching membership packages:", error);
    throw error;
  }
}

// Get membership package by ID
export async function getMembershipPackageById(id: string): Promise<MembershipPackage | null> {
  try {
    const packages = await getMembershipPackages();
    return packages.find(pkg => pkg.id === id) || null;
  } catch (error) {
    console.error("Error fetching membership package by ID:", error);
    throw error;
  }
}

// Get membership packages sorted by price (ascending)
export async function getMembershipPackagesSortedByPrice(): Promise<MembershipPackage[]> {
  try {
    const packages = await getMembershipPackages();
    return packages.sort((a, b) => a.price - b.price);
  } catch (error) {
    console.error("Error fetching sorted membership packages:", error);
    throw error;
  }
}

// Get membership packages sorted by duration (ascending)
export async function getMembershipPackagesSortedByDuration(): Promise<MembershipPackage[]> {
  try {
    const packages = await getMembershipPackages();
    return packages.sort((a, b) => a.duration_days - b.duration_days);
  } catch (error) {
    console.error("Error fetching membership packages sorted by duration:", error);
    throw error;
  }
} 