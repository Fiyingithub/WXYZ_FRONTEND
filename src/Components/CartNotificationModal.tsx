// ============================================
// 2. CRUD NOTIFICATION MODAL (CartNotificationModal.tsx)
// ============================================
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaTimesCircle, FaShoppingCart, FaTrash, FaMinus, FaPlus } from 'react-icons/fa';
import type { CartItem } from '../Context/cart/cart-types';
import { useCart } from '../Context/cart/useCart';


type NotificationType = 'ADD' | 'UPDATE' | 'REMOVE' | 'ERROR';

interface CartNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: NotificationType;
  item?: CartItem;
  message?: string;
}

export const CartNotificationModal: React.FC<CartNotificationModalProps> = ({
  isOpen,
  onClose,
  type,
  item,
  message,
}) => {
  const { state, dispatch } = useCart();
  const [quantity, setQuantity] = useState(item?.quantity || 1);
  const [isVisible, setIsVisible] = useState(isOpen);

  useEffect(() => {
    setIsVisible(isOpen);
  }, [isOpen]);

  // Auto-close after1.5 seconds for success notifications
  useEffect(() => {
    if (isOpen && (type === 'ADD' || type === 'REMOVE')) {
      const timer = setTimeout(() => {
        onClose();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, type, onClose]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'ADD':
        return <FaCheckCircle className="text-green-500 text-4xl" />;
      case 'UPDATE':
        return <FaShoppingCart className="text-blue-500 text-4xl" />;
      case 'REMOVE':
        return <FaTrash className="text-red-500 text-4xl" />;
      case 'ERROR':
        return <FaTimesCircle className="text-red-500 text-4xl" />;
      default:
        return null;
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'ADD':
        return 'Added to Cart!';
      case 'UPDATE':
        return 'Cart Updated';
      case 'REMOVE':
        return 'Removed from Cart';
      case 'ERROR':
        return 'Error';
      default:
        return '';
    }
  };

  const getColor = () => {
    switch (type) {
      case 'ADD':
        return 'border-green-500';
      case 'UPDATE':
        return 'border-blue-500';
      case 'REMOVE':
        return 'border-red-500';
      case 'ERROR':
        return 'border-red-500';
      default:
        return 'border-gray-500';
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (item && newQuantity >= 1 && newQuantity <= item.maxStock) {
      setQuantity(newQuantity);
      dispatch({
        type: 'UPDATE_QUANTITY',
        payload: { id: item.id, quantity: newQuantity },
      });
    }
  };

  const handleRemove = () => {
    if (item) {
      dispatch({ type: 'REMOVE_ITEM', payload: item.id });
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: -20 }}
            className={`bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden border-t-4 ${getColor()}`}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                {getIcon()}
                <div>
                  <h3 className="text-lg font-semibold">{getTitle()}</h3>
                  <p className="text-sm text-gray-500">
                    {message || (item?.name && `${item.name}`)}
                  </p>
                </div>
              </div>
            </div>

            {/* Cart Summary (for ADD/UPDATE) */}
            {(type === 'ADD' || type === 'UPDATE') && item && (
              <div className="p-6 bg-gray-50">
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{item.name}</h4>
                    {item.category && (
                      <p className="text-sm text-gray-500">{item.category}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => handleQuantityChange(quantity - 1)}
                        className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-xs"
                        disabled={quantity <= 1}
                      >
                        <FaMinus />
                      </button>
                      <span className="text-sm font-medium w-8 text-center">{quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(quantity + 1)}
                        className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-xs"
                        disabled={quantity >= item.maxStock}
                      >
                        <FaPlus />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#f2592b]">
                      ₦{(item.price * quantity).toLocaleString()}
                    </p>
                    <button
                      onClick={handleRemove}
                      className="text-xs text-red-500 hover:text-red-600 mt-1"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Cart Footer */}
            {(type === 'ADD' || type === 'UPDATE') && state.totalItems > 0 && (
              <div className="p-6 bg-white">
                <div className="flex justify-between text-sm mb-3">
                  <span className="text-gray-500">Subtotal ({state.totalItems} items)</span>
                  <span className="font-medium">₦{state.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm mb-3">
                  <span className="text-gray-500">Shipping</span>
                  <span className="font-medium">
                    {state.shipping === 0 ? 'Free' : `₦${state.shipping.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm mb-4 border-t border-gray-100 pt-3">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-[#f2592b] text-lg">
                    ₦{state.total.toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    // Navigate to checkout
                    window.location.href = '/checkout';
                  }}
                  className="w-full bg-[#f2592b] text-white py-3 rounded-xl font-semibold hover:bg-[#e04a1f] transition-colors"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <FaTimesCircle className="text-xl" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};


