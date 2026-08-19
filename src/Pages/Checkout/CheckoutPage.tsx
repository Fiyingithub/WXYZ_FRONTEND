import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { userOrderService } from "../../services/Users/order/userOrderService";
// import { userPaymentService } from "../../services/Users/payment/userPaymentService";
import { AddressPickerModal } from "../../Components/AddressPickerModal";
import { FaMapMarkerAlt, FaArrowLeft, FaLock } from "react-icons/fa";
import { useAuth } from "../../Context/Auth/useAuth";
import { userPaymentService } from "../../services/Users/payment/userPaymentService";

const CheckoutPage = () => {
  const navigate = useNavigate();
  // const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();

  const cart = useSelector((state: RootState) => state.getCart.cart);
  const subtotal = useSelector((state: RootState) => state.getCart.subtotal);
  const totalItems = useSelector((state: RootState) => state.getCart.totalItems);

  const addresses = useSelector((state: RootState) => state.getAddress.addresses);
  const selectedAddressId = useSelector(
    (state: RootState) => state.getAddress.selectedAddressId,
  );
  const selectedAddress = addresses.find((a) => a.id === selectedAddressId) ?? null;

  const [showAddressPicker, setShowAddressPicker] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const items = cart?.items ?? [];

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      setShowAddressPicker(true);
      return;
    }
    if (!user?.email) {
      setError("Missing account email — please sign in again.");
      return;
    }
    if (items.length === 0) return;

    setPlacingOrder(true);
    setError(null);

    try {
      // Step 1: create the order
      const order = await userOrderService.create({
        userId: user.id,
        items: items.map((line) => ({
          productId: line.productId,
          quantity: line.quantity,
        })),
      });

      // Step 2: initialize payment for that order, get Paystack's
      // hosted checkout URL, and redirect there. Cart is intentionally
      // NOT cleared here — that should happen only after payment is
      // confirmed on the verify page, otherwise a user who abandons
      // the Paystack page loses their cart for nothing.
      const paymentInit = await userPaymentService.initialize({
        email: user.email,
        orderId: order.id,
      });

      window.location.href = paymentInit.authorizationUrl;
    } catch (err) {
      setError("Could not start checkout. Please try again.");
      setPlacingOrder(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <p className="text-gray-500">Your cart is empty.</p>
        <button
          onClick={() => navigate("/products")}
          className="mt-4 bg-[#f2592b] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#e04a1f] transition-colors"
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-[#f2592b] transition-colors mb-6"
      >
        <FaArrowLeft /> Back to Cart
      </button>

      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      {/* Delivery address */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Delivery Address</h2>
          <button
            onClick={() => setShowAddressPicker(true)}
            className="text-sm font-medium text-[#f2592b] hover:underline"
          >
            {selectedAddress ? "Change" : "Select"}
          </button>
        </div>
        {selectedAddress ? (
          <div className="flex gap-2 text-sm text-gray-600">
            <FaMapMarkerAlt className="text-[#f2592b] mt-0.5 shrink-0" />
            <span>
              {selectedAddress.street}, {selectedAddress.city},{" "}
              {selectedAddress.state}, {selectedAddress.country}
            </span>
          </div>
        ) : (
          <p className="text-sm text-gray-400">No address selected yet.</p>
        )}
      </div>

      {/* Order summary */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 mb-4">
        <h2 className="font-semibold mb-3">Order Summary</h2>
        <div className="space-y-2 text-sm">
          {items.map((line) => (
            <div key={line.id} className="flex justify-between text-gray-600">
              <span>
                {line.product.name} × {line.quantity}
              </span>
              <span>
                ₦{(Number(line.product.price) * line.quantity).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between font-bold">
          <span>Total ({totalItems} items)</span>
          <span className="text-[#f2592b]">₦{subtotal.toLocaleString()}</span>
        </div>
      </div>

      {/* Payment method */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 mb-6">
        <h2 className="font-semibold mb-2">Payment Method</h2>
        <p className="text-sm text-gray-500">
          Card, bank transfer, or USSD via Paystack — you'll be redirected to
          complete payment securely.
        </p>
      </div>

      {error && (
        <p className="text-sm text-red-500 mb-4" role="alert">
          {error}
        </p>
      )}

      <button
        onClick={handlePlaceOrder}
        disabled={placingOrder}
        className="w-full bg-[#f2592b] text-white py-3.5 rounded-xl font-semibold hover:bg-[#e04a1f] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {placingOrder ? (
          "Redirecting to Paystack..."
        ) : (
          <>
            <FaLock className="text-sm" /> Pay ₦{subtotal.toLocaleString()}
          </>
        )}
      </button>

      <AddressPickerModal
        isOpen={showAddressPicker}
        onClose={() => setShowAddressPicker(false)}
      />
    </div>
  );
};

export default CheckoutPage;