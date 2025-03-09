'use client'
// components/Sidebar.jsx
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FaHome,
  FaFilm, 
  FaTv, 
  FaFilter, 
  FaVideo,
  FaEllipsisH,
  FaHistory,
  FaDiscord
} from 'react-icons/fa';
import { MyTooltip } from '@/components/ui/MyTooltip';

const Sidebar = () => {
  const pathname = usePathname();
  const [showExtraItems, setShowExtraItems] = useState(false);

  const navItems = [
    { name: 'HOME', icon: FaHome, href: '/' },
    { name: 'MOVIES', icon: FaFilm, href: '/movie' },
    { name: 'TV', icon: FaTv, href: '/tv' },
    { name: 'FILTER', icon: FaFilter, href: '/filter' },
  ];

  const extraNavItems = [
    { name: 'WATCHHISTORY', icon: FaHistory, href: '/watchhistory' },
    { name: 'DISCORD', icon: FaDiscord, href: '/discord' },
  ];

  return (
    <>
      {/* Sidebar for desktop */}
      <aside className="fixed left-0 top-0 h-screen w-14 bg-background border-r-2 border-gray-800 flex-col items-center py-4 z-30 hidden md:flex">
        <div className="w-full flex flex-col items-center space-y-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            
            return (
              <MyTooltip side="right" 
              align="center" key={item.name} content={item.name}>
                <Link 
                  href={item.href}
                  className="w-10 h-10 flex items-center justify-center rounded-md transition-all"
                >
                  <div className={`
                    w-9 h-9 flex items-center justify-center rounded-md
                    ${isActive ? 'bg-gray-700' : 'bg-gray-800/80 hover:bg-gray-700/70'}
                  `}>
                    <item.icon 
                      className={`
                        w-4 h-4 transition-all
                        ${isActive ? 'text-white' : 'text-gray-300'}
                      `}
                    />
                  </div>
                </Link>
              </MyTooltip>
            );
          })}
        </div>
        <div className="w-full flex flex-col items-center space-y-4 mt-auto">
          {extraNavItems.map((item) => {
            const isActive = pathname === item.href;
            
            return (
              <MyTooltip side="right" 
              align="center" key={item.name} content={item.name}>
                <Link 
                  href={item.href}
                  className="w-10 h-10 flex items-center justify-center rounded-md transition-all"
                >
                  <div className={`
                    w-9 h-9 flex items-center justify-center rounded-md
                    ${isActive ? 'bg-gray-700' : 'bg-gray-800/80 hover:bg-gray-700/70'}
                  `}>
                    <item.icon 
                      className={`
                        w-4 h-4 transition-all
                        ${isActive ? 'text-white' : 'text-gray-300'}
                      `}
                    />
                  </div>
                </Link>
              </MyTooltip>
            );
          })}
        </div>
      </aside>

      {/* Bottom navigation for mobile - reduced height */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 z-40 md:hidden">
        <div className="flex justify-between px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            
            return (
              <Link 
                key={item.name}
                href={item.href}
                className="flex flex-col items-center justify-center py-1 px-1"
              >
                <div className={`
                  p-1 rounded-md
                  ${isActive ? 'bg-gray-700' : ''}
                `}>
                  <item.icon 
                    className={`
                      w-4 h-4
                      ${isActive ? 'text-white' : 'text-gray-400'}
                    `}
                  />
                </div>
                <span className={`
                  text-xs mt-0.5
                  ${isActive ? 'text-white' : 'text-gray-400'}
                `}>
                  {item.name}
                </span>
              </Link>
            );
          })}
          <button 
            onClick={() => setShowExtraItems(!showExtraItems)}
            className="flex flex-col items-center justify-center py-1 px-1"
          >
            <div className="p-1 rounded-md">
              <FaEllipsisH className="w-4 h-4 text-gray-400" />
            </div>
            <span className="text-xs mt-0.5 text-gray-400">MORE</span>
          </button>
        </div>
        {showExtraItems && (
          <div className="flex justify-between px-2 mt-2">
            {extraNavItems.map((item) => {
              const isActive = pathname === item.href;
              
              return (
                <Link 
                  key={item.name}
                  href={item.href}
                  className="flex flex-col items-center justify-center py-1 px-1"
                >
                  <div className={`
                    p-1 rounded-md
                    ${isActive ? 'bg-gray-700' : ''}
                  `}>
                    <item.icon 
                      className={`
                        w-4 h-4
                        ${isActive ? 'text-white' : 'text-gray-400'}
                      `}
                    />
                  </div>
                  <span className={`
                    text-xs mt-0.5
                    ${isActive ? 'text-white' : 'text-gray-400'}
                  `}>
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </nav>
    </>
  );
};

export default Sidebar;