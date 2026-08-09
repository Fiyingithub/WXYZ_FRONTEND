import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaBoxOpen, FaChevronDown } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { getOrdersAction } from "../../store/Users/order/orderAction";
import { OrderStatusBadge } from "../../Components/OrderStatusBadge";

const OrderHistory = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const orders = useSelector((state: RootState) => state.getOrder.orders);
  const loading = useSelector((state: RootState) => state.getOrder.loading);

  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(getOrdersAction());
  }, [dispatch]);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-[#f2592b] transition-colors mb-6"
      >
        <FaArrowLeft /> Back
      </button>

      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {loading && orders.length === 0 ? (
        <p className="text-gray-400 text-center py-12">Loading your orders...</p>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
          <FaBoxOpen className="text-3xl text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
          <button
            onClick={() => navigate("/products")}
            className="bg-[#f2592b] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#e04a1f] transition-colors"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const isExpanded = expandedId === order.id;

            return (
              <div
                key={order.id}
                className="bg-white rounded-xl border border-gray-100 overflow-hidden"
              >
                <button
                  onClick={() => toggleExpand(order.id)}
                  className="w-full flex items-center justify-between gap-4 p-4 text-left hover:bg-gray-50 transition-colors"
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
                    </p>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <span className="font-bold text-gray-900">
                      ₦{Number(order.totalAmount).toLocaleString()}
                    </span>
                    <OrderStatusBadge status={order.status} />
                    <FaChevronDown
                      className={`text-gray-400 text-xs transition-transform ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>

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

export default OrderHistory;