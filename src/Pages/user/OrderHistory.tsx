import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaBoxOpen,
  FaSearch,
  FaShoppingBag,
  FaWallet,
  FaClock,
  FaChevronRight,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { getOrdersAction } from "../../store/Users/order/orderAction";
import { OrderStatusBadge } from "../../Components/OrderStatusBadge";
import { PaymentStatusPill } from "../../Components/PaymentStatusPill";
import Pagination from "../../Components/Pagination";
import type { OrderStatus } from "../../Types/user/order/orderType";


const FILTERS: { label: string; value: OrderStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "PENDING" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Processing", value: "PROCESSING" },
  { label: "Delivered", value: "DELIVERED" },
  { label: "Cancelled", value: "CANCELLED" },
];

const PAGE_SIZE = 5;

const OrderHistory = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const orders = useSelector((state: RootState) => state.getOrder.orders);
  const loading = useSelector((state: RootState) => state.getOrder.loading);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(getOrdersAction());
  }, [dispatch]);

  const stats = useMemo(() => {
    const totalSpent = orders
      .filter((o) => o.payment?.status === "SUCCESS")
      .reduce((sum, o) => sum + Number(o.totalAmount), 0);

    const pendingPayments = orders.filter(
      (o) => !o.payment || o.payment.status === "PENDING",
    ).length;

    return { totalOrders: orders.length, totalSpent, pendingPayments };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      const query = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !query ||
        order.orderNumber.toLowerCase().includes(query) ||
        order.items.some((item) => item.product.name.toLowerCase().includes(query));
      return matchesStatus && matchesSearch;
    });
  }, [orders, searchTerm, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const goToPage = (page: number) => {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-[#f2592b] transition-colors mb-6 text-sm"
        >
          <FaArrowLeft /> Back
        </button>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">My Orders</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-[#f2592b]/10 flex items-center justify-center shrink-0">
              <FaShoppingBag className="text-[#f2592b]" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Total Orders</p>
              <p className="text-xl font-bold text-gray-900">{stats.totalOrders}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
              <FaWallet className="text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Total Spent</p>
              <p className="text-xl font-bold text-gray-900">
                ₦{stats.totalSpent.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
              <FaClock className="text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Awaiting Payment</p>
              <p className="text-xl font-bold text-gray-900">{stats.pendingPayments}</p>
            </div>
          </div>
        </div>

        {/* Search + filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by order number or product..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#f2592b]/40 focus:border-[#f2592b]"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => {
                  setStatusFilter(f.value);
                  setCurrentPage(1);
                }}
                className={`whitespace-nowrap text-xs font-medium px-3.5 py-2 rounded-full border transition-colors ${
                  statusFilter === f.value
                    ? "bg-[#f2592b] text-white border-[#f2592b]"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {loading && orders.length === 0 ? (
          <p className="text-gray-400 text-center py-12">Loading your orders...</p>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <FaBoxOpen className="text-3xl text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-4">
              {orders.length === 0
                ? "You haven't placed any orders yet."
                : "No orders match your search."}
            </p>
            {orders.length === 0 && (
              <button
                onClick={() => navigate("/products")}
                className="bg-[#f2592b] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#e04a1f] transition-colors"
              >
                Start Shopping
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="divide-y divide-gray-100">
              {paginatedOrders.map((order) => (
                <button
                  key={order.id}
                  onClick={() => navigate(`/orders/${order.id}`)}
                  className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 truncate">
                      {order.orderNumber}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString("en-NG", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                      {" · "}
                      {order.items.length} item{order.items.length === 1 ? "" : "s"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap shrink-0">
                    <span className="font-bold text-gray-900">
                      ₦{Number(order.totalAmount).toLocaleString()}
                    </span>
                    <OrderStatusBadge status={order.status} />
                    <PaymentStatusPill order={order} />
                    <FaChevronRight className="text-gray-300 text-xs" />
                  </div>
                </button>
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredOrders.length}
              pageSize={PAGE_SIZE}
              onPageChange={goToPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;