"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FaChartBar, FaCog, FaHome, FaBars, FaSignOutAlt, FaBackward, FaUsers } from "react-icons/fa";
import { removeAuthCookie } from "@/utils/auth";
import { FaBarsProgress } from "react-icons/fa6";
import { useAuth } from "../context/AuthContext";
import { PiKeyReturnLight } from "react-icons/pi";
import { useFetchAndDispatchFilters } from "@/hooks/useFetchDispatchFilter";

const menuItems = [
  { name: "Dashboard", href: "/admin", icon: FaHome },
  { name: "Videos", href: "/admin/videos", icon: FaChartBar },
  { name: "Feature", href: "/admin/featured-movies", icon: FaBarsProgress },
  { name: "Users", href: "/admin/users", icon: FaUsers },
];

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export default function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  useFetchAndDispatchFilters();
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  
  const handleSignOut = () => {
    removeAuthCookie();
    logout();
    router.push("/admin/signin");
  };

  return (
    <aside 
      className={`
        fixed top-0 left-0 h-full min-h-screen bg-white shadow-lg
        z-40 transition-[width] duration-300 ease-in-out
        ${collapsed ? 'w-16' : 'w-64'}
        flex flex-col
        overflow-x-hidden overflow-y-auto
      `}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b w-full">
        <div className={`
          overflow-hidden transition-opacity duration-200
          ${collapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}
        `}>
          <h1 className="text-xl font-semibold text-gray-800 whitespace-nowrap">Admin</h1>
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <FaBars />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-grow py-4 w-full">
        <ul className="space-y-2 px-2">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`
                  flex items-center px-4 py-2 rounded-lg transition-colors
                  ${pathname === item.href ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}
                `}
              >
                <item.icon className={collapsed ? 'mx-auto' : 'mr-3'} size={20} />
                <span className={`
                  whitespace-nowrap transition-opacity duration-200
                  ${collapsed ? 'opacity-0 w-0 hidden' : 'opacity-100 w-auto'}
                `}>
                  {item.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Section - Now with position:sticky */}
      <div className="sticky bottom-0 px-2 py-4 bg-white mt-auto border-t w-full">
        <Link href="/" className="mb-2 w-full flex items-center justify-center p-3 bg-primary-400 text-white rounded-lg">
          <PiKeyReturnLight className={collapsed ? "mx-auto" : "text-xl"} />
          <span className={`ml-3 ${collapsed ? "hidden" : "block"}`}>Main</span>
        </Link>
        <button 
          onClick={handleSignOut} 
          className="w-full flex items-center justify-center p-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          <FaSignOutAlt className={collapsed ? "mx-auto" : "text-xl"} />
          <span className={`ml-3 ${collapsed ? "hidden" : "block"}`}>Logout</span>
        </button>
      </div>
    </aside>
  );
}