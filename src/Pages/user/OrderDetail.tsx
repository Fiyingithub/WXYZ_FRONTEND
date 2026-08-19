import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaMapMarkerAlt, FaReceipt, FaBoxOpen } from "react-icons/fa";
import { userOrderService } from "../../services/Users/order/userOrderService";
import { userPaymentService } from "../../services/Users/payment/userPaymentService";
import { OrderStatusBadge } from "../../Components/OrderStatusBadge";
import { PaymentStatusPill } from "../../Components/PaymentStatusPill";
import { useAuth } from "../../Context/Auth/useAuth";
import type { Order } from "../../Types/user/order/orderType";


const STEPS: Order["status"][] = ["PENDING", "CONFIRMED", "PROCESSING", "DELIVERED"];

const OrderDetail = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resuming, setResuming] = useState(false);
  const [resumeError, setResumeError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await userOrderService.getById(orderId);
        setOrder(data);
      } catch (err) {
        setError("Could not load this order.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handleCompletePayment = async () => {
    if (!order || !user?.email) return;

    setResuming(true);
    setResumeError(null);
    try {
      const paymentInit = await userPaymentService.initialize({
        email: user.email,
        orderId: order.id,
      });
      window.location.href = paymentInit.authorizationUrl;
    } catch (err) {
      setResumeError("Could not resume payment. Please try again.");
      setResuming(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <p className="text-gray-400">Loading order...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <FaBoxOpen className="text-3xl text-gray-300 mb-3" />
        <p className="text-gray-500 mb-4">{error || "Order not found."}</p>
        <button
          onClick={() => navigate("/orders")}
          className="bg-[#f2592b] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#e04a1f] transition-colors"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  const needsPayment = !order.payment || order.payment.status !== "SUCCESS";
  const currentStepIndex = STEPS.indexOf(order.status);
  const isCancelled = order.status === "CANCELLED";

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate("/orders")}
          className="flex items-center gap-2 text-gray-600 hover:text-[#f2592b] transition-colors mb-6 text-sm"
        >
          <FaArrowLeft /> Back to Orders
        </button>

        {/* Header */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-1">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              {order.orderNumber}
            </h1>
            <div className="flex items-center gap-2 flex-wrap">
              <OrderStatusBadge status={order.status} />
              <PaymentStatusPill order={order} />
            </div>
          </div>
          <p className="text-sm text-gray-400">
            Placed on{" "}
            {new Date(order.createdAt).toLocaleDateString("en-NG", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Progress tracker — skipped for cancelled orders, since the
            linear PENDING→DELIVERED path doesn't apply once cancelled */}
        {!isCancelled && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 mb-4">
            <div className="flex items-center">
              {STEPS.map((step, index) => {
                const isDone = index <= currentStepIndex;
                const isLast = index === STEPS.length - 1;
                return (
                  <div key={step} className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center gap-1.5">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${
                          isDone
                            ? "bg-[#f2592b] text-white"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <span
                        className={`text-[11px] font-medium whitespace-nowrap ${
                          isDone ? "text-gray-900" : "text-gray-400"
                        }`}
                      >
                        {step.charAt(0) + step.slice(1).toLowerCase()}
                      </span>
                    </div>
                    {!isLast && (
                      <div
                        className={`flex-1 h-0.5 mx-2 ${
                          index < currentStepIndex ? "bg-[#f2592b]" : "bg-gray-100"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Items */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 mb-4">
          <h2 className="font-semibold text-gray-900 mb-4">Items</h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <img
                  src={
                    (item.product as any).images?.[0]?.url ||
                    "https://res.cloudinary.com/dx99hljwc/image/upload/v1785579785/wxyz/1785579782019_wxyz_logo.png"
                  }
                  alt={item.product.name}
                  className="w-14 h-14 rounded-xl object-cover bg-gray-100 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {item.product.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    Qty {item.quantity} × ₦{Number(item.price).toLocaleString()}
                  </p>
                </div>
                <span className="font-semibold text-gray-900 shrink-0">
                  ₦{(Number(item.price) * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between font-bold text-gray-900">
            <span>Total</span>
            <span className="text-[#f2592b]">
              ₦{Number(order.totalAmount).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Payment info */}
        {order.payment && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 mb-4">
            <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <FaReceipt className="text-[#f2592b]" /> Payment
            </h2>
            <div className="text-sm text-gray-600 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-gray-400">Reference</span>
                <span className="font-mono text-gray-700">{order.payment.reference}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status</span>
                <span className="text-gray-700">{order.payment.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Last updated</span>
                <span className="text-gray-700">
                  {new Date(order.payment.updatedAt).toLocaleString("en-NG")}
                </span>
              </div>
            </div>
          </div>
        )}

        {resumeError && (
          <p className="text-sm text-red-500 mb-4" role="alert">
            {resumeError}
          </p>
        )}

        {needsPayment && !isCancelled && (
          <button
            onClick={handleCompletePayment}
            disabled={resuming}
            className="w-full bg-[#f2592b] text-white py-3.5 rounded-xl font-semibold hover:bg-[#e04a1f] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <FaMapMarkerAlt className="hidden" />
            {resuming ? "Redirecting to Paystack..." : "Complete Payment"}
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderDetail;