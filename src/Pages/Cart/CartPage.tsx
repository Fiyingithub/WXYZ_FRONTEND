import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaMinus, FaPlus, FaArrowLeft } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import {
  getCartAction,
  updateCartQuantityAction,
  removeCartProductAction,
} from "../../store/Users/cart/cartAction";
import { CartNotificationModal } from "../../Components/CartNotificationModal";
import { AuthPromptModal } from "../../Components/AuthPromptModal";
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

  const [notification, setNotification] = useState<{
    open: boolean;
    type: "ADD" | "UPDATE" | "REMOVE" | "ERROR";
    item?: any;
    message?: string;
  }>({ open: false, type: "ADD" });

  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    dispatch(getCartAction());
  }, [dispatch]);

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
      console.log(error);
      setNotification({
        open: true,
        type: "ERROR",
        message: "Could not update quantity",
      });
    }
  };

  const handleRemoveItem = async (line: CartLineItem) => {
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
      console.log(error);
      setNotification({
        open: true,
        type: "ERROR",
        message: "Could not remove item",
      });
    }
  };

  const handleCheckoutClick = () => {
    if (!user) {
      setShowAuthPrompt(true);
      return;
    }
    navigate("/checkout");
  };

  const items = cart?.items ?? [];

  if (loading && items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-400">Loading your cart...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <EmptyCartRunner className="mb-4" />
        <h2 className="text-2xl font-semibold text-gray-600">
          Your cart is empty
        </h2>
        <p className="text-gray-400 mt-2">
          Looks like you haven't added any items yet
        </p>
        <button
          onClick={() => navigate("/products")}
          className="mt-6 bg-[#f2592b] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#e04a1f] transition-colors"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-[#f2592b] transition-colors mb-6"
      >
        <FaArrowLeft /> Continue Shopping
      </button>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <h1 className="text-2xl font-bold mb-6">
            Shopping Cart ({totalItems} {totalItems === 1 ? "item" : "items"})
          </h1>

          {items.map((line) => {
            const price = Number(line.product.price);
            const inStock = line.quantity < line.product.quantity;
            const atMax = line.quantity >= line.product.quantity;

            return (
              <div
                key={line.id}
                className="flex gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100 mb-4 hover:shadow-md transition-shadow"
              >
                <div className="w-24 h-24 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                  <img
                    src={
                      line?.product.images?.[0]?.url ||
                      "https://res.cloudinary.com/dx99hljwc/image/upload/v1785579785/wxyz/1785579782019_wxyz_logo.png"
                    }
                    alt={line?.product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{line.product.name}</h3>
                  {line.product.description && (
                    <p className="text-sm text-gray-500">
                      {line.product.description}
                    </p>
                  )}
                  <p className="text-[#f2592b] font-bold mt-1">
                    ₦{price.toLocaleString()}
                  </p>

                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() =>
                          handleUpdateQuantity(line, line.quantity - 1)
                        }
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        disabled={line.quantity <= 1}
                      >
                        <FaMinus />
                      </button>
                      <span className="w-10 text-center font-medium">
                        {line.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleUpdateQuantity(line, line.quantity + 1)
                        }
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        disabled={atMax}
                      >
                        <FaPlus />
                      </button>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(line)}
                      className="text-red-500 hover:text-red-600 text-sm flex items-center gap-1"
                    >
                      <FaTrash /> Remove
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">
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
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24 border border-gray-100">
            <h2 className="text-lg font-bold mb-4">Order Summary</h2>

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
    </div>
  );
};