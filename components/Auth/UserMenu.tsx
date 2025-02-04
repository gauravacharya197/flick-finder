import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { UserOutlined } from "@ant-design/icons";
import { useAuth } from "@/app/context/AuthContext";

const UserMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLoggedIn, loading, logout } = useAuth();
  const menuRef = useRef(null);

  const handleMouseEnter = () => {
    setIsMenuOpen(true);
  };

  const handleMouseLeave = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  if (loading) {
    return <div className="w-[100px] invisible">Loading...</div>;
  }

  if (!isLoggedIn) {
    return (
      <Link
        href="/auth/login"
        className="flex items-center text-sm 2xl:text-lg gap-2 px-4 py-2 border border-primary text-primary rounded-md hover:bg-primary hover:text-black transition dark:border-primary dark:text-primary dark:hover:bg-teal-600 dark:hover:text-black"
      >
        Login
      </Link>
    );
  }

  return (
    <div 
      className="relative"
      ref={menuRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className="flex items-center gap-3 text-primary hover:text-primary-600 transition-colors"
        aria-expanded={isMenuOpen}
        aria-haspopup="true"
      >
        <UserOutlined />
        <svg
          className={`h-3 w-3 fill-waterloo transition-transform duration-300 ${
            isMenuOpen ? 'rotate-180' : ''
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
        </svg>
      </button>

      <ul 
        className={`absolute right-0 mt-2 w-48 bg-black text-white dark:bg-gray-800 shadow-lg rounded-md z-50 transition-all duration-300 ${
          isMenuOpen 
            ? 'opacity-100 visible transform translate-y-0' 
            : 'opacity-0 invisible transform -translate-y-2'
        }`}
      >
        <li>
          <Link
            href="/watchlist"
            className="block px-4 py-3 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-300 transition-colors"
          >
            Watchlist
          </Link>
        </li>
        <li>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-3 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-300 transition-colors"
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default UserMenu;