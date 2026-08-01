import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell, FaBars, FaHome, FaUserCircle, FaChevronDown } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { useAuth } from "../Context/Auth/useAuth";

interface NavbarDashboardProps {
  toggleSidebar: () => void;
}

const NavbarDashboard = ({ toggleSidebar }: NavbarDashboardProps) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const menuItems = [
    { name: "Home", icon: <FaHome className="text-2xl" />, tooltip: "Home" },
    { name: "Notifications", icon: <FaBell className="text-2xl" />, tooltip: "Notifications" },
  ];

  const handleLogout = () => {
    // localStorage.removeItem("tmcsMemberId");
    logout();
    navigate("/login");
  };

  const handleMenuItemClick = (item: string) => {
    if (item === "Home") {
      navigate("/admin/dashboard");
    }
  };

  const handleProfileClick = () => {
    setIsMenuOpen(false);
    navigate("/admin/dashboard/profile");
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Deterministic hue from username/email, matching the shared avatar pattern
  const getHue = (seed: string) => {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash) % 360;
  };

  const username = user?.username || "Admin";
  const email = user?.email || "";
  const initials = username
    .split(" ")
    .map((part: string) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const hue = getHue(email || username);

  return (
    <nav className="fixed left-0 right-0 top-0 z-40 flex items-center justify-between bg-[#f2592b] px-6 py-3 border-b border-gray-800 text-gray-100 shadow-sm lg:left-64 lg:justify-end">
      <div className="text-xl font-bold lg:hidden cursor-pointer">
        <button onClick={toggleSidebar}>
          <FaBars className="text-2xl" />
        </button>
      </div>

      <div className="flex items-center space-x-6">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className="flex items-center space-x-2 hover:text-orange-100 relative group transition-colors"
            onClick={() => handleMenuItemClick(item.name)}
          >
            {item.icon}
            <span className="absolute top-5 right-1 bottom-full mb-1 hidden group-hover:flex items-center justify-center bg-gray-800 text-white text-xs rounded-lg py-2 px-3 shadow-lg whitespace-nowrap">
              {item.tooltip}
            </span>
          </button>
        ))}

        {/* Fancy user menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className={`flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer ${
              isMenuOpen ? "bg-white/20" : "bg-white/10 hover:bg-white/20"
            }`}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm text-white shadow-inner ring-2 ring-white/40 shrink-0"
              style={{ backgroundColor: `hsl(${hue}, 65%, 45%)` }}
            >
              {initials || <FaUserCircle className="text-xl" />}
            </div>
            <div className="hidden md:flex flex-col items-start leading-tight">
              <span className="text-sm font-semibold truncate max-w-30">{username}</span>
              {email && (
                <span className="text-[11px] text-white/70 truncate max-w-30">{email}</span>
              )}
            </div>
            <FaChevronDown
              className={`text-xs text-white/80 transition-transform duration-200 ${
                isMenuOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown */}
          <div
            className={`absolute right-0 mt-3 w-64 origin-top-right rounded-2xl bg-white text-gray-700 shadow-2xl ring-1 ring-black/5 overflow-hidden transition-all duration-200 ${
              isMenuOpen
                ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
            }`}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-4 bg-linear-to-br from-[#f2592b] to-[#f2592b]/80">
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center font-semibold text-white text-base ring-2 ring-white/50 shrink-0"
                style={{ backgroundColor: `hsl(${hue}, 65%, 45%)` }}
              >
                {initials || <FaUserCircle className="text-2xl" />}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">{username}</p>
                {email && <p className="text-xs text-white/80 truncate">{email}</p>}
              </div>
            </div>

            {/* Actions */}
            <div className="py-2">
              <button
                onClick={handleProfileClick}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-orange-50 hover:text-[#f2592b] transition-colors cursor-pointer"
              >
                <FaUserCircle className="text-lg" />
                Profile
              </button>
              <div className="my-1 border-t border-gray-100" />
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
              >
                <FiLogOut className="text-lg" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarDashboard;