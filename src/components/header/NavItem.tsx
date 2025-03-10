"use client";
// components/ui/NavItem.jsx
import React, { useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MyTooltip } from "@/components/ui/MyTooltip";
import toast from "react-hot-toast";
import { useAuth } from "@/app/context/AuthContext";

const NavItem = ({ item, closeMenu, isSidebar = false }) => {
  const pathname = usePathname();
  const { isLoggedIn } = useAuth();
  
  // Derived state
  const isActive = pathname === item.path;
  const isRestricted = item.requireLogin && !isLoggedIn;
  const linkHref = isRestricted ? "#" : item.path || "#";
  const isHome = item.title === "Home";
  
  // Event handler with useCallback for better performance
  const handleClick = useCallback((e) => {
   
    
    if (isRestricted) {
      e.preventDefault();
      toast.error("You must login to use this feature", {
        position: "bottom-center",
      });
    }
    else{
      if (closeMenu) closeMenu();
    }
  }, [closeMenu, isRestricted]);
  
  // Reusable class determination functions
  const getContainerClass = () => 
    `w-9 h-9 flex items-center justify-center rounded-md ${
      isActive ? "bg-primary" : "bg-gray-800/80 hover:bg-gray-700/70"
    }`;
    
  const getIconClass = () => 
    `${isActive ? "text-white" : "text-gray-300"} transition-all`;
  
  // Render sidebar variant
  if (isSidebar) {
    const IconContainer = (
      <div className={getContainerClass()}>
        <item.icon className={getIconClass()} />
      </div>
    );

    return (
      <div className="w-10 h-10 flex items-center justify-center rounded-md transition-all">
        <Link
          href={linkHref}
          onClick={handleClick}
          className="w-9 h-9 flex items-center justify-center rounded-md"
        >
          {isHome ? (
            IconContainer
          ) : (
            <MyTooltip
              sideOffset={8}
              side="right"
              align="center"
              content={item.title}
            >
              {IconContainer}
            </MyTooltip>
          )}
        </Link>
      </div>
    );
  }
  
  // Render mobile variant (without tooltip)
  return (
    <Link
      href={linkHref}
      className="flex items-center justify-center h-12 text-white rounded-md mx-1 transition-colors duration-200"
      onClick={handleClick}
      aria-label={item.title}
    >
      <div className={getContainerClass()}>
        <item.icon />
      </div>
    </Link>
  );
};

export default React.memo(NavItem);
