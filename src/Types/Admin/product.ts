

// type ApiStatus = "ACTIVE" | "DRAFT" | string;

type PublishStatus = "published" | "draft" | string;

export interface ProductImage {
  id: string;
  url: string;
  productId?: string;
}

export interface Product {
  id: string;
  name: string;
  images: ProductImage[];
  image?: string;
  categoryId: string;
  categoryName: string;
  quantity: number;
  price: number;
  inStock: boolean;
  publishStatus: PublishStatus;
  createdAt: string;
  updatedAt?: string;
  description?: string | null;
  tags?: string[];
  weight?: number;
  discount?: number;
}
