'use client'
// components/Sidebar.jsx
import React from 'react';
import menuData from '@/components/header/menuData';
import NavItem from '@/components/header/NavItem';

const Sidebar = () => {

  const firstNavItems = menuData.filter(x => !x.requireLogin);
  const requireLogin = menuData.filter(x => x.requireLogin);

  return (
    <>
      {/* Login Required Alert */}
      
      
      {/* Sidebar for desktop */}
      <aside className="fixed left-0 top-0 h-screen w-14 bg-background border-r-2 border-gray-800 flex-col items-center py-1 z-30 hidden md:flex">
        <div className="w-full flex flex-col items-center space-y-4">
          {firstNavItems.map((item) => {
             return <NavItem
              key={item.title}
              item={item}
              isSidebar={true}
              closeMenu={null}
            />
            

            
          })}
        </div>
        <div className="w-full px-2 my-2">
          <div className="w-full h-px bg-gray-700"></div>
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