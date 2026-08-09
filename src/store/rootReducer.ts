
import { combineReducers } from "@reduxjs/toolkit";

import productSlice from './Users/products/productSlice'
import categorySlice from './Users/products/categorySlice'
import cartSlice from './Users/cart/cartSlice'
import addressSlice from './Users/address/addressSlice'
import orderSlice from './Users/order/orderSlice'



export const rootReducer = combineReducers({
  getProduct: productSlice,
  getCategory: categorySlice,
  getCart: cartSlice,
  getAddress: addressSlice,
  getOrder: orderSlice,
  
});