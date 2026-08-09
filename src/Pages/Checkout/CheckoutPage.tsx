import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
// import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";

// import { loadStripe } from "@stripe/stripe-js";
import type { AppDispatch, RootState } from "../../store/store";
import { userOrderService } from "../../services/Users/order/userOrderService";
import { clearUserCartAction } from "../../store/Users/cart/cartAction";
import { AddressPickerModal } from "../../Components/AddressPickerModal";
import { FaMapMarkerAlt, FaArrowLeft } from "react-icons/fa";
import { useAuth } from "../../Context/Auth/useAuth";
import type { Order } from "../../Types/user/order/orderType";


// const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
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

  // Country decides the gateway: Nigeria → Flutterwave (NGN), else → Stripe (USD).
  // Swap this single check if you'd rather route by currency, saved user
  // preference, or something else.
  const isNigeria = selectedAddress?.country?.toLowerCase() === "nigeria";

  const flutterwaveConfig = (order: Order) => ({
    public_key: import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY as string,
    tx_ref: order.id,
    amount: order.amount,
    currency: "NGN",
    payment_options: "card,ussd,banktransfer",
    customer: {
      email: user?.email ?? "",
      name: user?.username ?? "",
    },
    customizations: {
      title: "WXYZ Checkout",
      description: `Payment for order ${order.id}`,
    },
  });

  // const handleFlutterwavePayment = useFlutterwave(
  //   // useFlutterwave needs a config object up front; we pass a placeholder
  //   // and only actually invoke `initiatePayment` once we have a real order.
  //   { public_key: import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY as string } as any,
  // );

  const payWithFlutterwave = (order: Order) => {
    // handleFlutterwavePayment({
    //   ...flutterwaveConfig(order),
    //   callback: async (response: any) => {
    //     closePaymentModal();
    //     if (response.status === "successful") {
    //       await confirmAndFinish(order.id, String(response.transaction_id));
    //     } else {
    //       setError("Payment was not completed. Please try again.");
    //       setPlacingOrder(false);
    //     }
    //   },
    //   onClose: () => {
    //     setPlacingOrder(false);
    //   },
    // } as any);
  };

  const payWithStripe = async (order: Order) => {
    // const stripe = await stripePromise;
    const stripe = 'stripe';
    if (!stripe) {
      setError("Payment provider failed to load.");
      setPlacingOrder(false);
      return;
    }

    // NOTE: Stripe Checkout normally needs a Checkout Session created
    // server-side (never expose secret keys client-side). This assumes
    // the order-creation response eventually includes a `checkoutUrl` for
    // USD orders — add that field to the backend contract, or swap this
    // for `stripe.redirectToCheckout({ sessionId })` if you return a
    // session id instead of a full URL.
    const checkoutUrl = (order as any).checkoutUrl;
    if (!checkoutUrl) {
      setError("Stripe checkout session missing from order response.");
      setPlacingOrder(false);
      return;
    }
    window.location.href = checkoutUrl;
  };

  const confirmAndFinish = async (orderId: string, reference: string) => {
    try {
      await userOrderService.confirmPayment(orderId, reference);
      await dispatch(clearUserCartAction());
      navigate(`/order-confirmation/${orderId}`);
    } catch (err) {
      setError("Payment succeeded but confirmation failed. Contact support with your reference: " + reference);
    } finally {
      setPlacingOrder(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      setShowAddressPicker(true);
      return;
    }
    if (items.length === 0) return;

    setPlacingOrder(true);
    setError(null);

    try {
      const order = await userOrderService.create({
        userId: user?.id, // confirm this field name on your `user` object from useAuth()
        items: items.map((line) => ({
          productId: line.productId,
          quantity: line.quantity,
        })),
      });

      if (isNigeria) {
        // payWithFlutterwave(order);
      } else {
        // await payWithStripe(order);
      }
    } catch (err) {
      setError("Could not create your order. Please try again.");
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

      {/* Payment method indicator */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 mb-6">
        <h2 className="font-semibold mb-2">Payment Method</h2>
        <p className="text-sm text-gray-500">
          {selectedAddress
            ? isNigeria
              ? "Card, USSD, or bank transfer via Flutterwave (NGN)"
              : "Card payment via Stripe (USD)"
            : "Select a delivery address to see available payment options."}
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
        className="w-full bg-[#f2592b] text-white py-3.5 rounded-xl font-semibold hover:bg-[#e04a1f] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {placingOrder ? "Processing..." : `Place Order — ₦${subtotal.toLocaleString()}`}
      </button>

      <AddressPickerModal
        isOpen={showAddressPicker}
        onClose={() => setShowAddressPicker(false)}
      />
    </div>
  );
};

export default CheckoutPage;