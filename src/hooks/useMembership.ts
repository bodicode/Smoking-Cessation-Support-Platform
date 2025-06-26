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

  const fetchMembershipPackages = async () => {
    try {
      setLoading(true);
      setError(null);
      const packages = await getMembershipPackages();
      setMembershipPackages(packages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch membership packages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembershipPackages();
  }, []);

  return {
    membershipPackages,
    loading,
    error,
    refetch: fetchMembershipPackages,
  };
}

// Hook to get a specific membership package by ID
export function useMembershipById(id: string): UseMembershipByIdReturn {
  const [membershipPackage, setMembershipPackage] = useState<MembershipPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMembershipPackage = async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const pkg = await getMembershipPackageById(id);
      setMembershipPackage(pkg);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch membership package");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembershipPackage();
  }, [id]);

  return {
    membershipPackage,
    loading,
    error,
    refetch: fetchMembershipPackage,
  };
} 