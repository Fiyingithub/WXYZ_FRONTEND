import { useState } from "react";
import { FaCheck, FaChevronDown, FaSpinner } from "react-icons/fa";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store/store";
import { getOrdersAction, updateOrderStatusAction } from "../../store/Users/order/orderAction";
import Pagination from "../../Components/Pagination";
import type { Order, OrderStatus } from "../../Types/user/order/orderType";

interface AdminOrderTableProps {
  orders: Order[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

const STATUS_OPTIONS: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "DELIVERED",
  "CANCELLED",
];

const statusStyles: Record<OrderStatus, { bg: string; text: string; dot: string; ring: string }> = {
  PENDING: { bg: "bg-amber-50", text: "text-amber-600", dot: "bg-amber-500", ring: "ring-amber-200" },
  CONFIRMED: { bg: "bg-indigo-50", text: "text-indigo-600", dot: "bg-indigo-500", ring: "ring-indigo-200" },
  PROCESSING: { bg: "bg-teal-50", text: "text-teal-600", dot: "bg-teal-500", ring: "ring-teal-200" },
  DELIVERED: { bg: "bg-emerald-50", text: "text-emerald-600", dot: "bg-emerald-500", ring: "ring-emerald-200" },
  CANCELLED: { bg: "bg-rose-50", text: "text-rose-600", dot: "bg-rose-500", ring: "ring-rose-200" },
};

const getHue = (seed: string) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  return Math.abs(hash) % 360;
};

const formatAmount = (amount: string | number) =>
  `₦${Number(amount).toLocaleString("en-NG")}`;

const formatProducts = (order: Order) => {
  const names = order.items.map((item: any) => item.product.name);
  if (names.length <= 2) return names.join(", ");
  return `${names.slice(0, 2).join(", ")} +${names.length - 2} more`;
};

const Avatar = ({ seed }: { seed: string }) => (
  <div
    className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0 shadow-sm ring-2 ring-white"
    style={{
      background: `linear-gradient(135deg, hsl(${getHue(seed)}, 70%, 58%), hsl(${(getHue(seed) + 40) % 360}, 70%, 48%))`,
    }}
  >
    {seed.slice(0, 2).toUpperCase()}
  </div>
);

const AdminOrderTable = ({
  orders,
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}: AdminOrderTableProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [errorId, setErrorId] = useState<string | null>(null);
  const [justUpdatedId, setJustUpdatedId] = useState<string | null>(null);

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    setUpdatingId(orderId);
    setErrorId(null);
    try {
      await dispatch(updateOrderStatusAction(orderId, status));
      // Refetch the latest orders so the table reflects the source of truth
      await dispatch(getOrdersAction());
      setJustUpdatedId(orderId);
      setTimeout(() => setJustUpdatedId((id) => (id === orderId ? null : id)), 1500);
    } catch (err) {
      setErrorId(orderId);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-[0_2px_20px_-4px_rgba(0,0,0,0.06)] ring-1 ring-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-separate border-spacing-0">
          <thead>
            <tr className="bg-linear-to-r from-gray-50 to-gray-50/60 text-gray-500 uppercase text-[11px] tracking-wider">
              <th className="px-6 py-4 font-semibold">Customer</th>
              <th className="px-6 py-4 font-semibold">Products</th>
              <th className="px-6 py-4 font-semibold">Order Number</th>
              <th className="px-6 py-4 font-semibold">Date</th>
              <th className="px-6 py-4 font-semibold">Total Amount</th>
              <th className="px-6 py-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => {
              const customerLabel = order.user?.username ?? order.user?.email ?? order.userId;
              const isUpdating = updatingId === order.id;
              const justUpdated = justUpdatedId === order.id;
              const style = statusStyles[order.status];

              return (
                <tr
                  key={order.id}
                  className={`transition-colors duration-300 ${
                    isUpdating ? "bg-[#f2592b]/3" : "hover:bg-gray-50/80"
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar seed={customerLabel} />
                      <div>
                        <span className="font-medium text-gray-800 block">
                          {order.user?.username ?? "—"}
                        </span>
                        {order.user?.email && (
                          <span className="text-xs text-gray-400">{order.user.email}</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700 max-w-xs">
                    {formatProducts(order)}
                  </td>
                  <td className="px-6 py-4 text-gray-500 whitespace-nowrap font-mono text-xs">
                    {order.orderNumber}
                  </td>
                  <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                    {new Date(order.createdAt).toLocaleDateString("en-NG", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4 text-gray-800 font-semibold whitespace-nowrap">
                    {formatAmount(order.totalAmount)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1.5">
                      <div className="relative inline-flex items-center">
                        <span
                          className={`pointer-events-none absolute left-2.5 w-1.5 h-1.5 rounded-full ${style.dot} ${
                            isUpdating ? "animate-pulse" : ""
                          }`}
                        />
                        <select
                          value={order.status}
                          disabled={isUpdating}
                          onChange={(e) =>
                            handleStatusChange(order.id, e.target.value as OrderStatus)
                          }
                          className={`appearance-none text-xs font-semibold rounded-full pl-6 pr-8 py-1.5 ring-1 ${style.ring} ${style.bg} ${style.text} focus:outline-none focus:ring-2 focus:ring-[#f2592b]/40 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer transition-all duration-200`}
                        >
                          {STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status} className="text-gray-700 bg-white">
                              {status}
                            </option>
                          ))}
                        </select>

                        <span className="pointer-events-none absolute right-2.5 text-[10px]">
                          {isUpdating ? (
                            <FaSpinner className={`animate-spin ${style.text}`} />
                          ) : justUpdated ? (
                            <FaCheck className="text-emerald-500" />
                          ) : (
                            <FaChevronDown className="text-gray-400" />
                          )}
                        </span>
                      </div>

                      {isUpdating && (
                        <span className="text-[11px] text-gray-400 flex items-center gap-1">
                          <span className="inline-block w-1 h-1 rounded-full bg-gray-300 animate-ping" />
                          Updating status...
                        </span>
                      )}
                      {errorId === order.id && (
                        <span className="text-[11px] text-red-500">Update failed, try again</span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}

            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center text-gray-400">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-sm">No orders match your search.</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default AdminOrderTable;