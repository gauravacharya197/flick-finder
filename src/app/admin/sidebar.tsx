"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaChartBar, FaCog, FaHome, FaBars, FaSignOutAlt } from "react-icons/fa";

const menuItems = [
  { name: "Dashboard", href: "/admin", icon: FaHome },
  { name: "Videos", href: "/admin/videos", icon: FaChartBar },
  { name: "Settings", href: "/admin/settings", icon: FaCog },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div className={`h-screen bg-white shadow-lg flex flex-col transition-all duration-300 ${collapsed ? "w-20" : "w-64"}`}>
      {/* Sidebar Header with Toggle Button */}
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && <span className="text-xl font-bold text-gray-700">Admin</span>}
        <button 
          onClick={() => setCollapsed(!collapsed)} 
          className="p-2 text-gray-700 hover:bg-gray-200 rounded"
        >
          <FaBars />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-2 py-4 space-y-2">
        {menuItems.map((item) => (
          <Link key={item.href} href={item.href} className={`flex items-center p-3 rounded-lg transition ${
              pathname === item.href ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-200"
            }`}>
            <item.icon className="text-xl" />
            <span className={`ml-3 transition-all ${collapsed ? "hidden" : "block"}`}>{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="mt-auto px-2 py-4">
        <button className="w-full flex items-center justify-center p-3 bg-red-500 text-white rounded-lg hover:bg-red-600">
          <FaSignOutAlt className="text-xl" />
          <span className={`ml-3 transition-all ${collapsed ? "hidden" : "block"}`}>Logout</span>
        </button>
      </div>
    </div>
  );
}
