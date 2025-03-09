'use client'
// components/Sidebar.jsx
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FaEllipsisH,
  FaHistory} from 'react-icons/fa';
import { MyTooltip } from '@/components/ui/MyTooltip';
import menuData from '@/components/header/menuData';
import Image from 'next/image';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const pathname = usePathname();
  const {isLoggedIn} = useAuth()


  const firstNameItems = menuData.filter(x=>!x.requireLogin)

  const requireLogin = menuData.filter(x=>x.requireLogin)

  return (
    <>
      {/* Sidebar for desktop */}
      <aside className="fixed left-0 top-0 h-screen w-14 bg-background border-r-2 border-gray-800 flex-col items-center py-1 z-30 hidden md:flex">
        <div className="w-full flex flex-col items-center space-y-4">

          {firstNameItems.map((item) => {
  const isActive = pathname === item.path;
  const shouldShowTooltip = item.title !== "Home"; // Condition to hide tooltip for "Home"

  const linkContent = (
    <Link 
      href={item.path}
      className="w-10 h-10 flex items-center justify-center rounded-md transition-all"
    >
      <div className={`w-9 h-9 flex items-center justify-center rounded-md ${isActive ? 'bg-primary' : 'bg-gray-800/80 hover:bg-gray-700/70'}`}>
        <item.icon 
          className={`w-4 h-4 transition-all ${isActive ? 'text-white' : 'text-gray-300'}`}
        />
      </div>
    </Link>
  );

  return (
    <React.Fragment key={item.title}>
      {shouldShowTooltip ? (
        <MyTooltip side="right" align="center" content={item.title}>
          {linkContent}
        </MyTooltip>
      ) : (
        linkContent
      )}
    </React.Fragment>
  );
})}

        </div>
        <div className="w-full flex justify-center my-2">
      <div className="w-8 h-px bg-gray-700"></div>
    </div>
        <div className="w-full flex flex-col items-center space-y-4 mt-auto mb-5">
          {requireLogin.map((item) => {
            const isActive = pathname === item.path;
            
            return (
              <MyTooltip side="right" 
              align="center" key={item.title} content={item.title}>
                <Link 
                  href={item.path}
                  className="w-10 h-10 flex items-center justify-center rounded-md transition-all"
                >
                  <div className={`w-9 h-9 flex items-center justify-center rounded-md ${isActive ? 'bg-primary' : 'bg-gray-800/80 hover:bg-gray-700/70'}`}>
                    <item.icon 
                      className={`w-4 h-4 transition-all ${isActive ? 'text-white' : 'text-gray-300'}`}
                    />
                  </div>
                </Link>
              </MyTooltip>
            );
          })}
        </div>
      </aside>

      
    </>
  );
};

export default Sidebar;