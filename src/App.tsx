import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Components
import LandingPage from "./Pages/Landing/LandingPage";
import { ToastProvider } from "./Loaders/ToastContext";

// AUTH
import SignupPage from "./Auth/SignupPage";
import LoginPage from "./Auth/LoginPage";

import ProductDetails from "./Products/ProductDetails";

// // Admin
import Dashboard from "./Admin/Dashboard";
import AdminProduct from "./Admin/ManageProduct/AdminProduct";
import AdminOrder from "./Admin/order/AdminOrder";
import { AdminLayout } from "./Layouts/AdminLayouts";
import AdminProfile from "./Admin/profile/AdminProfile";
import SortedProductDisplay from "./Products/SortedProductDisplay";
import CustomerProfile from "./Pages/user/CustomerProfile";
import ProtectedRoute from "./utils/ProtectedRoute";
import { CartPage } from "./Pages/Cart/CartPage";
import { PaymentPage } from "./Pages/Payments/PaymentPage";
import LandingPageLayout from "./Layouts/LandingPageLayout";
import { NotFoundPage } from "./Pages/NotFoundPage";
import AddressBook from "./Pages/user/AddressBook";
import CheckoutPage from "./Pages/Checkout/CheckoutPage";
import OrderHistory from "./Pages/user/OrderHistory";
import OrderManagement from "./Admin/order/OrderManagement";
import Profile from "./Pages/Profile";

function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPageLayout />}>
            <Route index element={<LandingPage />} />
            <Route path="/products" element={<SortedProductDisplay />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/profile" element={<Profile />} />

            {/* Orders */}
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="*" element={<NotFoundPage />} />
            <Route path="/account/addresses" element={<AddressBook />} />
            <Route path="/orders" element={<OrderHistory />} />
            {/* <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} /> */}
          </Route>

          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* ADMIN */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="dashboard/products" element={<AdminProduct />} />
            <Route path="dashboard/orders" element={<AdminOrder />} />
            <Route path="dashboard/profile" element={<Profile />} />
            <Route path="dashboard/orders" element={<OrderManagement />} />
          </Route>
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
