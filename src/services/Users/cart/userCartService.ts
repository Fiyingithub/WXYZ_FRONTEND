import api from "../../api";

export const userCartService = {
  getCartByUserId: async () => {
    try {
      const res = await api.get("/cart");
      return res.data.data;
    } catch (error: any) {
      throw error;
    }
  },

  addTocart: async (productId: string, quantity: number) => {
    try {
      const res = await api.post(`/cart`, { productId, quantity });
      return res.data.data; // { id, cartId, productId, quantity } — no product, no items
    } catch (error: any) {
      throw error;
    }
  },

  updateQuantity: async (productId: string, quantity: number) => {
    try {
      const res = await api.patch(`/cart`, { productId, quantity });
      return res.data.data;
    } catch (error: any) {
      throw error;
    }
  },

  removeItem: async (productId: string) => {
    try {
      const res = await api.delete(`/cart/${productId}`);
      return res.data.data;
    } catch (error: any) {
      throw error;
    }
  },

  clearCart: async () => {
    try {
      const res = await api.delete(`/cart`);
      return res.data.data;
    } catch (error: any) {
      throw error;
    }
  },
};