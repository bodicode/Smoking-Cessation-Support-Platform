import { useState, useEffect } from "react";
import { getCessationPlans } from "@/services/cessationPlanService";
import { useAuth } from "./useAuth";

export function useUserPlans() {
  const [hasActivePlans, setHasActivePlans] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();

  useEffect(() => {
    const checkUserPlans = async () => {
      if (!user?.id) {
        setHasActivePlans(false);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const plans = await getCessationPlans({ userId: user.id });
        const hasActive = plans.some(plan => plan.status !== "CANCELLED");
        setHasActivePlans(hasActive);
      } catch (error) {
        console.error("Error checking user plans:", error);
        setHasActivePlans(false);
      } finally {
        setLoading(false);
      }
    };

    // Reset state immediately when user changes
    setHasActivePlans(false);
    setLoading(true);
    
    checkUserPlans();
  }, [user?.id]);

  return { hasActivePlans, loading };
} 