'use client'
// components/Sidebar.jsx
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { MyTooltip } from '@/components/ui/MyTooltip';
import menuData from '@/components/header/menuData';
import NavItem from '@/components/header/NavItem';

const Sidebar = () => {
  const pathname = usePathname();

  const firstNameItems = menuData.filter(x => !x.requireLogin);
  const requireLogin = menuData.filter(x => x.requireLogin);

  return (
    <>
      {/* Login Required Alert */}
      
      
      {/* Sidebar for desktop */}
      <aside className="fixed left-0 top-0 h-screen w-14 bg-background border-r-2 border-gray-800 flex-col items-center py-1 z-30 hidden md:flex">
        <div className="w-full flex flex-col items-center space-y-4">
          {firstNameItems.map((item) => {
            const isActive = pathname === item.path;
            const shouldShowTooltip = item.title !== "Home"; // Condition to hide tooltip for "Home"

            const iconElement = (
              <div className={`w-9 h-9 flex items-center justify-center rounded-md ${isActive ? 'bg-primary' : 'bg-gray-800/80 hover:bg-gray-700/70'}`}>
                <item.icon 
                  className={`w-4 h-4 transition-all ${isActive ? 'text-white' : 'text-gray-300'}`}
                />
              </div>
            );

            return (
              <Link 
                key={item.title}
                href={item.path}
                className="w-10 h-10 flex items-center justify-center rounded-md transition-all"
              >
                {shouldShowTooltip ? (
                  <MyTooltip side="right" sideOffset={8} align="center" content={item.title}>
                    {iconElement}
                  </MyTooltip>
                ) : (
                  iconElement
                )}
              </Link>
            );
          })}
        </div>
        <div className="w-full flex justify-center my-2">
          <div className="w-8 h-px bg-gray-700"></div>
        </div>
        <div className="w-full flex flex-col items-center space-y-4 mt-auto mb-5">
          {requireLogin.map((item) => {
            return (
              <NavItem
                key={item.title}
                item={item}
                isSidebar={true}
                closeMenu={null}
              />
            );
          })}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;