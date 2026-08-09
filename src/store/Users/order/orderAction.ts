import type { AppDispatch } from "../../store";
import { userOrderService } from "../../../services/Users/order/userOrderService";
import { fetchOrdersStart,fetchOrdersSuccess,fetchOrdersFailure,upsertOrder } from "./orderSlice";
import type { CreateOrderInput, OrderStatus } from "../../../Types/user/order/orderType";


export const createOrderAction = (input: CreateOrderInput) => async () => {
      return userOrderService.create(input);
};

export const getOrdersAction = () => async (dispatch: AppDispatch) => {
      dispatch(fetchOrdersStart());
      try {
            const orders = await userOrderService.getAll();
            dispatch(fetchOrdersSuccess(orders));
      } catch (error: any) {
            dispatch(fetchOrdersFailure(error.message));
      }
};

export const updateOrderStatusAction = (orderId: string, status: OrderStatus) => async (dispatch: AppDispatch) => {
      try {
            const order = await userOrderService.updateStatus(orderId, status);
            dispatch(upsertOrder(order));
            return order;
      } catch (error: any) {
            throw error;
      }
};