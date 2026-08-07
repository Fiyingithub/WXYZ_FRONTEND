
import { combineReducers } from "@reduxjs/toolkit";

import productSlice from './Users/products/productSlice'
import categorySlice from './Users/products/categorySlice'
import cartSlice from './Users/cart/cartSlice'



export const rootReducer = combineReducers({
  getProduct: productSlice,
  getCategory: categorySlice,
  getCart: cartSlice
  
});