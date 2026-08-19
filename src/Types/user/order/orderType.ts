export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED";

export interface OrderItemInput {
  productId: string;
  quantity: number;
}

export interface CreateOrderInput {
  userId: string;
  items: OrderItemInput[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: string;
  product: {
    id: string;
    name: string;
    description: string;
    price: string;
    quantity: number;
    status: string;
    categoryId: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface OrderPayment {
  id: string;
  orderId: string;
  status: PaymentStatus;
  reference: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderUser {
  id: string;
  email: string;
  username: string;
  name: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  status: OrderStatus;
  totalAmount: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  payment: OrderPayment | null;
  user?: OrderUser;
}