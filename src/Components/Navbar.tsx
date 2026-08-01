import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Icons
import {  FaUserCircle, FaSignOutAlt,FaClipboardList, FaHeart } from "react-icons/fa";
import { MdOutlineShoppingCart } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import { TiThMenu } from "react-icons/ti";
import { IoClose } from "react-icons/io5";
import { HiOutlineUserGroup } from "react-icons/hi";

import logo from '../Asset/images/wxyz_logo.png';
import { useAuth } from '../Context/Auth/useAuth';

// Types
// interface User {
//   id: string;
//   username: string;
//   email: string;
//   role?: 'user' | 'admin' | 'vendor';
// }

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount] = useState(3); // This would come from your cart context
  
  const profileRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

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
            <Link to="/about" className="text-gray-700 hover:text-[#f2592b] font-medium transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-[#f2592b] font-medium transition-colors">
              Contact
            </Link>
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

            {/* Cart */}
            <Link 
              to="/cart" 
              className="relative p-2 text-gray-600 hover:text-[#f2592b] transition-colors"
            >
              <MdOutlineShoppingCart className="text-2xl" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#f2592b] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Profile / Auth */}
            <div className="relative" ref={profileRef}>
              {user ? (
                <>
                  {/* Logged In */}
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 p-1.5 rounded-full border border-[#f2592b]/10 bg-gray-50 hover:bg-gray-100  transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#f2592b] text-white flex items-center justify-center">
                      <span className="text-sm font-semibold uppercase">
                        {user.username?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <span className="hidden md:block text-sm font-medium text-gray-700">
                      {user.username}
                    </span>
                  </button>

                  {/* Profile Dropdown */}
                  {isProfileOpen && (
                    <div className="absolute -right-15 md:right-0 mt-2 w-56 bg-white rounded-lg shadow-lg ring-1 ring-black/5 py-1 overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">{user.username}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      
                      <button
                        onClick={() => handleNavigation('/profile')}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <FaUserCircle className="text-lg text-gray-400" />
                        My Profile
                      </button>
                      
                      <button
                        onClick={() => handleNavigation('/orders')}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <FaClipboardList className="text-lg text-gray-400" />
                        My Orders
                      </button>
                      
                      <button
                        onClick={() => handleNavigation('/wishlist')}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <FaHeart className="text-lg text-gray-400" />
                        Wishlist
                      </button>

                      {user.role === 'admin' && (
                        <button
                          onClick={() => handleNavigation('/admin')}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-t border-gray-100"
                        >
                          <HiOutlineUserGroup className="text-lg text-gray-400" />
                          Admin Dashboard
                        </button>
                      )}
                      
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
                      >
                        <FaSignOutAlt className="text-lg" />
                        Sign Out
                      </button>
                    </div>
                  )}
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
              to="/about" 
              className="block text-gray-700 hover:text-[#f2592b] font-medium transition-colors py-2 border-b border-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className="block text-gray-700 hover:text-[#f2592b] font-medium transition-colors py-2 border-b border-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            
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
    </nav>
  );
};

export default Navbar;