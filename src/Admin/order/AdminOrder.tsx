import { useMemo, useState } from "react";
import { FaChevronDown, FaDownload, FaSearch } from "react-icons/fa";
import AdminOrderTable from "./AdminOrderTable";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "ready_for_pickup"
  | "picked_up"
  | "delivered"
  | "rejected"
  | "canceled";

export interface Order {
  id: string;
  customerName: string;
  productType: string;
  orderId: string;
  date: string;
  totalAmount: number;
  status: OrderStatus;
}

const statusOptions: { label: string; value: OrderStatus | "all" }[] = [
  { label: "All Status", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Ready for Pickup", value: "ready_for_pickup" },
  { label: "Picked up", value: "picked_up" },
  { label: "Delivered", value: "delivered" },
  { label: "Rejected", value: "rejected" },
  { label: "Canceled", value: "canceled" },
];

const mockOrders: Order[] = [
  { id: "1", customerName: "David John", productType: "MacBook Pro, 2", orderId: "#GGH78", date: "04/17/23 at 8:25 PM", totalAmount: 286000, status: "pending" },
  { id: "2", customerName: "David John", productType: "Wrist watch", orderId: "#GGH78", date: "04/17/23 at 8:25 PM", totalAmount: 286000, status: "confirmed" },
  { id: "3", customerName: "David John", productType: "Portable Speaker", orderId: "#GGH78", date: "04/17/23 at 8:25 PM", totalAmount: 286000, status: "ready_for_pickup" },
  { id: "4", customerName: "David John", productType: "Wrist watch", orderId: "#GGH78", date: "04/17/23 at 8:25 PM", totalAmount: 286000, status: "picked_up" },
  { id: "5", customerName: "David John", productType: "MacBook Pro", orderId: "#GGH78", date: "04/17/23 at 8:25 PM", totalAmount: 286000, status: "rejected" },
  { id: "6", customerName: "David John", productType: "MacBook Pro", orderId: "#GGH78", date: "04/17/23 at 8:25 PM", totalAmount: 286000, status: "delivered" },
  { id: "7", customerName: "David John", productType: "Leather Wrist Watch", orderId: "#GGH78", date: "04/17/23 at 8:25 PM", totalAmount: 286000, status: "canceled" },
  { id: "8", customerName: "David John", productType: "Face Cap", orderId: "#GGH78", date: "04/17/23 at 8:25 PM", totalAmount: 286000, status: "pending" },
  { id: "9", customerName: "David John", productType: "MacBook Pro", orderId: "#GGH78", date: "04/17/23 at 8:25 PM", totalAmount: 286000, status: "pending" },
  { id: "10", customerName: "David John", productType: "Bluetooth Speaker", orderId: "#GGH78", date: "04/17/23 at 8:25 PM", totalAmount: 286000, status: "pending" },
];

const AdminOrder = () => {
  const [orders] = useState<Order[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      const query = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !query ||
        order.customerName.toLowerCase().includes(query) ||
        order.productType.toLowerCase().includes(query) ||
        order.orderId.toLowerCase().includes(query);
      return matchesStatus && matchesSearch;
    });
  }, [orders, searchTerm, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const goToPage = (page: number) => {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
  };

  const handleExport = () => {
    const header = ["Customer Name", "Product Type", "Order ID", "Date", "Total Amount", "Status"];
    const rows = filteredOrders.map((o) => [o.customerName, o.productType, o.orderId, o.date, o.totalAmount, o.status]);
    const csv = [header, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "orders.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 py-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div className="relative w-full lg:w-80">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search for orders, products..."
            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#f2592b]/40 focus:border-[#f2592b]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as OrderStatus | "all");
                setCurrentPage(1);
              }}
              className="appearance-none pl-4 pr-9 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#f2592b]/40 focus:border-[#f2592b] cursor-pointer"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <FaChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400" />
          </div>

          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <FaDownload className="text-xs" />
            Export
          </button>
        </div>
      </div>

      <AdminOrderTable
        orders={paginatedOrders}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredOrders.length}
        pageSize={pageSize}
        onPageChange={goToPage}
      />
    </div>
  );
};

export default AdminOrder;