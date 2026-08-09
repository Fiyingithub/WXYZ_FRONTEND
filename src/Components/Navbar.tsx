import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store/store';
import { getCartAction } from '../store/Users/cart/cartAction';

// Icons
import { FaUserCircle, FaSignOutAlt, FaClipboardList } from "react-icons/fa";
import { MdOutlineShoppingCart } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import { TiThMenu } from "react-icons/ti";
import { IoClose } from "react-icons/io5";
import { HiOutlineUserGroup } from "react-icons/hi";

import logo from '../Asset/images/wxyz_logo.png';
import { useAuth } from '../Context/Auth/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Cart count now comes from the same Redux slice AllProducts/ProductDetails/
  // CartPage read and write, instead of the separate cart Context — so the
  // badge stays in sync no matter where an item was added or removed.
  const cartCount = useSelector((state: RootState) => state.getCart.totalItems);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const profileRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Display name: prefer a full name field if the user object has one,
  // fall back to username so this still works if `name` isn't set.
  const displayName = (user as any)?.name || user?.username || 'User';
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part: string) => part.charAt(0))
    .join('')
    .toUpperCase();

  const hue = (() => {
    const seed = user?.username || displayName;
    let hash = 0;
    for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    return Math.abs(hash) % 360;
  })();

  // Hydrate the cart on first load (and whenever the user logs in) since
  // Navbar mounts once for the whole app and needs an accurate count
  // before any product page has dispatched anything.
  useEffect(() => {
    if (user) {
      dispatch(getCartAction());
    }
  }, [dispatch, user]);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle logout
  const handleLogout = async () => {
    await logout();
    setIsProfileOpen(false);
    navigate('/');
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  // Handle navigation
  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          
          {/* Logo */}
          <div 
            className="shrink-0 cursor-pointer flex items-center"
            onClick={() => navigate('/')}
          >
            <img src={logo} alt="WXYZ Logo" className="h-10 lg:h-12 w-auto" />
            <span className="ml-2 text-xl font-bold text-[#f2592b] hidden sm:block">WXYZ</span>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-[#f2592b] font-medium transition-colors">
              Home
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-[#f2592b] font-medium transition-colors">
              Shop
            </Link>
            {/* <Link to="/contact" className="text-gray-700 hover:text-[#f2592b] font-medium transition-colors">
              Contact
            </Link> */}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            
            {/* Search - Desktop */}
            <form 
              onSubmit={handleSearch}
              className="hidden lg:flex items-center bg-gray-100 rounded-full px-4 py-1.5 focus-within:ring-2 focus-within:ring-[#f2592b]/40"
            >
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent outline-none text-sm w-48 xl:w-64"
              />
              <button type="submit" className="text-gray-500 hover:text-[#f2592b]">
                <IoSearch className="text-xl" />
              </button>
            </form>

            {/* Search - Mobile Toggle */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-[#f2592b] transition-colors"
            >
              <IoSearch className="text-xl" />
            </button>

            {/* Cart - Now connected to Redux cart state */}
            <Link 
              to="/cart" 
              className="relative p-2 text-gray-600 hover:text-[#f2592b] transition-colors"
            >
              <MdOutlineShoppingCart className="text-2xl" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#f2592b] text-white text-xs font-bold rounded-full min-w-5 h-5 flex items-center justify-center px-1.5 animate-pulse-once">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            {/* User Profile / Auth */}
            <div className="relative" ref={profileRef}>
              {user ? (
                <>
                  {/* Logged In — fancy trigger */}
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className={`flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full border transition-all duration-200 cursor-pointer ${
                      isProfileOpen
                        ? 'border-[#f2592b]/30 bg-orange-50'
                        : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <div
                        className={`absolute -inset-0.5 rounded-full bg-linear-to-tr from-[#f2592b]/60 via-[#f2592b]/10 to-transparent transition-opacity duration-300 ${
                          isProfileOpen ? 'opacity-100' : 'opacity-0'
                        }`}
                      />
                      <div
                        className="relative w-8 h-8 rounded-full flex items-center justify-center text-white shadow-sm ring-2 ring-white"
                        style={{
                          background: `linear-gradient(135deg, hsl(${hue}, 70%, 50%), hsl(${(hue + 45) % 360}, 70%, 40%))`,
                        }}
                      >
                        <span className="text-xs font-semibold uppercase">
                          {initials || 'U'}
                        </span>
                      </div>
                      <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-gray-50" />
                    </div>
                    <span className="hidden md:block text-sm font-medium text-gray-700 max-w-28 truncate">
                      {displayName}
                    </span>
                  </button>

                  {/* Profile Dropdown */}
                  <div
                    className={`absolute right-0 mt-3 w-64 origin-top-right rounded-2xl bg-white/95 backdrop-blur-xl shadow-2xl ring-1 ring-black/5 overflow-hidden transition-all duration-200 ${
                      isProfileOpen
                        ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                        : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                    }`}
                  >
                    {/* Header card */}
                    <div className="relative px-5 py-5 bg-linear-to-br from-[#f2592b] via-[#f2592b] to-[#c2410c] overflow-hidden">
                      <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-white/10" />
                      <div className="absolute -bottom-10 -left-6 w-24 h-24 rounded-full bg-white/5" />

                      <div className="relative flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center font-semibold text-white text-lg ring-2 ring-white/60 shadow-lg shrink-0"
                          style={{
                            background: `linear-gradient(135deg, hsl(${hue}, 70%, 50%), hsl(${(hue + 45) % 360}, 70%, 40%))`,
                          }}
                        >
                          {initials || <FaUserCircle className="text-2xl" />}
                        </div>
                        <div className="min-w-0">
                          <p className="text-base font-bold text-white truncate">{displayName}</p>
                          {user.username && (
                            <p className="text-xs text-white/80 truncate">@{user.username}</p>
                          )}
                          {user.email && (
                            <p className="text-[11px] text-white/70 truncate">{user.email}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="py-2">
                      <button
                        onClick={() => handleNavigation('/profile')}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#f2592b] transition-colors cursor-pointer group"
                      >
                        <span className="w-8 h-8 rounded-lg bg-gray-50 group-hover:bg-orange-100 flex items-center justify-center transition-colors">
                          <FaUserCircle className="text-base text-gray-400 group-hover:text-[#f2592b]" />
                        </span>
                        My Profile
                      </button>

                      <button
                        onClick={() => handleNavigation('/orders')}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#f2592b] transition-colors cursor-pointer group"
                      >
                        <span className="w-8 h-8 rounded-lg bg-gray-50 group-hover:bg-orange-100 flex items-center justify-center transition-colors">
                          <FaClipboardList className="text-base text-gray-400 group-hover:text-[#f2592b]" />
                        </span>
                        My Orders
                      </button>

                      {/* <button
                        onClick={() => handleNavigation('/wishlist')}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#f2592b] transition-colors cursor-pointer group"
                      >
                        <span className="w-8 h-8 rounded-lg bg-gray-50 group-hover:bg-orange-100 flex items-center justify-center transition-colors">
                          <FaHeart className="text-base text-gray-400 group-hover:text-[#f2592b]" />
                        </span>
                        Wishlist
                      </button> */}

                      {user.role === 'admin' && (
                        <>
                          <div className="my-1 mx-4 border-t border-gray-100" />
                          <button
                            onClick={() => handleNavigation('/admin')}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#f2592b] transition-colors cursor-pointer group"
                          >
                            <span className="w-8 h-8 rounded-lg bg-gray-50 group-hover:bg-orange-100 flex items-center justify-center transition-colors">
                              <HiOutlineUserGroup className="text-base text-gray-400 group-hover:text-[#f2592b]" />
                            </span>
                            Admin Dashboard
                          </button>
                        </>
                      )}

                      <div className="my-1 mx-4 border-t border-gray-100" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors cursor-pointer group"
                      >
                        <span className="w-8 h-8 rounded-lg bg-red-50 group-hover:bg-red-100 flex items-center justify-center transition-colors">
                          <FaSignOutAlt className="text-base" />
                        </span>
                        Sign Out
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                /* Not Logged In */
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigate('/login')}
                    className="hidden sm:block text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 hover:transition-colors border border-gray-400 cursor-pointer rounded-full px-3 py-1.5"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => navigate('/signup')}
                    className="bg-green-700 text-white cursor-pointer text-sm font-medium px-4 py-1.5 rounded-full hover:bg-green-800 transition-colors"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-[#f2592b] transition-colors"
            >
              {isMenuOpen ? <IoClose className="text-2xl" /> : <TiThMenu className="text-2xl" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="lg:hidden py-3 border-t border-gray-100">
            <form onSubmit={handleSearch} className="flex items-center bg-gray-100 rounded-full px-4 py-2">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm"
                autoFocus
              />
              <button type="submit" className="text-gray-500 hover:text-[#f2592b]">
                <IoSearch className="text-xl" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div 
          ref={menuRef}
          className="lg:hidden bg-white border-t border-gray-100 shadow-lg"
        >
          <div className="px-4 py-4 space-y-3">
            {user && (
              <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white ring-2 ring-white shadow-sm shrink-0"
                  style={{
                    background: `linear-gradient(135deg, hsl(${hue}, 70%, 50%), hsl(${(hue + 45) % 360}, 70%, 40%))`,
                  }}
                >
                  <span className="text-sm font-semibold uppercase">{initials || 'U'}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{displayName}</p>
                  {user.email && (
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  )}
                </div>
              </div>
            )}

            <Link 
              to="/" 
              className="block text-gray-700 hover:text-[#f2592b] font-medium transition-colors py-2 border-b border-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/products" 
              className="block text-gray-700 hover:text-[#f2592b] font-medium transition-colors py-2 border-b border-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Shop
            </Link>
            <Link 
              to="/orders" 
              className="block text-gray-700 hover:text-[#f2592b] font-medium transition-colors py-2 border-b border-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Orders
            </Link>
            {/* <Link 
              to="/contact" 
              className="block text-gray-700 hover:text-[#f2592b] font-medium transition-colors py-2 border-b border-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link> */}
            
            {/* Show cart items count in mobile menu too */}
            {cartCount > 0 && (
              <div className="flex items-center justify-between py-2 border-b border-gray-50">
                <span className="text-gray-700 font-medium">Cart Items</span>
                <span className="bg-[#f2592b] text-white text-xs font-bold rounded-full px-2.5 py-1">
                  {cartCount}
                </span>
              </div>
            )}

            {user && (
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 justify-center text-red-500 font-medium py-2 border border-red-200 rounded-full hover:bg-red-50 transition-colors"
              >
                <FaSignOutAlt />
                Sign Out
              </button>
            )}
            
            {!user && (
              <div className="pt-2 flex flex-col space-y-2">
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate('/login');
                  }}
                  className="w-full text-center border border-[#f2592b] text-[#f2592b] font-medium py-2 rounded-full hover:bg-[#f2592b] hover:text-white transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate('/signup');
                  }}
                  className="w-full text-center bg-[#f2592b] text-white font-medium py-2 rounded-full hover:bg-green-700 transition-colors"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add CSS animation for cart badge */}
      <style>{`
        @keyframes pulse-once {
          0% { transform: scale(1); }
          50% { transform: scale(1.3); }
          100% { transform: scale(1); }
        }
        .animate-pulse-once {
          animation: pulse-once 0.3s ease-in-out;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;