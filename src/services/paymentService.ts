// Centralized payment service for all payment-related logic
import { gql } from "@apollo/client";
import client from "@/apollo/apolloClient";
import {
  GET_USER_SUBSCRIPTION,
  GET_PAYMENT_BY_ID,
  GetPaymentByIdResponse,
} from "@/graphql/queries/payments";
import {
  CREATE_PAYMENT,
  CreatePaymentInput,
  CreatePaymentResponse,
} from "@/graphql/mutations/payments";
import { getMembershipPackageById } from "./membershipService";
import { jwtDecode } from "jwt-decode";
import { Payment, PaymentStatus } from "@/types/api/payment";
import {
  UserSubscription,
  GetUserSubscriptionResponse,
} from "@/types/api/subscription";

// Get user ID from JWT token using existing pattern
export function getUserIdFromToken(): string | null {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) return null;

    const decoded: any = jwtDecode(token);
    return decoded.sub || null;
  } catch (error) {
    console.error("Error getting user ID from token:", error);
    return null;
  }
}

// Create payment using GraphQL mutation
export async function createPayment(
  membership_package_id: string
): Promise<Payment> {
  try {
    // Get user ID from JWT token using existing pattern
    const user_id = getUserIdFromToken();
    if (!user_id) {
      throw new Error("User not authenticated");
    }

    // Get membership package details for package name
    const plan = await getMembershipPackageById(membership_package_id);

    // Create payment input
    const input: CreatePaymentInput = {
      user_id,
      membership_package_id,
    };

    // Execute GraphQL mutation
    const { data, errors } = await client.mutate<CreatePaymentResponse>({
      mutation: CREATE_PAYMENT,
      variables: { input },
    });

    if (errors && errors.length > 0) {
      throw new Error(errors[0].message);
    }

    if (!data?.createPayment) {
      throw new Error("Failed to create payment");
    }

    // Transform response to match our Payment interface
    const payment: Payment = {
      id: data.createPayment.id,
      user_id: data.createPayment.user_id,
      subscription_id: data.createPayment.subscription_id,
      content: data.createPayment.content,
      status: data.createPayment.status as PaymentStatus,
      price: data.createPayment.price,
      packageName: plan?.name || "Unknown Package",
      payment_transaction: data.createPayment.payment_transaction,
    };

    return payment;
  } catch (error) {
    throw error;
  }
}

// Get payment by ID using GraphQL query
export async function getPaymentById(paymentId: string): Promise<Payment> {
  try {
    // Get current user ID to verify ownership
    const currentUserId = getUserIdFromToken();
    if (!currentUserId) {
      throw new Error("User not authenticated");
    }

    // Execute GraphQL query with correct parameter name
    const { data, errors } = await client.query<GetPaymentByIdResponse>({
      query: GET_PAYMENT_BY_ID,
      variables: { id: paymentId },
      fetchPolicy: "network-only",
    });

    if (errors && errors.length > 0) {
      throw new Error(errors[0].message);
    }

    if (!data?.getPaymentById) {
      throw new Error("Payment not found");
    }

    // Verify that the payment belongs to the current user
    if (data.getPaymentById.user_id !== currentUserId) {
      throw new Error("Access denied: Payment does not belong to current user");
    }

    // Since we don't have membership_package_id in the response, we'll use a default package name
    // You might want to store the package name when creating the payment or fetch it separately
    const packageName = "Membership Package"; // Default fallback

    // Transform response to match our Payment interface
    const payment: Payment = {
      id: data.getPaymentById.id,
      user_id: data.getPaymentById.user_id,
      subscription_id: data.getPaymentById.subscription_id,
      content: data.getPaymentById.content,
      status: data.getPaymentById.status as PaymentStatus,
      price: data.getPaymentById.price,
      packageName: packageName,
      payment_transaction: data.getPaymentById.payment_transaction,
    };

    return payment;
  } catch (error) {
    console.error("Error fetching payment:", error);
    throw error;
  }
}

// Update payment status (mock - replace with real GraphQL mutation when available)
export async function updatePaymentStatus(
  paymentId: string,
  status: PaymentStatus
): Promise<Payment> {
  return {
    id: paymentId,
    user_id: "demo-user-id",
    content: `SB${paymentId}`,
    status,
    price: 0,
    packageName: "Unknown Package",
  };
}

// Get user subscription
export async function getUserSubscription(): Promise<UserSubscription | null> {
  try {
    const { data, errors } = await client.query<GetUserSubscriptionResponse>({
      query: GET_USER_SUBSCRIPTION,
      fetchPolicy: "network-only",
    });

    if (errors && errors.length > 0) {
      throw new Error(errors[0].message);
    }

    // Giả sử server trả về một mảng, lấy subscription active đầu tiên hoặc null
    const activeSubscription = Array.isArray(data.getUserSubscription)
      ? data.getUserSubscription.find((sub) => sub.status === "Active") || null
      : null;

    return activeSubscription;
  } catch (error) {
    throw error;
  }
}
export async function getCurrentUserSubscription(): Promise<UserSubscription | null> {
  const userId = getUserIdFromToken();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  return getUserSubscription();
}
