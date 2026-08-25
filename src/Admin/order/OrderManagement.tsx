import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaBoxOpen, FaChevronDown } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { getOrdersAction, updateOrderStatusAction } from "../../store/Users/order/orderAction";
import { OrderStatusBadge } from "../../Components/OrderStatusBadge";
import type { OrderStatus } from "../../Types/user/order/orderType";
import { handleApiError } from "../../utils/handleApiError";
import { toast } from "react-toastify";


const STATUS_OPTIONS: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "DELIVERED",
  "CANCELLED",
];

const OrderManagement = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const orders = useSelector((state: RootState) => state.getOrder.orders);
  const loading = useSelector((state: RootState) => state.getOrder.loading);

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(getOrdersAction());
  }, [dispatch]);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    setUpdatingId(orderId);
    setStatusError(null);
    try {
      await dispatch(updateOrderStatusAction(orderId, status));
    } catch (err) {
      toast.error(handleApiError(err));
      setStatusError("Could not update order status. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-[#f2592b] transition-colors mb-6"
      >
        <FaArrowLeft /> Back
      </button>

      <h1 className="text-2xl font-bold mb-6">Manage Orders</h1>

      {statusError && (
        <p className="text-sm text-red-500 mb-4" role="alert">
          {statusError}
        </p>
      )}

      {loading && orders.length === 0 ? (
        <p className="text-gray-400 text-center py-12">Loading orders...</p>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
          <FaBoxOpen className="text-3xl text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No orders yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const isExpanded = expandedId === order.id;
            const isUpdating = updatingId === order.id;

            return (
              <div
                key={order.id}
                className="bg-white rounded-xl border border-gray-100 overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4">
                  <button
                    onClick={() => toggleExpand(order.id)}
                    className="flex items-center gap-3 text-left flex-1 min-w-0"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {order.orderNumber}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {order.user?.email ?? order.userId} ·{" "}
                        {new Date(order.createdAt).toLocaleDateString("en-NG", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <FaChevronDown
                      className={`text-gray-400 text-xs transition-transform shrink-0 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-bold text-gray-900">
                      ₦{Number(order.totalAmount).toLocaleString()}
                    </span>
                    <OrderStatusBadge status={order.status} />
                    <select
                      value={order.status}
                      disabled={isUpdating}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value as OrderStatus)
                      }
                      className="text-xs border border-gray-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#f2592b]/40 focus:border-[#f2592b] disabled:opacity-50"
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-gray-100 px-4 py-3 space-y-2">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between text-sm text-gray-600"
                      >
                        <span>
                          {item.product.name} × {item.quantity}
                        </span>
                        <span>
                          ₦{(Number(item.price) * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderManagement;