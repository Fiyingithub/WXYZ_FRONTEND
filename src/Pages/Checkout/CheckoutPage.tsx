// ============================================
// 4. CHECKOUT PAGE (CheckoutPage.tsx)
// ============================================
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser,  FaTruck, FaCreditCard } from 'react-icons/fa';
import { useCart } from '../../Context/cart/useCart';

interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  homeAddress: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useCart();
  const [step, setStep] = useState(1);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [address, setAddress] = useState<ShippingAddress>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    homeAddress: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Nigeria',
  });

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleContinue = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      navigate('/payment');
    }
  };

  const isAddressValid = () => {
    const { firstName, lastName, email, phone, homeAddress, city, state, zipCode } = address;
    return firstName && lastName && email && phone && homeAddress && city && state && zipCode;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-md mx-auto">
            {['Shipping', 'Delivery', 'Review'].map((label, index) => (
              <div key={label} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step > index + 1
                      ? 'bg-green-500 text-white'
                      : step === index + 1
                      ? 'bg-[#f2592b] text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step > index + 1 ? '✓' : index + 1}
                </div>
                <span className="text-xs mt-2 text-gray-600">{label}</span>
              </div>
            ))}
          </div>
          <div className="relative max-w-md mx-auto mt-2">
            <div className="absolute top-0 left-0 h-1 bg-gray-200 rounded-full w-full">
              <div
                className="h-1 bg-[#f2592b] rounded-full transition-all duration-500"
                style={{ width: `${((step - 1) / 2) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              {step === 1 && (
                <div>
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <FaUser className="text-[#f2592b]" /> Shipping Address
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      value={address.firstName}
                      onChange={handleAddressChange}
                      className="col-span-2 sm:col-span-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f2592b]"
                    />
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      value={address.lastName}
                      onChange={handleAddressChange}
                      className="col-span-2 sm:col-span-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f2592b]"
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      value={address.email}
                      onChange={handleAddressChange}
                      className="col-span-2 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f2592b]"
                    />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      value={address.phone}
                      onChange={handleAddressChange}
                      className="col-span-2 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f2592b]"
                    />
                    <input
                      type="text"
                      name="homeAddress"
                      placeholder="Street Address"
                      value={address.homeAddress}
                      onChange={handleAddressChange}
                      className="col-span-2 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f2592b]"
                    />
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={address.city}
                      onChange={handleAddressChange}
                      className="col-span-2 sm:col-span-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f2592b]"
                    />
                    <input
                      type="text"
                      name="state"
                      placeholder="State"
                      value={address.state}
                      onChange={handleAddressChange}
                      className="col-span-2 sm:col-span-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f2592b]"
                    />
                    <input
                      type="text"
                      name="zipCode"
                      placeholder="ZIP Code"
                      value={address.zipCode}
                      onChange={handleAddressChange}
                      className="col-span-2 sm:col-span-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f2592b]"
                    />
                    <select
                      name="country"
                      value={address.country}
                      onChange={handleAddressChange}
                      className="col-span-2 sm:col-span-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f2592b]"
                    >
                      <option value="Nigeria">Nigeria</option>
                      <option value="Ghana">Ghana</option>
                      <option value="Kenya">Kenya</option>
                      <option value="South Africa">South Africa</option>
                    </select>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <FaTruck className="text-[#f2592b]" /> Delivery Method
                  </h2>
                  <div className="space-y-4">
                    {[
                      { id: 'standard', label: 'Standard Delivery', time: '3-5 business days', price: state.subtotal > 50000 ? 0 : 2500 },
                      { id: 'express', label: 'Express Delivery', time: '1-2 business days', price: 5000 },
                      { id: 'same-day', label: 'Same Day Delivery', time: 'Within 24 hours', price: 10000 },
                    ].map((method) => (
                      <label
                        key={method.id}
                        className={`block p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          shippingMethod === method.id
                            ? 'border-[#f2592b] bg-orange-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="shipping"
                              value={method.id}
                              checked={shippingMethod === method.id}
                              onChange={(e) => setShippingMethod(e.target.value)}
                              className="text-[#f2592b]"
                            />
                            <div>
                              <p className="font-medium">{method.label}</p>
                              <p className="text-sm text-gray-500">{method.time}</p>
                            </div>
                          </div>
                          <p className="font-bold">
                            {method.price === 0 ? 'Free' : `₦${method.price.toLocaleString()}`}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <FaCreditCard className="text-[#f2592b]" /> Review Order
                  </h2>
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Shipping Address</h3>
                      <p className="text-sm text-gray-600">
                        {address.firstName} {address.lastName}
                        <br />
                        {address.homeAddress}
                        <br />
                        {address.city}, {address.state} {address.zipCode}
                        <br />
                        {address.country}
                        <br />
                        {address.email} | {address.phone}
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Delivery Method</h3>
                      <p className="text-sm text-gray-600">
                        {shippingMethod === 'standard' && 'Standard Delivery (3-5 business days)'}
                        {shippingMethod === 'express' && 'Express Delivery (1-2 business days)'}
                        {shippingMethod === 'same-day' && 'Same Day Delivery (Within 24 hours)'}
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Order Items</h3>
                      {state.items.map((item: any) => (
                        <div key={item.id} className="flex justify-between text-sm py-2 border-b border-gray-200 last:border-0">
                          <span>
                            {item.name} × {item.quantity}
                          </span>
                          <span className="font-medium">₦{(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
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
                  <span className="font-medium">
                    {shippingMethod === 'standard' && state.subtotal > 50000 ? 'Free' : 'To be calculated'}
                  </span>
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

              <button
                onClick={handleContinue}
                disabled={step === 1 && !isAddressValid()}
                className={`w-full mt-6 py-3 rounded-xl font-semibold transition-colors ${
                  step === 1 && !isAddressValid()
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-[#f2592b] text-white hover:bg-[#e04a1f]'
                }`}
              >
                {step === 3 ? 'Proceed to Payment' : 'Continue'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
