export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "DELIVERED"
  | "CANCELLED";

export interface OrderItemInput {
  productId: string;
  quantity: number;
}

export interface CreateOrderInput {
  userId: string | undefined;
  items: OrderItemInput[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: string; // naira, as a string — matches product.price convention
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

interface User {
  email: string;
  username: string;
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  role: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  status: OrderStatus;
  totalAmount: string; // naira, as a string
  createdAt: string;
  items: OrderItem[];
  user: User;
  payment: unknown | null; // shape unknown — payment endpoint not confirmed yet
}