import React, { useEffect, useState } from "react";
import Link from "next/link";
import { UserOutlined } from "@ant-design/icons";

const LoginPartial = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  let user;

  if (typeof window !== "undefined") {
    user = localStorage.getItem("user") || "";
  }

  useEffect(() => {
    if (user) {
      setIsLoggedIn(true);
    }
  }, [user]);

  useEffect(() => {
    // Close mobile menu on window resize
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {!isLoggedIn ? (
  <div className="relative">
    {/* Desktop View */}
    <div className="hidden md:block group relative">
      <button className="flex cursor-pointer items-center justify-between gap-3 text-primary hover:text-primary-600">
        <UserOutlined />
        <span>
          <svg
            className="h-3 w-3 cursor-pointer fill-waterloo group-hover:fill-primary transition-colors"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
          </svg>
        </span>
      </button>
      <ul className="absolute right-0 mt-2 w-48 bg-black dark:bg-gray-800 shadow-lg rounded-md opacity-0 invisible 
                         group-hover:opacity-100 group-hover:visible
                         transition-all duration-300 ease-in-out
                         z-50">
        <li className="px-4 py-2 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-300">
          <Link href="/watchlist" className="block w-full">Watchlist</Link>
        </li>
        <li className="px-4 py-2 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-300">
          <Link href="/seen" className="block w-full">Seen</Link>
        </li>
        <li className="px-4 py-2 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-300">
          <a href="#" onClick={handleLogout} className="block w-full">Logout</a>
        </li>
      </ul>
    </div>

    {/* Mobile View */}
    <div className="md:hidden">
      <button 
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="flex cursor-pointer items-center justify-between gap-3 hover:text-primary p-2"
      >
        <UserOutlined />
        <span>
          <svg
            className={`h-3 w-3 cursor-pointer fill-waterloo transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-180' : ''}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
          </svg>
        </span>
      </button>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <ul className="absolute right-0 mt-2 w-48 bg-black text-white dark:bg-gray-800 shadow-lg rounded-md z-50 animate-fadeIn">
          <li className="px-4 py-3 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-300 border-b">
            <Link href="/watchlist" className="block w-full">Watchlist</Link>
          </li>
          <li className="px-4 py-3 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-300 border-b">
            <Link href="/seen" className="block w-full">Seen</Link>
          </li>
          <li className="px-4 py-3 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-300">
            <a href="#" onClick={handleLogout} className="block w-full">Logout</a>
          </li>
        </ul>
      )}
    </div>
  </div>
) : (
  <Link
  href="/auth/login"
  className="flex items-center text-sm md:text-lg gap-2 px-4 py-2 border border-primary text-primary rounded-md hover:bg-primary hover:text-black transition dark:border-primary dark:text-primary dark:hover:bg-teal-600 dark:hover:text-black"
>
  Login
</Link>
      )}
    </>
  );
};

export default LoginPartial;