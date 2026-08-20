export type SupportedCurrency = "NGN" | "USD" | "GBP" | "GHS" | "KES" | "ZAR";

export type PaymentProvider = "stripe" | "flutterwave" | "paystack";
export interface PaymentOrderSummary {
  id: string;
  orderNumber: string;
  userId: string;
  status: string;
  totalAmount: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  orderId: string;
  status: "PENDING" | "SUCCESS" | "FAILED"; // SUCCESS/FAILED assumed — confirm once verify response is shared
  reference: string;
  createdAt: string;
  updatedAt: string;
  order: PaymentOrderSummary;
}

export interface InitializePaymentInput {
  email: string;
  orderId: string;
}

export interface InitializePaymentResponse {
  payment: Payment;
  reference: string;
  authorizationUrl: string;
  accessCode: string;
  amount: number;
  amountInKobo: number;
  currency: string;
}