import { gql } from "@apollo/client";

export const GET_MEMBER_PAYMENTS_WITH_TRANSACTIONS = gql`
  query GetMemberPaymentsWithTransactions {
    getMemberPaymentsWithTransactions {
      content
      id
      payment_transaction {
        accountNumber
        accumulated
        amountIn
        amountOut
        body
        code
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
      subscription {
        id
        package {
          description
          duration_days
          name
          price
        }
      }
      subscription_id
      user {
        avatar_url
        id
        name
        user_name
      }
      user_id
    }
  }
`;

export interface MemberPaymentTransaction {
  accountNumber: string;
  accumulated: number;
  amountIn: number;
  amountOut: number;
  body: string;
  code: string | null;
  gateway: string;
  id: string;
  referenceNumber: string;
  sepay_id: string;
  subAccount: string | null;
  transactionContent: string;
  transactionDate: string;
}

export interface MemberPaymentPackage {
  description: string[];
  duration_days: number;
  name: string;
  price: number;
}

export interface MemberPaymentSubscription {
  id: string;
  package: MemberPaymentPackage;
}

export interface MemberPaymentUser {
  avatar_url: string;
  id: string;
  name: string;
  user_name: string;
}

export interface MemberPaymentWithTransaction {
  content: string;
  id: string;
  payment_transaction: MemberPaymentTransaction;
  payment_transaction_id: string;
  price: number;
  status: string;
  subscription: MemberPaymentSubscription;
  subscription_id: string;
  user: MemberPaymentUser;
  user_id: string;
}

export interface GetMemberPaymentsWithTransactionsResponse {
  getMemberPaymentsWithTransactions: MemberPaymentWithTransaction[];
}
