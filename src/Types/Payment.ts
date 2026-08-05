export type SupportedCurrency = "NGN" | "USD" | "GBP" | "GHS" | "KES" | "ZAR";

export type PaymentProvider = "stripe" | "flutterwave" | "paystack";

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  image: string;
  /** Decimal major-unit price (e.g. 12.99, not cents) in the item's home currency */
  price: number;
  quantity: number;
  variant?: string;
  maxQuantity?: number;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  country: string; // ISO 3166-1 alpha-2, e.g. "NG", "US", "GB"
  state: string;
  city: string;
  addressLine1: string;
  addressLine2?: string;
  postalCode: string;
}

export interface OrderSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  currency: SupportedCurrency;
}

export interface CreateOrderPayload {
  items: Pick<CartItem, "productId" | "quantity" | "variant">[];
  shipping: ShippingAddress;
  currency: SupportedCurrency;
  provider: PaymentProvider;
}

export interface CreateOrderResponse {
  orderId: string;
  reference: string;
  summary: OrderSummary;
}

export interface PaymentInitPayload {
  orderId: string;
  reference: string;
  amount: number;
  currency: SupportedCurrency;
  email: string;
  provider: PaymentProvider;
}

export interface PaymentVerifyPayload {
  orderId: string;
  reference: string;
  provider: PaymentProvider;
}

export type PaymentStatus = "idle" | "processing" | "success" | "failed";