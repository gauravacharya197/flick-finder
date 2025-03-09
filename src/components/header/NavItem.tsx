"use client";
// components/ui/NavItem.jsx
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MyTooltip } from "@/components/ui/MyTooltip";
import toast from "react-hot-toast";
import { useAuth } from "@/app/context/AuthContext";

const NavItem = ({
  item,

  closeMenu,
  isSidebar = false, // Flag to determine which styling to use
}) => {
  const pathname = usePathname();
  const isActive = pathname === item.path;
  const requiresLogin = item.requireLogin;
  const { isLoggedIn } = useAuth();

  const handleRestrictedItemClick = (e, path) => {
    if (!isLoggedIn) {
      e.preventDefault();
      toast.error("You must login to use this feature", {
        position: "bottom-center",
      });
    }
  };
  // Handle click based on login requirements
  const handleClick = (e) => {
    if (closeMenu) closeMenu();

    if (requiresLogin && !isLoggedIn) {
      handleRestrictedItemClick(e, item.path);
    }
  };

  const linkContent = isSidebar ? (
    // Sidebar styling
    <div className="w-10 h-10 flex items-center justify-center rounded-md transition-all">
      <Link
        href={requiresLogin && !isLoggedIn ? "#" : item.path}
        onClick={handleClick}
        className="w-9 h-9 flex items-center justify-center rounded-md"
      >
        <div
          className={`w-9 h-9 flex items-center justify-center rounded-md ${isActive ? "bg-primary" : "bg-gray-800/80 hover:bg-gray-700/70"}`}
        >
          <MyTooltip
            sideOffset={32}
            side="right"
            align="center"
            content={item.title}
          >
            <item.icon
              className={`w-4 h-4 transition-all ${isActive ? "text-white" : "text-gray-300"}`}
            />
          </MyTooltip>
        </div>
      </Link>
    </div>
  ) : (
    // Mobile menu styling
    <Link
      href={requiresLogin && !isLoggedIn ? "#" : item.path || "#"}
      className="flex items-center justify-center h-12 text-white hover:bg-gray-800 hover:text-primary rounded-md mx-1 transition-colors duration-200"
      onClick={handleClick}
      aria-label={item.title}
    >
      <div
        className={`w-9 h-9 flex items-center justify-center rounded-md ${isActive ? "bg-primary" : "bg-gray-800/80 hover:bg-gray-700/70"}`}
      >
        <item.icon />
      </div>
    </Link>
  );

  return <>{linkContent}</>;
};

export default NavItem;
