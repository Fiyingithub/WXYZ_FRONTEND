export interface CartProduct {
  id: string;
  name: string;
  description: string;
  price: string; // API returns price as string
  quantity: number; // Available stock
  status: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  images: {
    id: string;
    url: string;
  }[];
}

export interface CartLineItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  product: CartProduct;
}

export interface CartResponse {
  id: string;
  userId: string;
  items: CartLineItem[];
}

export interface CartState {
  cart: CartResponse | null;
  loading: boolean;
  error: string | null;
  totalItems: number;
  subtotal: number;
}