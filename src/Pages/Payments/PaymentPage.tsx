
// ============================================
// 5. PAYMENT PAGE (PaymentPage.tsx)
// ============================================
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCreditCard, FaPaypal, FaGooglePay, FaApplePay, FaLock, FaCheckCircle } from 'react-icons/fa';
import { useCart } from '../../Context/cart/useCart';

interface PaymentDetails {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
  saveCard: boolean;
}

export const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'google' | 'apple'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [cardDetails, setCardDetails] = useState<PaymentDetails>({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    saveCard: false,
  });

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setCardDetails({
      ...cardDetails,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ') : cleaned;
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Simulate success
    setIsProcessing(false);
    setIsSuccess(true);

    // Clear cart after successful payment
    setTimeout(() => {
      dispatch({ type: 'CLEAR_CART' });
      navigate('/order-confirmation');
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <FaCheckCircle className="text-4xl text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Payment Successful!</h2>
        <p className="text-gray-500 mt-2">Your order has been placed successfully.</p>
        <p className="text-sm text-gray-400 mt-1">Redirecting to order confirmation...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <FaCreditCard className="text-[#f2592b]" /> Payment Method
              </h2>

              {/* Payment Method Selection */}
              <div className="grid grid-cols-4 gap-2 mb-6">
                {[
                  { id: 'card', icon: FaCreditCard, label: 'Card' },
                  { id: 'paypal', icon: FaPaypal, label: 'PayPal' },
                  { id: 'google', icon: FaGooglePay, label: 'Google Pay' },
                  { id: 'apple', icon: FaApplePay, label: 'Apple Pay' },
                ].map(({ id, icon: Icon, label }) => (
                  <button
                    key={id}
                    onClick={() => setPaymentMethod(id as any)}
                    className={`p-3 rounded-lg border-2 text-center transition-all ${
                      paymentMethod === id
                        ? 'border-[#f2592b] bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className={`mx-auto text-xl ${paymentMethod === id ? 'text-[#f2592b]' : 'text-gray-400'}`} />
                    <span className="text-xs mt-1 block">{label}</span>
                  </button>
                ))}
              </div>

              {/* Card Form */}
              {paymentMethod === 'card' && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formatCardNumber(cardDetails.cardNumber)}
                      onChange={handleCardChange}
                      placeholder="1234 5678 9012 3456"
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f2592b] font-mono"
                      maxLength={19}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Card Holder Name
                    </label>
                    <input
                      type="text"
                      name="cardHolder"
                      value={cardDetails.cardHolder}
                      onChange={handleCardChange}
                      placeholder="John Doe"
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f2592b]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={formatExpiryDate(cardDetails.expiryDate)}
                        onChange={handleCardChange}
                        placeholder="MM/YY"
                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f2592b]"
                        maxLength={5}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CVV
                      </label>
                      <input
                        type="password"
                        name="cvv"
                        value={cardDetails.cvv}
                        onChange={handleCardChange}
                        placeholder="123"
                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f2592b]"
                        maxLength={4}
                        required
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-2 text-sm text-gray-600">
                    <input
                      type="checkbox"
                      name="saveCard"
                      checked={cardDetails.saveCard}
                      onChange={handleCardChange}
                      className="text-[#f2592b]"
                    />
                    Save card for future purchases
                  </label>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className={`w-full mt-4 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors ${
                      isProcessing
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-[#f2592b] text-white hover:bg-[#e04a1f]'
                    }`}
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <FaLock className="text-sm" /> Pay ₦{state.total.toLocaleString()}
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Placeholder for other payment methods */}
              {paymentMethod !== 'card' && (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-lg">Redirecting to {paymentMethod}...</p>
                  <p className="text-sm mt-2">This is a demo. Click "Pay" to simulate.</p>
                  <button
                    onClick={handleSubmit}
                    disabled={isProcessing}
                    className="mt-6 bg-[#f2592b] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#e04a1f] transition-colors"
                  >
                    Pay ₦{state.total.toLocaleString()}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24 border border-gray-100">
              <h2 className="text-lg font-bold mb-4">Order Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Items ({state.totalItems})</span>
                  <span className="font-medium">₦{state.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">₦{state.shipping.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (7.5%)</span>
                  <span className="font-medium">₦{state.tax.toLocaleString()}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-[#f2592b]">₦{state.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <FaLock className="text-[10px]" /> Secure payment encrypted
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};