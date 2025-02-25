"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FaChartBar, FaCog, FaHome, FaBars, FaSignOutAlt, FaBackward } from "react-icons/fa";
import { removeAuthCookie } from "@/utils/auth";
import { FaBarsProgress } from "react-icons/fa6";
import { useAuth } from "../context/AuthContext";
import { PiKeyReturnLight } from "react-icons/pi";

const menuItems = [
  { name: "Dashboard", href: "/admin", icon: FaHome },
  { name: "Videos", href: "/admin/videos", icon: FaChartBar },
  { name: "Feature", href: "/admin/featured-movies", icon: FaBarsProgress },
];

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export default function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const {logout} = useAuth();
  const handleSignOut = () => {
    removeAuthCookie();
    logout()
  

    router.push("/admin/signin");
  };

  return (
    <aside 
      className={`
        fixed top-0 left-0 h-screen bg-white shadow-lg
        z-40 transition-[width] duration-300 ease-in-out
        ${collapsed ? 'w-16' : 'w-64'}
        flex flex-col
      `}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className={`
          overflow-hidden transition-opacity duration-200
          ${collapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}
        `}>
          <h1 className="text-xl font-semibold text-gray-800 whitespace-nowrap">Admin</h1>
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <FaBars />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:none]">
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
                  ${collapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}
                `}>
                  {item.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="mt-auto px-2 py-4">
      <Link href="/" className="w-full flex items-center mb-2 justify-center p-3 bg-primary-400  text-white rounded-lg ">
          <PiKeyReturnLight className="text-xl" />
          <span className={`ml-3 transition-all ${collapsed ? "hidden" : "block"}`}>Main</span>
        </Link>
        <button onClick={handleSignOut} className="w-full flex items-center justify-center p-3 bg-red-500 text-white rounded-lg hover:bg-red-600">
          <FaSignOutAlt className="text-xl" />
          <span className={`ml-3 transition-all ${collapsed ? "hidden" : "block"}`}>Logout</span>
        </button>
        
      </div>
    </aside>
  );
}