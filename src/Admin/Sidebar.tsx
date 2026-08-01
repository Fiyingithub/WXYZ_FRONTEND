import { Link, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaExchangeAlt,
  FaMoneyBillWave,
  FaUserCircle,
  FaSignOutAlt,
  FaSun,
  FaMoon,
} from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import "../Styles/customScrollbar.css";
import logo from "../Asset/images/wxyz_logo.png";

interface SidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar?: () => void;
}

const Sidebar = ({
  isSidebarOpen,
  toggleSidebar,
  closeSidebar,
}: SidebarProps) => {
  const location = useLocation();
  const handleClose = closeSidebar ?? toggleSidebar;

  const isActive = (path: string) => location.pathname === path;

  return (
    <div>
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 lg:hidden ${
          isSidebarOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={handleClose}
      />

      <aside
        className={`customScrollbar fixed inset-y-0 left-0 z-50 flex w-64 flex-col overflow-y-auto bg-[#f2592b] text-white transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-2 top-4 z-50 text-4xl text-white lg:hidden"
          aria-label="Close sidebar"
        >
          <IoMdClose />
        </button>

        <div className="flex items-center space-x-3 border-b border-gray-700 p-4">
          <img
            src={logo}
            alt="Logo"
            className="h-10 w-10 rounded-full bg-white p-1"
          />
          <span className="text-lg font-semibold">ADMIN PANEL</span>
        </div>

        <nav className="grow p-4">
          <ul className="space-y-2">
            <li>
              <Link
                to="/admin/dashboard"
                onClick={handleClose}
                className={`flex items-center rounded-lg p-2 transition-colors hover:bg-gray-700 ${
                  isActive("/admin/dashboard") || isActive("/admin")
                    ? "bg-white/20 font-semibold ring-1 ring-white/30"
                    : ""
                }`}
              >
                <FaTachometerAlt className="mr-3" /> Dashboard
              </Link>
            </li>

            <li>
              <Link
                to="/admin/dashboard/profile"
                onClick={handleClose}
                className={`flex items-center rounded-lg p-2 transition-colors hover:bg-gray-700 ${
                  isActive("/admin/dashboard/profile")
                    ? "bg-white/20 font-semibold ring-1 ring-white/30"
                    : ""
                }`}
              >
                <FaUserCircle className="mr-3" /> Profile
              </Link>
            </li>

            <li>
              <Link
                to="/admin/dashboard/products"
                onClick={handleClose}
                className={`flex items-center rounded-lg p-2 transition-colors hover:bg-gray-700 ${
                  isActive("/admin/dashboard/products")
                    ? "bg-white/20 font-semibold ring-1 ring-white/30"
                    : ""
                }`}
              >
                <FaExchangeAlt className="mr-3" /> Products
              </Link>
            </li>

            <li>
              <Link
                to="/admin/dashboard/orders"
                onClick={handleClose}
                className={`flex items-center rounded-lg p-2 transition-colors hover:bg-gray-700 ${
                  isActive("/admin/dashboard/orders")
                    ? "bg-white/20 font-semibold ring-1 ring-white/30"
                    : ""
                }`}
              >
                <FaMoneyBillWave className="mr-3" /> Orders
              </Link>
            </li>
          </ul>
        </nav>

        <div className="border-t border-gray-700 p-4">
          <ul className="space-y-2">
            {/* <li className="flex items-center rounded-lg p-2 transition-colors hover:bg-gray-700">
              <FaQuestionCircle className="mr-3" />
              <span>Help</span>
            </li> */}
            <li className="flex items-center rounded-lg p-2 transition-colors hover:bg-gray-700 cursor-pointer">
              <FaSignOutAlt className="mr-3" />
              <span>Logout</span>
            </li>
          </ul>

          <div className="mt-4 flex items-center justify-between rounded-full bg-gray-700 p-2">
            <FaSun className="text-yellow-300" />
            <FaMoon className="text-gray-300" />
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
