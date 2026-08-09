import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Order } from "../../../Types/user/order/orderType";


interface OrderState {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  loading: false,
  error: null,
};

export const orderSlice = createSlice({
  name: "order",
  initialState,

      reducers: {
            fetchOrdersStart(state) {
                  state.loading = true;
                  state.error = null;
            },

            fetchOrdersSuccess(state, action: PayloadAction<Order[]>) {
                  state.loading = false;
                  // newest first — createdAt is an ISO string, so lexical sort works
                  state.orders = [...action.payload].sort((a, b) =>
                  b.createdAt.localeCompare(a.createdAt),
                  );
            },

            fetchOrdersFailure(state, action: PayloadAction<string>) {
                  state.loading = false;
                  state.error = action.payload;
            },

            upsertOrder(state, action: PayloadAction<Order>) {
                  const index = state.orders.findIndex((o) => o.id === action.payload.id);
                  if (index !== -1) {
                        state.orders[index] = action.payload;
                  } else {
                        state.orders.unshift(action.payload);
                  }
            },
      },
});

export const { fetchOrdersStart,fetchOrdersSuccess,fetchOrdersFailure,upsertOrder } = orderSlice.actions;

export default orderSlice.reducer;