import { useState, useEffect } from "react";
import { getCurrentUserSubscription } from "@/services/paymentService";
import { UserSubscription } from "@/types/api/payment";

interface UseUserSubscriptionReturn {
  subscription: UserSubscription | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Hook to get user subscription
export function useUserSubscription(): UseUserSubscriptionReturn {
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscription = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCurrentUserSubscription();
      setSubscription(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch subscription");
      setSubscription(null);
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