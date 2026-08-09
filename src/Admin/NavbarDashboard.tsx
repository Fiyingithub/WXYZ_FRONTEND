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
  
  const name = user?.name || "Flecky Afolabi";
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
            className="hidden lg:flex items-center space-x-2 hover:text-orange-100 relative group transition-colors"
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
    <div className="relative shrink-0">
      <div
        className={`absolute -inset-0.5 rounded-full bg-linear-to-tr from-white/80 via-white/20 to-transparent transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        className="relative w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm text-white shadow-inner ring-2 ring-white/40"
        style={{ background: `linear-gradient(135deg, hsl(${hue}, 70%, 50%), hsl(${(hue + 45) % 360}, 70%, 40%))` }}
      >
        {initials || <FaUserCircle className="text-xl" />}
      </div>
      <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#f2592b]" />
    </div>

    <div className="hidden md:flex flex-col items-start leading-tight">
      <span className="text-sm font-semibold truncate max-w-30">{name || username}</span>
      <span className="text-[11px] text-white/70 truncate max-w-30">
        {email ?? `@${username}`}
      </span>
    </div>

    <FaChevronDown
      className={`text-xs text-white/80 transition-transform duration-200 ${
        isMenuOpen ? "rotate-180" : ""
      }`}
    />
  </button>

  {/* Dropdown */}
  <div
    className={`absolute right-0 mt-3 w-72 origin-top-right rounded-2xl bg-white/95 backdrop-blur-xl text-gray-700 shadow-2xl ring-1 ring-black/5 overflow-hidden transition-all duration-200 ${
      isMenuOpen
        ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
        : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
    }`}
  >
    {/* Header */}
    <div className="relative px-5 py-5 bg-linear-to-br from-[#f2592b] via-[#f2592b] to-[#c2410c] overflow-hidden">
      <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-white/10" />
      <div className="absolute -bottom-10 -left-6 w-24 h-24 rounded-full bg-white/5" />

      <div className="relative flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center font-semibold text-white text-lg ring-2 ring-white/60 shadow-lg shrink-0"
          style={{ background: `linear-gradient(135deg, hsl(${hue}, 70%, 50%), hsl(${(hue + 45) % 360}, 70%, 40%))` }}
        >
          {initials || <FaUserCircle className="text-2xl" />}
        </div>
        <div className="min-w-0">
          <p className="text-base font-bold text-white truncate">{name || username}</p>
          <p className="text-xs text-white/80 truncate">@{username}</p>
          {email && <p className="text-[11px] text-white/70 truncate">{email}</p>}
        </div>
      </div>
    </div>

    {/* Actions */}
    <div className="py-2">
      <button
        onClick={handleProfileClick}
        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-orange-50 hover:text-[#f2592b] transition-colors cursor-pointer group"
      >
        <span className="w-8 h-8 rounded-lg bg-orange-50 group-hover:bg-orange-100 flex items-center justify-center transition-colors">
          <FaUserCircle className="text-base text-[#f2592b]" />
        </span>
        View Profile
      </button>
      <div className="my-1 mx-4 border-t border-gray-100" />
      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors cursor-pointer group"
      >
        <span className="w-8 h-8 rounded-lg bg-red-50 group-hover:bg-red-100 flex items-center justify-center transition-colors">
          <FiLogOut className="text-base" />
        </span>
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