import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { Navigate } from 'react-router-dom';
// import { ToastProvider } from './Loaders/ToastContext';

// Components
import LandingPage from "./Pages/Landing/LandingPage";
import { ToastProvider } from "./Loaders/ToastContext";
import Cart from "./Cart/Cart";
import OrderStatus from "./Orders/OrderStatus";
import Checkout from "./Cart/Checkout";
import SortedProductDisplay from "./Products/SortedProductDisplay";
import ProductDetails from "./Products/ProductDetails";
import SignupPage from "./Auth/SignupPage";
import LoginPage from "./Auth/LoginPage";
import Example from "./Pages/Example";
// import SortedProductDisplay from './Products/SortedProductDisplay';
// import ProductDetails from './Products/ProductDetails';
// import SignupPage from './Auth/SignupPage';
// import LoginPage from './Auth/LoginPage';

// Orders
// import OrderStatus from './Orders/OrderStatus';
// import Cart from './Cart/Cart';
// import Checkout from './Cart/Checkout';

// // Admin
import Dashboard from './Admin/Dashboard';
import AddProduct from './Admin/ManageProduct/AddProduct';
import ViewProducts from './Admin/ManageProduct/ViewProducts';
// import ProductInventory from './Admin/ManageProduct/ProductInventory';

// import Example from './Pages/Example'

// const ProtectedRoute = ({ children }) => {
//   const token = localStorage.getItem('tmcsMemberId');
//   return token ? children : <Navigate to="/login" />;
// };

function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          {/* <Route path="/products" element={<SortedProductDisplay />} /> */}
          {/* <Route path="/productdetails" element={<ProductDetails />} /> */}
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} /> 
          <Route path="/example" element={<Example />} />

          {/* Orders */}
          <Route path="/orderstatus" element={<OrderStatus />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout/summary" element={<Checkout />} />

          {/* ADMIN */}
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/dashboard/addProduct" element={<AddProduct />} />
          <Route path="/admin/dashboard/viewProduct" element={<ViewProducts />} />

        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
