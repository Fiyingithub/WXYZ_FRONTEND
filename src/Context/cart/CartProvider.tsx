// ============================================
// 1. CART CONTEXT / SERVICE (cartContext.tsx)
// ============================================
import React, { useReducer, useEffect } from "react";
import type { CartAction, CartItem, CartState } from "./cart-types";
import { CartContext } from "./cartContext";



const initialState: CartState = {
  items: [],
  totalItems: 0,
  subtotal: 0,
  discount: 0,
  shipping: 0,
  tax: 0,
  total: 0,
};

const calculateTotals = (items: CartItem[], discount: number = 0) => {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const shipping = subtotal > 50000 ? 0 : 2500;
  const tax = subtotal * 0.075; // 7.5% VAT (Nigeria)
  const total = subtotal + shipping + tax - discount;

  return { subtotal, totalItems, shipping, tax, total };
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find(
        (item) => item.productId === action.payload.productId,
      );
      let updatedItems;

      if (existingItem) {
        updatedItems = state.items.map((item) =>
          item.productId === action.payload.productId
            ? {
                ...item,
                quantity: Math.min(
                  item.quantity + action.payload.quantity,
                  item.maxStock,
                ),
              }
            : item,
        );
      } else {
        updatedItems = [...state.items, action.payload];
      }

      const totals = calculateTotals(updatedItems, state.discount);
      return {
        ...state,
        items: updatedItems,
        ...totals,
      };
    }

    case "REMOVE_ITEM": {
      const updatedItems = state.items.filter(
        (item) => item.id !== action.payload,
      );
      const totals = calculateTotals(updatedItems, state.discount);
      return {
        ...state,
        items: updatedItems,
        ...totals,
      };
    }

    case "UPDATE_QUANTITY": {
      const updatedItems = state.items.map((item) =>
        item.id === action.payload.id
          ? {
              ...item,
              quantity: Math.min(
                Math.max(1, action.payload.quantity),
                item.maxStock,
              ),
            }
          : item,
      );
      const totals = calculateTotals(updatedItems, state.discount);
      return {
        ...state,
        items: updatedItems,
        ...totals,
      };
    }

    case "CLEAR_CART":
      return { ...initialState, items: [] };

    case "APPLY_DISCOUNT": {
      const totals = calculateTotals(state.items, action.payload);
      return {
        ...state,
        discount: action.payload,
        ...totals,
      };
    }

    default:
      return state;
  }
};


export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      const parsed = JSON.parse(savedCart);
      parsed.items.forEach((item: CartItem) => {
        dispatch({ type: "ADD_ITEM", payload: item });
      });
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state));
  }, [state]);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};
