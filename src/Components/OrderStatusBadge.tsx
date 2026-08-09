import type { OrderStatus } from "../Types/user/order/orderType";


const STYLES: Record<OrderStatus, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  CONFIRMED: "bg-blue-50 text-blue-700 border-blue-200",
  PROCESSING: "bg-indigo-50 text-indigo-700 border-indigo-200",
  DELIVERED: "bg-green-50 text-green-700 border-green-200",
  CANCELLED: "bg-red-50 text-red-700 border-red-200",
};

export const OrderStatusBadge: React.FC<{ status: OrderStatus }> = ({ status }) => (
  <span
    className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full border ${STYLES[status]}`}
  >
    {status}
  </span>
);