// src/services/Admin/product/productService.ts
import api from '../../api';
import type { Product } from '../../../Types/Admin/product';

export const userProductService = {

  getAll: async () => {
    try {
      const res = await api.get('/product');
      return res.data.data;
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || String(error);
      console.error('Get products error:', msg);
      throw error;
    }
  },
  getAllActiveProduct: async () => {
    try {
      const res = await api.get('/product/active');
      return res.data.data;
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || String(error);
      console.error('Get products error:', msg);
      throw error;
    }
  },

  getById: async (id: string) => {
    try {
      const res = await api.get(`/product/${id}`);
      return res.data;
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || String(error);
      console.error(`Get product ${id} error:`, msg);
      throw error;
    }
  },

  getByCategoryId: async (id: string) => {
    try {
      const res = await api.get(`/product/category/${id}`);
      // console.log(res.data);
      return res.data;
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || String(error);
      console.error(`Get product by category ${id} error:`, msg);
      throw error;
    }
  },

  // Update accepts multipart form data for product edits
  update: async (id: string, data: Product | FormData) => {
    try {
      const res = await api.patch(`/product/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || String(error);
      console.error(`Update product ${id} error:`, msg);
      throw error;
    }
  },

  // Separate method for status updates if needed
  updateStatus: async (id: string, status: string) => {
    try {
      const res = await api.patch(`/product/${id}`, { status });
      return res.data;
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || String(error);
      console.error(`Update status for product ${id} error:`, msg);
      throw error;
    }
  },

  delete: async (id: string) => {
    try {
      const res = await api.delete(`/product/${id}`);
      return res.data;
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || String(error);
      console.error(`Delete product ${id} error:`, msg);
      throw error;
    }
  },
};