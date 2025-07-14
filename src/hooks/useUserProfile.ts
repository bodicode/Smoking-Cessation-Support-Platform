import { useState, useEffect } from "react";
import { getCurrentUserProfile, getUserProfile } from "@/services/userService";
import { UserProfile } from "@/types/api/user";

interface UseUserProfileReturn {
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Hook to get current user profile
export function useUserProfile(): UseUserProfileReturn {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const profile = await getCurrentUserProfile();
      setUserProfile(profile);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch user profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return {
    userProfile,
    loading,
    error,
    refetch: fetchUserProfile,
  };
}

// Hook to get user profile by ID
export function useUserProfileById(userId: string): UseUserProfileReturn {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfile = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const profile = await getUserProfile(userId);
      setUserProfile(profile);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch user profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [userId]);

  return {
    userProfile,
    loading,
    error,
    refetch: fetchUserProfile,
  };
}
