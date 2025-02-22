"use client";

import { FaBell, FaUserCircle } from "react-icons/fa";



export default function Navbar() {
  return (
    <nav className="flex items-center justify-between bg-white shadow-md px-6 py-4">
      {/* Left Side - Page Title */}
      <h1 className="text-lg font-semibold text-gray-700"> Dashboard</h1>

      {/* Right Side - Notifications & Profile */}
      <div className="flex items-center gap-4">
        {/* Notification Icon */}
      

        {/* Profile Icon */}
        <div className="flex items-center gap-2 cursor-pointer">
          <FaUserCircle className="text-2xl text-gray-600" />
          <span className="text-gray-700 font-medium">Admin</span>
        </div>
      </div>
    </nav>
  );
}
