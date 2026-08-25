import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaMinus, FaPlus, FaArrowLeft, FaMapMarkerAlt, FaSpinner } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import {
  getCartAction,
  updateCartQuantityAction,
  removeCartProductAction,
} from "../../store/Users/cart/cartAction";
import { getAddressesAction } from "../../store/Users/address/addressAction";
import { CartNotificationModal } from "../../Components/CartNotificationModal";
import { AuthPromptModal } from "../../Components/AuthPromptModal";
import { AddressPickerModal } from "../../Components/AddressPickerModal";
import { EmptyCartRunner } from "../../Components/EmptyCartRunner";
import { useAuth } from "../../Context/Auth/useAuth";
import type { CartLineItem } from "../../Types/user/cartType";

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();

  const cart = useSelector((state: RootState) => state.getCart.cart);
  const loading = useSelector((state: RootState) => state.getCart.loading);
  const totalItems = useSelector((state: RootState) => state.getCart.totalItems);
  const subtotal = useSelector((state: RootState) => state.getCart.subtotal);

  const addresses = useSelector((state: RootState) => state.getAddress.addresses);
  const selectedAddressId = useSelector(
    (state: RootState) => state.getAddress.selectedAddressId,
  );
  const selectedAddress = addresses.find((a) => a.id === selectedAddressId) ?? null;

  const [notification, setNotification] = useState<{
    open: boolean;
    type: "ADD" | "UPDATE" | "REMOVE" | "ERROR";
    item?: any;
    message?: string;
  }>({ open: false, type: "ADD" });

  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [showAddressPicker, setShowAddressPicker] = useState(false);

  // Per-line loading state — tracked by productId so only the specific
  // row being updated/removed shows a spinner, not the whole cart.
  // Separate from Redux's global `loading` flag, which fires on every
  // cart-related dispatch and would otherwise spin every row at once.
  const [updatingProductId, setUpdatingProductId] = useState<string | null>(null);
  const [removingProductId, setRemovingProductId] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    dispatch(getCartAction());
    if (user) {
      dispatch(getAddressesAction());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (notification.open) {
      const timer = setTimeout(() => {
        setNotification((prev) => ({ ...prev, open: false }));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleUpdateQuantity = async (
    line: CartLineItem,
    newQuantity: number,
  ) => {
    if (newQuantity < 1) return;
    if (updatingProductId === line.productId) return; // ignore double-clicks mid-request

    setUpdatingProductId(line.productId);
    try {
      await dispatch(
        updateCartQuantityAction(line.productId, newQuantity, line.product),
      );
      setNotification({
        open: true,
        type: "UPDATE",
        item: {
          name: line.product.name,
          quantity: newQuantity,
          price: Number(line.product.price),
          image: line.product.images?.[0]?.url,
        },
        message: "Quantity updated successfully",
      });

      dispatch(getCartAction());
    } catch (error) {
      // console.log(error);
      setNotification({
        open: true,
        type: "ERROR",
        message: "Could not update quantity",
      });
    } finally {
      setUpdatingProductId(null);
    }
  };

  const handleRemoveItem = async (line: CartLineItem) => {
    if (removingProductId === line.productId) return;

    setRemovingProductId(line.productId);
    try {
      await dispatch(removeCartProductAction(line.productId));
      setNotification({
        open: true,
        type: "REMOVE",
        item: {
          name: line.product.name,
          quantity: line.quantity,
          price: Number(line.product.price),
          image: line.product.images?.[0]?.url,
        },
        message: `${line.product.name} removed from cart`,
      });

      dispatch(getCartAction());
    } catch (error) {
      // console.log(error);
      setNotification({
        open: true,
        type: "ERROR",
        message: "Could not remove item",
      });
    } finally {
      setRemovingProductId(null);
    }
  };

  const handleCheckoutClick = () => {
    if (!user) {
      setShowAuthPrompt(true);
      return;
    }
    if (!selectedAddress) {
      setShowAddressPicker(true);
      return;
    }
    navigate("/checkout");
  };

  const items = cart?.items ?? [];

  if (loading && items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <p className="text-gray-400">Loading your cart...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <EmptyCartRunner className="mb-4" />
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-600">
          Your cart is empty
        </h2>
        <p className="text-gray-400 mt-2 text-sm sm:text-base">
          Looks like you haven't added any items yet
        </p>
        <button
          onClick={() => navigate("/products")}
          className="mt-6 bg-[#f2592b] text-white px-6 sm:px-8 py-3 rounded-xl font-semibold hover:bg-[#e04a1f] transition-colors w-full sm:w-auto"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-[#f2592b] transition-colors mb-4 sm:mb-6 text-sm sm:text-base"
      >
        <FaArrowLeft /> Continue Shopping
      </button>

      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
            Shopping Cart ({totalItems} {totalItems === 1 ? "item" : "items"})
          </h1>

          {items.map((line) => {
            const price = Number(line.product.price);
            const inStock = line.quantity < line.product.quantity;
            const atMax = line.quantity >= line.product.quantity;
            const isUpdating = updatingProductId === line.productId;
            const isRemoving = removingProductId === line.productId;
            const rowBusy = isUpdating || isRemoving;

            return (
              <div
                key={line.id}
                className={`flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100 mb-4 hover:shadow-md transition-shadow ${
                  isRemoving ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                <div className="w-full h-40 sm:w-24 sm:h-24 shrink-0 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs overflow-hidden">
                  <img
                    src={
                      line?.product.images?.[0]?.url ||
                      "https://res.cloudinary.com/dx99hljwc/image/upload/v1785579785/wxyz/1785579782019_wxyz_logo.png"
                    }
                    alt={line?.product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="flex-1 flex flex-col sm:flex-row sm:justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold wrap-break-words">
                      {line.product.name}
                    </h3>
                    {line.product.description && (
                      <p className="text-sm text-gray-500 line-clamp-2 sm:line-clamp-none">
                        {line.product.description}
                      </p>
                    )}
                    <p className="text-[#f2592b] font-bold mt-1">
                      ₦{price.toLocaleString()}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-2">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() =>
                            handleUpdateQuantity(line, line.quantity - 1)
                          }
                          className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          disabled={line.quantity <= 1 || rowBusy}
                        >
                          <FaMinus />
                        </button>
                        <span className="w-10 text-center font-medium flex items-center justify-center">
                          {isUpdating ? (
                            <FaSpinner className="animate-spin text-gray-400 text-sm" />
                          ) : (
                            line.quantity
                          )}
                        </span>
                        <button
                          onClick={() =>
                            handleUpdateQuantity(line, line.quantity + 1)
                          }
                          className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          disabled={atMax || rowBusy}
                        >
                          <FaPlus />
                        </button>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(line)}
                        disabled={rowBusy}
                        className="text-red-500 hover:text-red-600 text-sm flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {isRemoving ? (
                          <FaSpinner className="animate-spin" />
                        ) : (
                          <FaTrash />
                        )}
                        {isRemoving ? "Removing..." : "Remove"}
                      </button>
                    </div>
                  </div>

                  {/* Line total + stock status */}
                  <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 sm:gap-1 sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 mt-1 sm:mt-0">
                    <p className="font-bold text-base sm:text-lg">
                      ₦{(price * line.quantity).toLocaleString()}
                    </p>
                    {inStock ? (
                      <span className="text-xs text-green-600">In Stock</span>
                    ) : (
                      <span className="text-xs text-red-500">
                        Max quantity reached
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-5 sm:p-6 lg:sticky lg:top-24 border border-gray-100">
            <h2 className="text-lg font-bold mb-4">Order Summary</h2>

            {/* Delivery Address */}
            {user && (
              <div className="mb-4 pb-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Deliver to
                  </span>
                  <button
                    onClick={() => setShowAddressPicker(true)}
                    className="text-xs font-medium text-[#f2592b] hover:underline"
                  >
                    {selectedAddress ? "Change" : "Select"}
                  </button>
                </div>
                {selectedAddress ? (
                  <div className="flex gap-2 text-sm">
                    <FaMapMarkerAlt className="text-[#f2592b] mt-0.5 shrink-0" />
                    <span className="text-gray-600">
                      {selectedAddress.street}, {selectedAddress.city},{" "}
                      {selectedAddress.state}
                    </span>
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">No address selected</p>
                )}
              </div>
            )}

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">
                  Subtotal ({totalItems} items)
                </span>
                <span className="font-medium">
                  ₦{subtotal.toLocaleString()}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-3 mt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-[#f2592b]">
                    ₦{subtotal.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleCheckoutClick}
              className="w-full mt-6 bg-[#f2592b] text-white py-3 rounded-xl font-semibold hover:bg-[#e04a1f] transition-colors"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>

      {/* Notification Modal */}
      <CartNotificationModal
        isOpen={notification.open}
        onClose={() => setNotification({ ...notification, open: false })}
        type={notification.type}
        item={notification.item}
        message={notification.message}
      />

      {/* Auth Prompt */}
      <AuthPromptModal
        isOpen={showAuthPrompt}
        onClose={() => setShowAuthPrompt(false)}
        message="Sign in to proceed to checkout."
      />

      {/* Address Picker */}
      <AddressPickerModal
        isOpen={showAddressPicker}
        onClose={() => setShowAddressPicker(false)}
      />
    </div>
  );
};