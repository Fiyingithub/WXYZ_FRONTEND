import type { CreateOrderInput, Order, OrderStatus } from "../../../Types/user/order/orderType";
import api from "../../api";


const BASE_PATH = "/order";

export const userOrderService = {
  create: async (input: CreateOrderInput): Promise<Order> => {
    try {
      const res = await api.post(BASE_PATH, input);
      return res.data.data;
    } catch (error: any) {
      throw error;
    }
  },

  // Same endpoint for customer and admin — the backend scopes the result
  // by the requester's role, so no separate admin path is needed.
  getAll: async (): Promise<Order[]> => {
    try {
      const res = await api.get(BASE_PATH);
      return res.data.data;
    } catch (error: any) {
      throw error;
    }
  },

  getById: async (orderId: string): Promise<Order> => {
    try {
      const res = await api.get(`${BASE_PATH}/${orderId}`);
      return res.data.data;
    } catch (error: any) {
      throw error;
    }
  },

  updateStatus: async (orderId: string, status: OrderStatus): Promise<Order> => {
    try {
      const res = await api.patch(`${BASE_PATH}/${orderId}`, { status });
      return res.data.data;
    } catch (error: any) {
      throw error;
    }
  },
};