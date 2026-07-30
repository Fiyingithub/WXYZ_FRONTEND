import { useState } from 'react';
import {Link} from 'react-router-dom'
import { FaTachometerAlt, FaExchangeAlt,  FaMoneyBillWave, FaChartLine, FaCog, FaQuestionCircle, FaSignOutAlt, FaSun, FaMoon } from 'react-icons/fa';
import { IoMdClose } from "react-icons/io";
// FaPlus,
import { IoMdArrowDropdown, IoMdArrowDropright } from 'react-icons/io';
import '../Styles/customScrollbar.css';
import logo from '../Asset/images/wxyz_logo.png'

interface SidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar = ({isSidebarOpen, toggleSidebar}: SidebarProps) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  // const [isNewDropdownOpen, setNewDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);
  // const toggleNewDropdown = () => setNewDropdownOpen(!isNewDropdownOpen);

  return (
    <div>
      {/* Overlay for mobile sidebar */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-all duration-1000"
        onClick={toggleSidebar}
        style={
          isSidebarOpen
            ? {
                transition: "all 1s ease",
                visibility: "visible",
                opacity: "100%",
              }
            : { transition: "all 1s ease", visibility: "hidden", opacity: "0" }
        }
      ></div>
      

      {/* desktop */}
      <div className={`hidden lg:grid h-screen bg-gray-100 md:grid md:grid-cols-[16rem_1fr] z-50`}>
        <aside className="customScrollbar w-60.5 bg-[#f2592b] text-white flex flex-col fixed h-screen overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center space-x-3 p-4 border-b border-gray-700">
            <img src={logo} alt="Logo" className="w-10 h-10 rounded-full bg-white p-1" />
            <span className="text-lg font-semibold">ADMIN PANEL</span>
          </div>

          {/* Navigation */}
          <nav className="grow p-4">
            <ul className="space-y-2">
              {/* Dashboard */}
              <li>
                <Link to={'/admin/dashboard'} className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors"><FaTachometerAlt className="mr-3" /> Dashboard</Link>
              </li>

              {/* Products with Sub-menu */}
              <li>
                <div
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
                  onClick={toggleDropdown}
                >
                  <div className="flex items-center">
                    <FaExchangeAlt className="mr-3" />
                    <span>Products</span>
                  </div>
                  {isDropdownOpen ? <IoMdArrowDropdown /> : <IoMdArrowDropright />}
                </div>
                {isDropdownOpen && (
                  <ul className="pl-10 mt-2 space-y-1">
                    <li className="p-2 rounded-lg hover:bg-gray-700 transition-colors duration-600">
                      <Link to="/admin/dashboard/addProduct">Add Products</Link>
                    </li>
                    <li className="p-2 rounded-lg hover:bg-gray-700 transition-colors duration-600">
                      <Link to="/admin/dashboard/viewProduct">View Products</Link>
                    </li>
                  </ul>
                )}
              </li>

              {/* Budget */}
              {/* <li className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors">
                <FaMoneyBillWave className="mr-3" />
                <span>Budget</span>
              </li> */}

              {/* Analytics */}
              {/* <li className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors">
                <FaChartLine className="mr-3" />
                <span>Analytics</span>
              </li> */}

              {/* Settings */}
              <li className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors">
                <FaCog className="mr-3" />
                <span>Settings</span>
              </li>
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-700">
            <ul className="space-y-2">
              <li className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors">
                <FaQuestionCircle className="mr-3" />
                <span>Help</span>
              </li>
              <li className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors">
                <FaSignOutAlt className="mr-3" />
                <span>Logout</span>
              </li>
            </ul>

            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between mt-4 p-2 bg-gray-700 rounded-full cursor-pointer">
              <FaSun className="text-yellow-300" />
              <FaMoon className="text-gray-300" />
            </div>
          </div>
        </aside>
      </div>

      {/* Mobile */}
      <aside className={`customScrollbar w-60 bg-primary text-white flex flex-col fixed h-screen overflow-y-auto z-50 ${
          isSidebarOpen
            ? "translate-x-0 duration-1000"
            : "-translate-x-full duration-1000"
        }`}>
        
        <IoMdClose onClick={toggleSidebar} className='absolute top-4 right-2 text-4xl text-white z-50 bg-primary'/>

        {/* Logo */}
        <div className="flex items-center space-x-3 p-4 border-b border-gray-700">
          <img src={logo} alt="Logo" className="w-10 h-10 rounded-full bg-white p-1" />
          <span className="text-lg font-semibold">One World</span>
        </div>

        {/* Navigation */}
        <nav className="grow p-4">
          <ul className="space-y-2">
            {/* Dashboard */}
            <li>
              <Link to={'/admin/dashboard'} className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors"><FaTachometerAlt className="mr-3" /> Dashboard</Link>
            </li>

            {/* Products with Sub-menu */}
            <li>
              <div
                className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
                onClick={toggleDropdown}
              >
                <div className="flex items-center">
                  <FaExchangeAlt className="mr-3" />
                  <span>Products</span>
                </div>
                {isDropdownOpen ? <IoMdArrowDropdown /> : <IoMdArrowDropright />}
              </div>
              {isDropdownOpen && (
                <ul className="pl-10 mt-2 space-y-1">
                  <li className="p-2 rounded-lg hover:bg-gray-700 transition-colors duration-600">
                    <Link to="/admin/dashboard/addProduct">Add Products</Link>
                  </li>
                  <li className="p-2 rounded-lg hover:bg-gray-700 transition-colors duration-600">
                    <Link to="/admin/dashboard/viewProduct">View Products</Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Budget */}
            <li className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors">
              <FaMoneyBillWave className="mr-3" />
              <span>Budget</span>
            </li>

            {/* Analytics */}
            <li className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors">
              <FaChartLine className="mr-3" />
              <span>Analytics</span>
            </li>

            {/* Settings */}
            <li className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors">
              <FaCog className="mr-3" />
              <span>Settings</span>
            </li>
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700">
          <ul className="space-y-2">
            <li className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors">
              <FaQuestionCircle className="mr-3" />
              <span>Help</span>
            </li>
            <li className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors">
              <FaSignOutAlt className="mr-3" />
              <span>Logout</span>
            </li>
          </ul>

          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between mt-4 p-2 bg-gray-700 rounded-full cursor-pointer">
            <FaSun className="text-yellow-300" />
            <FaMoon className="text-gray-300" />
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;