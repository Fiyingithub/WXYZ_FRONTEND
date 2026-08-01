import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { Navigate } from 'react-router-dom';
// import { ToastProvider } from './Loaders/ToastContext';

// Components
import LandingPage from "./Pages/Landing/LandingPage";
import { ToastProvider } from "./Loaders/ToastContext";
import Cart from "./Cart/Cart";
import OrderStatus from "./Orders/OrderStatus";
import Checkout from "./Cart/Checkout";
// import SortedProductDisplay from "./Products/SortedProductDisplay";
// import ProductDetails from "./Products/ProductDetails";
import SignupPage from "./Auth/SignupPage";
import LoginPage from "./Auth/LoginPage";
import Example from "./Pages/Example";
// import SortedProductDisplay from './Products/SortedProductDisplay';
import ProductDetails from "./Products/ProductDetails";
// import SignupPage from './Auth/SignupPage';
// import LoginPage from './Auth/LoginPage';

// Orders
// import OrderStatus from './Orders/OrderStatus';
// import Cart from './Cart/Cart';
// import Checkout from './Cart/Checkout';

// // Admin
import Dashboard from "./Admin/Dashboard";
import AdminProduct from "./Admin/ManageProduct/AdminProduct";
import AdminOrder from "./Admin/order/AdminOrder";
import { AdminLayout } from "./Layouts/AdminLayouts";
import AdminProfile from "./Admin/profile/AdminProfile";
import SortedProductDisplay from "./Products/SortedProductDisplay";
import CustomerProfile from "./Pages/user/CustomerProfile";
import ProtectedRoute from "./utils/ProtectedRoute";

function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/products" element={<SortedProductDisplay />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/example" element={<Example />} />
          <Route path="/profile" element={<CustomerProfile />} />

          {/* Orders */}
          <Route path="/orderstatus" element={<OrderStatus />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout/summary" element={<Checkout />} />

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
            <Route path="dashboard/profile" element={<AdminProfile />} />
          </Route>
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
