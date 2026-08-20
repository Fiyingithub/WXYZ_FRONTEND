import type { InitializePaymentInput, InitializePaymentResponse } from "../../../Types/Payment";
import api from "../../api";


const BASE_PATH = "/payment";

export const userPaymentService = {
  initialize: async (
    input: InitializePaymentInput,
  ): Promise<InitializePaymentResponse> => {
    try {
      const res = await api.post(BASE_PATH, input);
      return res.data.data;
    } catch (error: any) {
      throw error;
    }
  },

  // STUB — endpoint not yet confirmed. VerifyPayment.tsx has this call
  // commented out; update path/response shape once you share it.
  verify: async (reference: string) => {
    try {
      const res = await api.get(`${BASE_PATH}/verify/${reference}`);
      return res.data;
    } catch (error: any) {
      throw error;
    }
  },
};