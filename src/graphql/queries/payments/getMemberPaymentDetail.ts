import { gql } from "@apollo/client";

export const GET_MEMBER_PAYMENT_DETAIL = gql`
  query GetMemberPaymentDetail($getMemberPaymentDetailId: String!) {
    getMemberPaymentDetail(id: $getMemberPaymentDetailId) {
      content
      created_at
      id
      notes
      payment_method
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
      updated_at
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

export interface MemberPaymentDetailTransaction {
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

export interface MemberPaymentDetailPackage {
  description: string[];
  duration_days: number;
  name: string;
  price: number;
}

export interface MemberPaymentDetailSubscription {
  id: string;
  package: MemberPaymentDetailPackage;
}

export interface MemberPaymentDetailUser {
  avatar_url: string;
  id: string;
  name: string;
  user_name: string;
}

export interface MemberPaymentDetail {
  content: string;
  created_at: string;
  id: string;
  notes: string | null;
  payment_method: string;
  payment_transaction: MemberPaymentDetailTransaction;
  price: number;
  status: string;
  subscription: MemberPaymentDetailSubscription;
  subscription_id: string;
  updated_at: string;
  user: MemberPaymentDetailUser;
  user_id: string;
}

export interface GetMemberPaymentDetailResponse {
  getMemberPaymentDetail: MemberPaymentDetail;
}
