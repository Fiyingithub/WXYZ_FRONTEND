import { useNavigate } from "react-router-dom";
import { FaBell, FaBars, FaHome } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";

interface NavbarDashboardProps {
  toggleSidebar: () => void;
}

const NavbarDashboard = ({ toggleSidebar }: NavbarDashboardProps) => {
  const navigate = useNavigate();
  const menuItems =  [
    { name: "Home", icon: <FaHome className="text-2xl" />, tooltip: "Home" },
    { name: "Notifications", icon: <FaBell className="text-2xl" />, tooltip: "Notifications" }
  ];

  const handleLogout = () => {
    // localStorage.removeItem("tmcsMemberId");
    localStorage.removeItem("adminId");
    navigate('/login')
  }

  const handleMenuItemClick = (item: string) => {
    if(item === 'Home'){
      navigate('/admin/dashboard')
    }
  }

  return (
    <nav className="w-full bg-[#f2592b] lg:border-s text-gray-100 flex items-center justify-between lg:justify-end px-6 py-6 z-50">
      <div className="text-xl font-bold lg:hidden cursor-pointer">
        <button onClick={toggleSidebar}>
          <FaBars className="text-2xl" />
        </button>
      </div>
      {/* <div className="text-xl font-bold hidden lg:block">
        {role === "admin" ? "Admin Panel" : "Staff Panel"}
      </div> */}
      
      <div className="flex items-center space-x-6">
        {menuItems.map((item, index) => (
          <button 
            key={index} 
            className="flex items-center space-x-2 hover:text-blue-300 relative group"
            onClick={() => handleMenuItemClick(item.name)}
          >
            {item.icon}
            {/* Tooltip */}
            <span className="absolute top-5 right-1 bottom-full mb-1 hidden group-hover:flex items-center justify-center bg-gray-700 text-white text-xs rounded py-3 px-2">
              {item.tooltip}
            </span>
          </button>
        ))}
        {/* Profile and Logout Options */}
        <button className="flex items-center space-x-2 hover:text-blue-300" onClick={handleLogout}>
          <FiLogOut className="text-2xl" />
          <span className="hidden md:inline">Logout</span> 
        </button>
      </div>
    </nav>
  );
};

export default NavbarDashboard;
