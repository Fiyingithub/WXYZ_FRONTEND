import { useEffect, useMemo, useState } from "react";
import { FaChevronDown, FaDownload, FaSearch } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { getOrdersAction } from "../../store/Users/order/orderAction";
import AdminOrderTable from "./AdminOrderTable";
import type { OrderStatus } from "../../Types/user/order/orderType";

const statusOptions: { label: string; value: OrderStatus | "all" }[] = [
  { label: "All Status", value: "all" },
  { label: "Pending", value: "PENDING" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Processing", value: "PROCESSING" },
  { label: "Delivered", value: "DELIVERED" },
  { label: "Cancelled", value: "CANCELLED" },
];

const AdminOrder = () => {
  const dispatch = useDispatch<AppDispatch>();
  const orders = useSelector((state: RootState) => state.getOrder.orders);
  const loading = useSelector((state: RootState) => state.getOrder.loading);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    dispatch(getOrdersAction());
  }, [dispatch]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      const query = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !query ||
        order.user?.username?.toLowerCase().includes(query) ||
        order.user?.email?.toLowerCase().includes(query) ||
        order.orderNumber.toLowerCase().includes(query) ||
        order.items.some((item) => item.product.name.toLowerCase().includes(query));
      return matchesStatus && matchesSearch;
    });
  }, [orders, searchTerm, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const goToPage = (page: number) => {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
  };

  const orderCounts = useMemo(() => {
    return statusOptions.reduce<Record<string, number>>((acc, opt) => {
      acc[opt.value] =
        opt.value === "all" ? orders.length : orders.filter((o) => o.status === opt.value).length;
      return acc;
    }, {});
  }, [orders]);

  const handleExport = () => {
    const header = ["Customer", "Products", "Order Number", "Date", "Total Amount", "Status"];
    const rows = filteredOrders.map((o) => [
      o.user?.email ?? o.userId,
      o.items.map((item) => `${item.product.name} x${item.quantity}`).join("; "),
      o.orderNumber,
      new Date(o.createdAt).toLocaleString("en-NG"),
      o.totalAmount,
      o.status,
    ]);
    const csv = [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "orders.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full min-h-screen bg-linear-to-b from-gray-50 to-white py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Orders</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          {orders.length} total · {orderCounts.PENDING ?? 0} pending
        </p>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div className="relative w-full lg:w-80">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search for orders, products, customers..."
            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-200 bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#f2592b]/40 focus:border-[#f2592b] transition-shadow"
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
              className="appearance-none pl-4 pr-9 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#f2592b]/40 focus:border-[#f2592b] cursor-pointer"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label} {opt.value !== "all" ? `(${orderCounts[opt.value] ?? 0})` : ""}
                </option>
              ))}
            </select>
            <FaChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400" />
          </div>

          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-linear-to-r from-[#f2592b] to-[#f2762b] text-sm font-medium text-white shadow-sm hover:shadow-md hover:brightness-105 active:scale-[0.98] transition-all"
          >
            <FaDownload className="text-xs" />
            Export
          </button>
        </div>
      </div>

      {loading && orders.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 py-16 text-center text-gray-400">
          <div className="flex flex-col items-center gap-3">
            <svg
              className="animate-spin h-6 w-6 text-[#f2592b]"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            Loading orders...
          </div>
        </div>
      ) : (
        <AdminOrderTable
          orders={paginatedOrders}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredOrders.length}
          pageSize={pageSize}
          onPageChange={goToPage}
        />
      )}
    </div>
  );
};

export default AdminOrder;