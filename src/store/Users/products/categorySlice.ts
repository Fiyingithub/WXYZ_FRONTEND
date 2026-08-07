import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type { cateogryType } from "../../../Types/Admin/categoryType";




interface CategoryTypes {
  listRecords: cateogryType[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoryTypes = {
  listRecords: [],
  loading: false,
  error: null,
};

export const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    fetchCategoryStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchCategorySuccess: (state, action: PayloadAction<cateogryType[]>) => {
      state.loading = false;
      state.listRecords = action.payload;
    },
    fetchCategoryFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchCategoryFailure,fetchCategoryStart,fetchCategorySuccess } = categorySlice.actions;

export default categorySlice.reducer;