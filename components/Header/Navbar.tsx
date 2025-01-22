import { useState } from "react";
import Link from "next/link";
import ThemeToggler from "./ThemeToggler";
import LoginPartial from "../Auth/LoginPartial";
import menuData from "./menuData";
import { SiteName } from "../Common/SiteName";

const MyNav = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-black bg-opacity-90 text-white dark:bg-gray-900 dark:text-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Hamburger Menu and Site Name */}
          <div className="flex items-center gap-4">
            <button
              className="rounded-md p-2 hover:bg-gray-800 dark:hover:bg-gray-700"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle Menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 5.75h16.5M3.75 12h16.5m-16.5 6.25h16.5"
                />
              </svg>
            </button>
            <Link
              href="/"
              className="rounded-md bg-primary px-3 py-1 text-sm font-bold text-black sm:text-xl dark:bg-primary dark:text-black"
              >
              <SiteName/>
            </Link>
          </div>

          {/* Search Bar for Larger Screens */} 
          <div className="mr-15 hidden flex-1 items-center justify-center gap-2 md:flex">
            <div className="flex items-center gap-2">
              <button className="h-10 flex items-center gap-2 rounded-md bg-white px-3 py-1 text-gray-400 transition hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 6.75h10.5m-10.5 5.25h7.5m-7.5 5.25h4.5M4.5 6.75h.008v.008H4.5V6.75zm0 5.25h.008v.008H4.5V12zm0 5.25h.008v.008H4.5v-.008z"
                  />
                </svg>
                Filter
              </button>
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-80 rounded-md bg-white px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
                />
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 transform text-primary"
                  aria-label="Search"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-4.35-4.35m0 0a7.5 7.5 0 1 0-10.606-10.606 7.5 7.5 0 0 0 10.606 10.606z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Small Screen Layout: Search Icon, Theme Toggler, and Login Button */}
          <div className="flex items-center gap-3 md:hidden">
            {/* Search Icon */}
            <button
              className="rounded-md p-2 hover:bg-gray-800 dark:hover:bg-gray-700"
              onClick={() => setShowSearch(!showSearch)}
              aria-label="Toggle Search"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-6 w-6 text-primary"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35m0 0a7.5 7.5 0 1 0-10.606-10.606 7.5 7.5 0 0 0 10.606 10.606z"
                />
              </svg>
            </button>

            {/* Theme Toggler */}
            <ThemeToggler />

            {/* Login Button */}
            <LoginPartial />
          </div>

          {/* Large Screen Layout */}
          <div className="hidden items-center gap-4 md:flex">
            {/* Theme Toggler */}
            <ThemeToggler />

            {/* Login Button */}
            <LoginPartial />
          </div>
        </div>
      </div>
            {/* Search Bar for Small Screens */}
            {showSearch && (
        <div className="bg-gray-900 p-4 dark:bg-gray-800 md:hidden">
          <div className="container mx-auto flex items-center gap-2">
            <button className="flex h-full items-center gap-2 rounded-md bg-white px-3 py-1 text-gray-400 transition hover:bg-gray-700 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 6.75h10.5m-10.5 5.25h7.5m-7.5 5.25h4.5M4.5 6.75h.008v.008H4.5V6.75zm0 5.25h.008v.008H4.5V12zm0 5.25h.008v.008H4.5v-.008z"
                />
              </svg>
              Filter
            </button>
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search..."
                className="w-full rounded-md bg-white px-4 py-2 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-gray-300 dark:placeholder-gray-500"
              />
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 transform text-primary"
                aria-label="Search"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35m0 0a7.5 7.5 0 1 0-10.606-10.606 7.5 7.5 0 0 0 10.606 10.606z"
                  />
                </svg>
              </button>
            </div>
            <button
              className="rounded-md p-2 text-red-500 hover:bg-gray-700 dark:hover:bg-gray-600"
              onClick={() => setShowSearch(false)}
              aria-label="Close Search"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Hamburger Menu Content */}
      {menuOpen && (
        <nav className ="text-white">
          <div className="container mx-auto px-4">
            <ul className="flex flex-col items-start space-y-2 p-4" onClick={()=>setMenuOpen(!menuOpen)}>
            {menuData.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.path || '#'}
                    className="hover:text-primary dark:hover:text-primary"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      )}
    </header>
  );
};

export default MyNav;
