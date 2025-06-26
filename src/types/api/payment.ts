// Payment-related TypeScript types

export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED";

export interface PaymentTransaction {
  id: string;
  gateway: string;
  transactionDate: string;
  amountIn: number;
  amountOut: number;
}

export interface Payment {
  id: string;
  user_id: string;
  subscription_id?: string;
  content: string;
  status: PaymentStatus;
  price: number;
  packageName: string;
  payment_transaction?: PaymentTransaction;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  package_id: string;
  status: string;
  start_date: string;
  end_date: string;
} 