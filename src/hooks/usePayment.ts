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

// Hook to poll payment status
export function usePaymentStatus(paymentId: string, initialStatus: PaymentStatus = "PENDING") {
  const [status, setStatus] = useState<PaymentStatus>(initialStatus);
  const [polling, setPolling] = useState(false);

  useEffect(() => {
    if (!paymentId || status !== "PENDING") return;

    setPolling(true);
    const interval = setInterval(async () => {
      try {
        const data = await getPaymentById(paymentId);
        setStatus(data.status);
        if (data.status !== "PENDING") {
          clearInterval(interval);
          setPolling(false);
        }
      } catch (err) {
        console.error('Error polling payment status:', err);
        // Don't stop polling on errors, just log them
      }
    }, 5000);

    return () => {
      clearInterval(interval);
      setPolling(false);
    };
  }, [paymentId, status]);

  return { status, polling };
} 