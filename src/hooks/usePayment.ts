import { useState, useEffect } from "react";
import { getPaymentById } from "@/services/paymentService";
import { Payment, PaymentStatus } from "@/types/api/payment";

interface UsePaymentReturn {
  payment: Payment | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Hook to get payment by ID
export function usePayment(paymentId: string): UsePaymentReturn {
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPayment = async () => {
    if (!paymentId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await getPaymentById(paymentId);
      setPayment(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch payment");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayment();
  }, [paymentId]);

  return {
    payment,
    loading,
    error,
    refetch: fetchPayment,
  };
}

// Hook to check payment status manually
export function usePaymentStatus(paymentId: string, initialStatus: PaymentStatus = "PENDING") {
  const [status, setStatus] = useState<PaymentStatus>(initialStatus);
  const [checking, setChecking] = useState(false);

  const checkStatus = async () => {
    if (!paymentId) return undefined;
    setChecking(true);
    try {
      const data = await getPaymentById(paymentId);
      setStatus(data.status);
      return data.status;
    } catch (err) {
      console.error('Error checking payment status:', err);
      return undefined;
    } finally {
      setChecking(false);
    }
  };

  // Update status if initialStatus changes (e.g., after payment loads)
  useEffect(() => {
    setStatus(initialStatus);
  }, [initialStatus]);

  return { status, checkStatus, checking };
} 