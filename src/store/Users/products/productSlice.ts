import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type { Product } from "../../../Types/Admin/product";



interface ProductTypes {
  listRecords: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductTypes = {
  listRecords: [],
  loading: false,
  error: null,
};

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    fetchProductStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchProductSuccess: (state, action: PayloadAction<Product[]>) => {
      state.loading = false;
      state.listRecords = action.payload;
    },
    fetchProductFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchProductFailure,fetchProductStart,fetchProductSuccess } = productSlice.actions;

export default productSlice.reducer;