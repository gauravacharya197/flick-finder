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

const Sidebar = () => {
  const pathname = usePathname();
  const [showExtraItems, setShowExtraItems] = useState(false);



  const extraNavItems = [
    { name: 'HISTORY', icon: FaHistory, href: '/history' },
  ];

  return (
    <>
      {/* Sidebar for desktop */}
      <aside className="fixed left-0 top-0 h-screen w-14 bg-background border-r-2 border-gray-800 flex-col items-center py-1 z-30 hidden md:flex">
        <div className="w-full flex flex-col items-center space-y-4">
        {/* <Image 
            src="/file.svg" 
            alt="Logo" 
            width={40} 
            height={40} 
          /> */}
          {menuData.map((item) => {
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

      {/* Bottom navigation for mobile - reduced height */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 z-40 md:hidden">
        <div className="flex justify-between px-2">
          {menuData.slice(0,3).map((item) => {
            const isActive = pathname === item.path;
            
            return (
              <Link 
                key={item.title}
                href={item.path}
                className="flex flex-col items-center justify-center py-1 px-1"
              >
                <div className={`p-1 rounded-md ${isActive ? 'bg-primary' : ''}`}>
                  <item.icon 
                    className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`}
                  />
                </div>
                <span className={`text-xs mt-0.5 ${isActive ? 'text-white' : 'text-gray-400'}`}>
                  {item.title}
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
                  <div className={`p-1 rounded-md ${isActive ? 'bg-primary' : ''}`}>
                    <item.icon 
                      className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`}
                    />
                  </div>
                  <span className={`text-xs mt-0.5 ${isActive ? 'text-white' : 'text-gray-400'}`}>
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