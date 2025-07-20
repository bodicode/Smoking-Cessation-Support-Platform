import { gql } from "@apollo/client";

export const GET_ALL_PAYMENTS_WITH_TRANSACTIONS = gql`
  query GetAllPaymentsWithTransactions {
    getAllPaymentsWithTransactions {
      content
      id
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
      payment_transaction_id
      price
      status
      subscription_id
      user_id
      user {
        user_name
      }
    }
  }
`;

export interface PaymentTransaction {
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

export interface PaymentUser {
  user_name: string;
}

export interface PaymentWithTransaction {
  content: string;
  id: string;
  payment_transaction: PaymentTransaction;
  payment_transaction_id: string;
  price: number;
  status: string;
  subscription_id: string;
  user_id: string;
  user: PaymentUser;
}

export interface GetAllPaymentsWithTransactionsResponse {
  getAllPaymentsWithTransactions: PaymentWithTransaction[];
} 