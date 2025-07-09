import { gql } from "@apollo/client";

export const GET_PAYMENT_BY_ID = gql`
  query GetPaymentById($id: String!) {
    getPaymentById(id: $id) {
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

export interface PaymentTransaction {
  id: string;
  gateway: string;
  transactionDate: string;
  amountIn: number;
  amountOut: number;
}

export interface GetPaymentByIdResponse {
  getPaymentById: {
    id: string;
    user_id: string;
    subscription_id: string;
    content: string;
    status: string;
    price: number;
    payment_transaction?: PaymentTransaction;
  };
} 