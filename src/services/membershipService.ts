import { gql } from "@apollo/client";
import client from "@/apollo/apolloClient";
import { GET_MEMBERSHIP_PACKAGES } from "@/graphql/queries/membership";
import { CREATE_MEMBERSHIP_PACKAGE } from "@/graphql/mutations/membership/createMembershipPackage";
import { UPDATE_MEMBERSHIP_PACKAGE } from "@/graphql/mutations/membership/updateMembershipPackage";
import { DELETE_MEMBERSHIP_PACKAGE } from "@/graphql/mutations/membership/deleteMembershipPackage";
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

// Create a new membership package
export async function createMembershipPackage(input: {
  name: string;
  price: number;
  description: string[];
  duration_days: number;
  is_active?: boolean;
}): Promise<MembershipPackage> {
  try {
    // Remove is_active if backend does not support it
    const cleanInput = { ...input };
    // Remove is_active if undefined or not supported
    if (cleanInput.is_active === undefined) {
      delete cleanInput.is_active;
    }
    // If you know backend does NOT support is_active, always delete:
    // delete cleanInput.is_active;

    const { data, errors } = await client.mutate({
      mutation: CREATE_MEMBERSHIP_PACKAGE,
      variables: { input: cleanInput },
    });

    if (errors && errors.length > 0) {
      throw new Error(errors[0].message);
    }

    return data.createMembershipPackage;
  } catch (error) {
    throw error;
  }
}

// Update an existing membership package
export async function updateMembershipPackage(input: {
  id: string;
  name?: string;
  price?: number;
  description?: string[];
  duration_days?: number;
  is_active?: boolean;
}): Promise<MembershipPackage> {
  try {
    const { data, errors } = await client.mutate({
      mutation: UPDATE_MEMBERSHIP_PACKAGE,
      variables: { input },
    });

    if (errors && errors.length > 0) {
      // Show message from response if present, otherwise show default message
      const errorMsg = errors[0]?.message || "Cập nhật trạng thái thất bại";
      throw new Error(errorMsg);
    }

    return data.updateMembershipPackage;
  } catch (error: any) {
    // If error has a message from backend, show it, otherwise show default
    throw new Error(error?.message || "Cập nhật trạng thái thất bại");
  }
}

// Delete a membership package by ID
export async function deleteMembershipPackage(id: string): Promise<boolean> {
  try {
    const { data, errors } = await client.mutate({
      mutation: DELETE_MEMBERSHIP_PACKAGE,
      variables: { deleteMembershipPackageId: id },
    });

    if (errors && errors.length > 0) {
      throw new Error(errors[0].message);
    }

    // The mutation returns true/false
    return !!data.deleteMembershipPackage;
  } catch (error) {
    throw error;
  }
}