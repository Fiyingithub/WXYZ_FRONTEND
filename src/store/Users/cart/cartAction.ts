import type { AppDispatch } from "../../store";
import { userCartService } from "../../../services/Users/cart/userCartService";
import {
  fetchCartFailure,
  fetchCartStart,
  fetchCartSuccess,
  setCart,
  upsertCartItem,
} from "./cartSlice";
import type { Product } from "../../../Types/Admin/product";
import type { CartLineItem, CartProduct } from "../../../Types/user/cartType";

export const getCartAction = () => async (dispatch: AppDispatch) => {
  dispatch(fetchCartStart());

  try {
    const cart = await userCartService.getCartByUserId();
    dispatch(fetchCartSuccess(cart));
  } catch (error: any) {
    dispatch(fetchCartFailure(error.message));
  }
};

// Maps the Admin/product-list `Product` shape into the narrower
// `CartProduct` shape the cart slice expects (e.g. images without
// productId). Keeps the two type worlds decoupled.
const toCartProduct = (product: Product): CartProduct => ({
  id: product.id,
  name: product.name,
  description: product.description ?? "",
  price: String(product.price),
  quantity: product.quantity,
  status: product.status, // ❌ still errors — see below
  categoryId: product.categoryId,
  createdAt: product.createdAt,
  updatedAt: product.updatedAt ?? product.createdAt,
  images: product.images.map((img) => ({ id: img.id, url: img.url })),
});

// `product` is the full product object already available in the caller
// (e.g. from the product list/detail page) — the add-to-cart endpoint
// only returns { id, cartId, productId, quantity }, no product details,
// so we stitch them together locally instead of refetching the whole cart.
export const addProductToCartAction =
  (product: Product, quantity: number) => async (dispatch: AppDispatch) => {
    dispatch(fetchCartStart());

    try {
      const item = await userCartService.addTocart(product.id, quantity);

      const lineItem: CartLineItem = {
        id: item.id,
        cartId: item.cartId,
        productId: item.productId,
        quantity: item.quantity,
        product: toCartProduct(product),
      };

      dispatch(upsertCartItem(lineItem));

      return lineItem;
    } catch (error: any) {
      dispatch(fetchCartFailure(error.message));
      throw error;
    }
  };

export const updateCartQuantityAction =
  (productId: string, quantity: number, product: CartProduct) =>
  async (dispatch: AppDispatch) => {
    dispatch(fetchCartStart());

    try {
      const item = await userCartService.updateQuantity(productId, quantity);

      const lineItem: CartLineItem = {
        id: item.id,
        cartId: item.cartId,
        productId: item.productId,
        quantity: item.quantity,
        product,
      };

      dispatch(upsertCartItem(lineItem));

      return lineItem;
    } catch (error: any) {
      dispatch(fetchCartFailure(error.message));
      throw error;
    }
  };


export const removeCartProductAction =
  (productId: string) => async (dispatch: AppDispatch) => {
    dispatch(fetchCartStart());

    try {
      const cart = await userCartService.removeItem(productId);
      dispatch(setCart(cart));
      return cart;
    } catch (error: any) {
      dispatch(fetchCartFailure(error.message));
      throw error;
    }
  };

export const clearUserCartAction = () => async (dispatch: AppDispatch) => {
  dispatch(fetchCartStart());

  try {
    const cart = await userCartService.clearCart();
    dispatch(setCart(cart ?? { id: "", userId: "", items: [] }));
    return cart;
  } catch (error: any) {
    dispatch(fetchCartFailure(error.message));
    throw error;
  }
};