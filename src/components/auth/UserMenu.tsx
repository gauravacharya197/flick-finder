import React, { useState, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import {
  FaBookmark,
  FaHistory,
  FaSignInAlt,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";

const UserMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLoggedIn, loading, logout } = useAuth();
  const menuRef = useRef(null);

  const handleToggleMenu = () => setIsMenuOpen((prev) => !prev);
  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  // if (loading) return ;

  const menuItems = [
    { href: "/history", icon: <FaHistory className="w-4 h-4" />, label: "History" },
    isLoggedIn && { href: "/watchlist", icon: <FaBookmark className="w-4 h-4" />, label: "Watchlist" },
    isLoggedIn
      ? { href: "#", onClick: handleLogout, icon: <FaSignOutAlt className="w-4 h-4" />, label: "Logout" }
      : { href: "/auth/login", icon: <FaSignInAlt className="w-4 h-4" />, label: "Login" },
  ].filter((item): item is { href: string; icon: JSX.Element; label: string; onClick?: () => void } => Boolean(item));

  return (
    <div className="relative" ref={menuRef}  onClick={handleToggleMenu}
    onMouseEnter={()=>setIsMenuOpen(true)}
    onMouseLeave={()=>setIsMenuOpen(false)}>
      <button
        className="flex items-center gap-3 text-primary transition-colors hover:text-primary-400"
        aria-expanded={isMenuOpen}
        aria-haspopup="true"
        
      >
        <FaUser className="text-lg" />
        <svg
          className={`h-3 w-3 fill-waterloo transition-transform duration-300 ${isMenuOpen ? "rotate-180" : ""}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
        </svg>
      </button>

      <ul
        className={`absolute right-0 z-50 mt-2 w-40 rounded-md bg-[#111827] text-white shadow-lg transition-all duration-300 ${
          isMenuOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-2 opacity-0"
        }`}
      >
        {menuItems.map(({ href, onClick, icon, label }, index) => (
          <Link
            key={index}
            href={href}
            onClick={onClick}
            className="flex items-center gap-3 px-4 py-2 transition duration-300 hover:bg-gray-800 hover:text-primary"
          >
            {icon}
            <span>{label}</span>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default UserMenu;
