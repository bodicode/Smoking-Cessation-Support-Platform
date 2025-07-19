import { useState, useEffect } from "react";
import { getUserById } from "@/services/userProfileService";
import { UserProfile } from "@/types/api/userProfile";

export function useUserProfile(userId?: string) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;

      setLoading(true);
      setError(null);

      try {
        const data = await getUserById(userId);
        setProfile(data);
      } catch (err: any) {
        setError(err.message || "Lỗi tải thông tin người dùng");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const refetch = async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const data = await getUserById(userId);
      setProfile(data);
    } catch (err: any) {
      setError(err.message || "Lỗi tải thông tin người dùng");
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    loading,
    error,
    refetch
  };
}
