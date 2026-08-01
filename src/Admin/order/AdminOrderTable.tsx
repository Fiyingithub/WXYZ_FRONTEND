import type { Order, OrderStatus } from "./AdminOrder";
import Pagination from "../../Components/Pagination";

interface AdminOrderTableProps {
  orders: Order[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

const statusLabels: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  ready_for_pickup: "Ready for Pickup",
  picked_up: "Picked up",
  delivered: "Delivered",
  rejected: "Rejected",
  canceled: "Canceled",
};

const statusColors: Record<OrderStatus, string> = {
  pending: "text-amber-500",
  confirmed: "text-indigo-500",
  ready_for_pickup: "text-teal-600",
  picked_up: "text-emerald-600",
  delivered: "text-gray-700",
  rejected: "text-rose-500",
  canceled: "text-rose-600",
};

const getHue = (seed: string) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  return Math.abs(hash) % 360;
};

const formatAmount = (amount: number) => `₦${amount.toLocaleString("en-NG")}`;

const Avatar = ({ seed }: { seed: string }) => (
  <div
    className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0"
    style={{ backgroundColor: `hsl(${getHue(seed)}, 65%, 55%)` }}
  >
    {seed.slice(0, 2).toUpperCase()}
  </div>
);

const AdminOrderTable = ({ orders, currentPage, totalPages, totalItems, pageSize, onPageChange }: AdminOrderTableProps) => {
  return (
    <div className="w-full bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wide">
              <th className="px-6 py-4 font-semibold">Customer Name</th>
              <th className="px-6 py-4 font-semibold">Product Type</th>
              <th className="px-6 py-4 font-semibold">Order ID</th>
              <th className="px-6 py-4 font-semibold">Date</th>
              <th className="px-6 py-4 font-semibold">Total Amount</th>
              <th className="px-6 py-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar seed={order.customerName} />
                    <span className="font-medium text-gray-800">{order.customerName}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar seed={order.productType} />
                    <span className="text-gray-700">{order.productType}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-500">{order.orderId}</td>
                <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{order.date}</td>
                <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{formatAmount(order.totalAmount)}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-semibold ${statusColors[order.status]}`}>
                    {statusLabels[order.status]}
                  </span>
                </td>
              </tr>
            ))}

            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                  No orders match your search.
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