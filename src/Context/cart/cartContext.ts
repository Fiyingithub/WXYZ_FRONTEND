import { createContext } from 'react';
import type { CartAction, CartState } from './cart-types';

export const CartContext = createContext<{ state: CartState; dispatch: React.Dispatch<CartAction> } | undefined>(undefined);