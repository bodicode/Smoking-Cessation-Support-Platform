import { gql } from "@apollo/client";

export const CREATE_PAYMENT = gql`
  mutation CreatePayment($input: CreatePaymentInput!) {
    createPayment(input: $input) {
      id
      user_id
      subscription_id
      content
      status
      price
      payment_transaction {
        id
        gateway
        transactionDate
        amountIn
        amountOut
      }
    }
  }
`;

export interface CreatePaymentInput {
  user_id: string;
  membership_package_id: string;
}

export interface CreatePaymentResponse {
  createPayment: {
    id: string;
    user_id: string;
    subscription_id: string;
    content: string;
    status: string;
    price: number;
    payment_transaction?: {
      id: string;
      gateway: string;
      transactionDate: string;
      amountIn: number;
      amountOut: number;
    };
  };
} 