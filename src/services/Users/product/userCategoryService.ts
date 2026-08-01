// src/services/Admin/category/categoryService.ts
import api from "../../api";
import type { cateogryType } from "../../../Types/Admin/categoryType";

export const userCategoryService = {
  getAll: async () => {
    try {
      const res = await api.get("/category");
      return res.data.data;
    } catch (error: any) {
      const msg =
        error?.response?.data?.message || error?.message || String(error);
      console.error("Get products error:", msg);
      throw error;
    }
  },

  getById: async (id: string) => {
    try {
      const res = await api.get(`/category/${id}`);
      return res.data;
    } catch (error: any) {
      const msg =
        error?.response?.data?.message || error?.message || String(error);
      console.error(`Get product ${id} error:`, msg);
      throw error;
    }
  },

  // Update accepts multipart form data for product edits
  update: async (id: string, data: cateogryType | FormData) => {
    try {
      const res = await api.patch(`/category/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (error: any) {
      const msg =
        error?.response?.data?.message || error?.message || String(error);
      console.error(`Update product ${id} error:`, msg);
      throw error;
    }
  },

  delete: async (id: string) => {
    try {
      const res = await api.delete(`/category/${id}`);
      return res.data;
    } catch (error: any) {
      const msg =
        error?.response?.data?.message || error?.message || String(error);
      console.error(`Delete product ${id} error:`, msg);
      throw error;
    }
  },
};
