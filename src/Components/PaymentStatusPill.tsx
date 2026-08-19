import { FaClock, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import type { Order } from "../Types/user/order/orderType";


export const PaymentStatusPill: React.FC<{ order: Order }> = ({ order }) => {
  if (!order.payment) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-full">
        <FaClock className="text-[10px]" /> No payment yet
      </span>
    );
  }

  if (order.payment.status === "SUCCESS") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">
        <FaCheckCircle className="text-[10px]" /> Paid
      </span>
    );
  }

  if (order.payment.status === "FAILED") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-red-700 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full">
        <FaExclamationCircle className="text-[10px]" /> Payment failed
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
      <FaClock className="text-[10px]" /> Payment pending
    </span>
  );
};