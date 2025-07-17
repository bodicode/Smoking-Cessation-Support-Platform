import { useState, useEffect } from "react";
import { getMembershipPackages, getMembershipPackageById } from "@/services/membershipService";
import { MembershipPackage } from "@/types/api/membership";

interface UseMembershipReturn {
  membershipPackages: MembershipPackage[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface UseMembershipByIdReturn {
  membershipPackage: MembershipPackage | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Hook to get all membership packages
export function useMembership(): UseMembershipReturn {
  const [membershipPackages, setMembershipPackages] = useState<MembershipPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPackages = async () => {
    setLoading(true);
    setError(null);
    try {
      const packages = await getMembershipPackages();
      setMembershipPackages(packages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch membership packages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  return {
    membershipPackages,
    loading,
    error,
    refetch: fetchPackages,
  };
}

// Hook to get membership package by ID
export function useMembershipById(packageId: string): UseMembershipByIdReturn {
  const [membershipPackage, setMembershipPackage] = useState<MembershipPackage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPackage = async () => {
    if (!packageId || packageId.trim() === "") {
      setMembershipPackage(null);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const packageData = await getMembershipPackageById(packageId);
      setMembershipPackage(packageData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch membership package");
      setMembershipPackage(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackage();
  }, [packageId]);

  return {
    membershipPackage,
    loading,
    error,
    refetch: fetchPackage,
  };
}