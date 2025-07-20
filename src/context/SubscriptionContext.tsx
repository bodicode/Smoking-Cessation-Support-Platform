import { getUserSubscription } from "@/services/paymentService";
import { UserSubscription } from "@/types/api/payment";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface SubscriptionContextType {
  isSubscribed: boolean;
  subscription: UserSubscription | null;
  loading: boolean;
  error: string | null;
  fetchSubscription: (userId: string) => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(
  undefined
);

interface SubscriptionProviderProps {
  children: ReactNode;
}

export const SubscriptionProvider: React.FC<SubscriptionProviderProps> = ({
  children,
}) => {
  const [subscription, setSubscription] = useState<UserSubscription | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const isSubscribed = subscription?.status === "Active";

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUserSubscription();

      const activeSubscription = Array.isArray(data)
        ? data.find((sub) => sub.status === "Active") || null
        : data;

      setSubscription(activeSubscription);
    } catch (err) {
      setSubscription(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
    if (token) {
      fetchSubscription();
    } else {
      setLoading(false);
      setSubscription(null);
    }
  }, []);

  return (
    <SubscriptionContext.Provider
      value={{ isSubscribed, subscription, loading, error, fetchSubscription }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = (): SubscriptionContextType => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error(
      "useSubscription must be used within a SubscriptionProvider"
    );
  }
  return context;
};
