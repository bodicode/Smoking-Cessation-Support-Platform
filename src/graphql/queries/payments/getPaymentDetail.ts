import { gql } from "@apollo/client";

export const GET_PAYMENT_DETAIL = gql`
  query GetPaymentDetail($getPaymentDetailId: String!) {
    getPaymentDetail(id: $getPaymentDetailId) {
      content
      created_at
      id
      notes
      payment_method
      payment_transaction {
        accountNumber
        amountIn
        body
        code
        amountOut
        accumulated
        gateway
        id
        referenceNumber
        sepay_id
        subAccount
        transactionContent
        transactionDate
      }
      price
      status
      subscription {
        id
        package {
          description
          duration_days
          name
          price
        }
      }
      updated_at
    }
  }
`;

export interface PaymentDetailTransaction {
  accountNumber: string;
  amountIn: number;
  body: string;
  code: string | null;
  amountOut: number;
  accumulated: number;
  gateway: string;
  id: string;
  referenceNumber: string;
  sepay_id: string;
  subAccount: string | null;
  transactionContent: string;
  transactionDate: string;
}

export interface PaymentDetailPackage {
  description: string[];
  duration_days: number;
  name: string;
  price: number;
}

export interface PaymentDetailSubscription {
  id: string;
  package: PaymentDetailPackage;
}

export interface PaymentDetail {
  content: string;
  created_at: string;
  id: string;
  notes: string | null;
  payment_method: string;
  payment_transaction: PaymentDetailTransaction;
  price: number;
  status: string;
  subscription: PaymentDetailSubscription;
  updated_at: string;
}

export interface GetPaymentDetailResponse {
  getPaymentDetail: PaymentDetail;
} 