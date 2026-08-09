import type { AddressInput } from "../../../Types/user/address/addressType";
import api from "../../api";



const BASE_PATH = "/address";

export const userAddressService = {
      getAll: async () => {
            try {
                  const res = await api.get(BASE_PATH);
                  return res.data.data;
            } catch (error: any) {
                  throw error;
            }
      },

      create: async (input: AddressInput) => {
            try {
                  const res = await api.post(BASE_PATH, input);
                  return res.data.data;
            } catch (error: any) {
                  throw error;
            }
      },

      update: async (id: string, input: AddressInput) => {
            try {
                  const res = await api.patch(`${BASE_PATH}/${id}`, input);
                  return res.data.data;
            } catch (error: any) {
                  throw error;
            }
      },

      remove: async (id: string) => {
            try {
                  const res = await api.delete(`${BASE_PATH}/${id}`);
                  // Response shape for delete wasn't confirmed — return whatever's
                  // there (may be undefined) rather than assume a shape.
                  return res.data?.data;
            } catch (error: any) {
                  throw error;
            }
      },
};