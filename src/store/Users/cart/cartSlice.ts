import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CartLineItem, CartResponse, CartState } from "../../../Types/user/cartType";

const calculateTotals = (cart: CartResponse | null) => {
  if (!cart) {
    return {
      totalItems: 0,
      subtotal: 0,
    };
  }

  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = cart.items.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0,
  );

  return {
    totalItems,
    subtotal,
  };
};

const initialState: CartState = {
  cart: null,
  loading: false,
  error: null,
  totalItems: 0,
  subtotal: 0,
};

export const cartSlice = createSlice({
  name: "cart",

  initialState,

  reducers: {
    fetchCartStart(state) {
      state.loading = true;
      state.error = null;
    },

    fetchCartSuccess(state, action: PayloadAction<CartResponse>) {
      state.loading = false;
      state.cart = action.payload;
      state.error = null;

      const totals = calculateTotals(action.payload);

      state.totalItems = totals.totalItems;
      state.subtotal = totals.subtotal;
    },

    fetchCartFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    setCart(state, action: PayloadAction<CartResponse>) {
      state.loading = false;
      state.cart = action.payload;

      const totals = calculateTotals(action.payload);

      state.totalItems = totals.totalItems;
      state.subtotal = totals.subtotal;
    },

    updateCartItemQuantity(
      state,
      action: PayloadAction<{ productId: string; quantity: number }>,
    ) {
      if (!state.cart) return;

      const item = state.cart.items.find(
        (item) => item.productId === action.payload.productId,
      );

      if (item) {
        item.quantity = action.payload.quantity;

        const totals = calculateTotals(state.cart);

        state.totalItems = totals.totalItems;
        state.subtotal = totals.subtotal;
      }
    },

    removeCartItem(state, action: PayloadAction<string>) {
      if (!state.cart) return;

      state.cart.items = state.cart.items.filter(
        (item) => item.productId !== action.payload,
      );

      const totals = calculateTotals(state.cart);

      state.totalItems = totals.totalItems;
      state.subtotal = totals.subtotal;
    },

    clearCart(state) {
      if (!state.cart) return;

      state.cart.items = [];

      state.totalItems = 0;
      state.subtotal = 0;
    },

    // Upserts a line item using the SERVER's authoritative quantity
    // (the add-to-cart endpoint returns the merged total, not a delta),
    // so this sets rather than increments.
    upsertCartItem(state, action: PayloadAction<CartLineItem>) {
      state.loading = false;

      if (!state.cart) {
        state.cart = {
          id: action.payload.cartId,
          userId: "",
          items: [action.payload],
        } as CartResponse;
      } else {
        const existingIndex = state.cart.items.findIndex(
          (item) => item.productId === action.payload.productId,
        );

        if (existingIndex !== -1) {
          state.cart.items[existingIndex] = action.payload;
        } else {
          state.cart.items.push(action.payload);
        }
      }

      const totals = calculateTotals(state.cart);

      state.totalItems = totals.totalItems;
      state.subtotal = totals.subtotal;
    },

    resetCartState() {
      return initialState;
    },
  },
});

export const {
  fetchCartStart,
  fetchCartSuccess,
  fetchCartFailure,
  setCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
  upsertCartItem,
  resetCartState,
} = cartSlice.actions;

export default cartSlice.reducer;