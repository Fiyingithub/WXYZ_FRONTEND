// ============================================
// 3. CART PAGE (CartPage.tsx)
// ============================================
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaMinus, FaPlus, FaShoppingBag, FaArrowLeft } from 'react-icons/fa';
import { useCart } from '../../Context/cart/useCart';
import { CartNotificationModal } from '../../Components/CartNotificationModal';



export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useCart();
  const [notification, setNotification] = useState<{
    open: boolean;
    type: 'ADD' | 'UPDATE' | 'REMOVE' | 'ERROR';
    item?: any;
    message?: string;
  }>({ open: false, type: 'ADD' });

  const handleUpdateQuantity = (item: any, newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= item.maxStock) {
      dispatch({
        type: 'UPDATE_QUANTITY',
        payload: { id: item.id, quantity: newQuantity },
      });
      setNotification({
        open: true,
        type: 'UPDATE',
        item: { ...item, quantity: newQuantity },
        message: 'Quantity updated successfully',
      });
    }
  };

  const handleRemoveItem = (item: any) => {
    dispatch({ type: 'REMOVE_ITEM', payload: item.id });
    setNotification({
      open: true,
      type: 'REMOVE',
      item: item,
      message: `${item.name} removed from cart`,
    });
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <FaShoppingBag className="text-6xl text-gray-300 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-600">Your cart is empty</h2>
        <p className="text-gray-400 mt-2">Looks like you haven't added any items yet</p>
        <button
          onClick={() => navigate('/products')}
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
          <h1 className="text-2xl font-bold mb-6">Shopping Cart ({state.totalItems} items)</h1>

          {state.items.map((item: any) => (
            <div
              key={item.id}
              className="flex gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100 mb-4 hover:shadow-md transition-shadow"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-500">{item.category}</p>
                <p className="text-[#f2592b] font-bold mt-1">₦{item.price.toLocaleString()}</p>

                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                      className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-sm transition-colors"
                      disabled={item.quantity <= 1}
                    >
                      <FaMinus />
                    </button>
                    <span className="w-10 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-sm transition-colors"
                      disabled={item.quantity >= item.maxStock}
                    >
                      <FaPlus />
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item)}
                    className="text-red-500 hover:text-red-600 text-sm flex items-center gap-1"
                  >
                    <FaTrash /> Remove
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">
                  ₦{(item.price * item.quantity).toLocaleString()}
                </p>
                {item.quantity < item.maxStock ? (
                  <span className="text-xs text-green-600">In Stock</span>
                ) : (
                  <span className="text-xs text-red-500">Max quantity reached</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24 border border-gray-100">
            <h2 className="text-lg font-bold mb-4">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal ({state.totalItems} items)</span>
                <span className="font-medium">₦{state.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  {state.shipping === 0 ? 'Free' : `₦${state.shipping.toLocaleString()}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (7.5%)</span>
                <span className="font-medium">₦{state.tax.toLocaleString()}</span>
              </div>
              {state.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-₦{state.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-3 mt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-[#f2592b]">₦{state.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
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
    </div>
  );
};
