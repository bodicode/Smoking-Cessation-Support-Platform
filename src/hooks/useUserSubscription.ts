import { useState, useEffect } from "react";
import { getUserSubscription } from "@/services/paymentService";
import { jwtDecode } from "jwt-decode";

interface UseUserSubscriptionReturn {
  subscription: any;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Get user ID from JWT token using existing pattern
function getUserIdFromToken(): string | null {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) return null;
    
    const decoded: any = jwtDecode(token);
    return decoded.sub || null;
  } catch (error) {
    console.error('Error getting user ID from token:', error);
    return null;
  }
}

// Hook to get user subscription
export function useUserSubscription(): UseUserSubscriptionReturn {
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const userId = getUserIdFromToken();
      if (!userId) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      const data = await getUserSubscription(userId);
      setSubscription(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch subscription");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  return {
    subscription,
    loading,
    error,
    refetch: fetchSubscription,
  };
} 