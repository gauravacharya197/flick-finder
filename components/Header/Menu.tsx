import React from 'react';
import Link from 'next/link';
import { MdClose, MdMenu } from 'react-icons/md';

const Menu = ({ menuData, menuOpen, setMenuOpen, menuContentRef }) => {
    return (
        <div ref={menuContentRef}>
          {/* Hamburger/Close Toggle Button */}
          <button 
        onClick={setMenuOpen} 
        className="fixed top-4 left-4 z-50 p-2 bg-black/70 text-white rounded-full shadow-lg backdrop-blur-sm hover:bg-black/80 transition-all"
      >
        {menuOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
      </button>

      {/* Sidebar Overlay */}
      {menuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40" 
          onClick={setMenuOpen}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`
          fixed left-0 top-0 h-full min-w-[250px]  max-w-[350px] 
          bg-black/95 transform transition-transform duration-300 ease-in-out z-50
          ${menuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Close Icon within Sidebar */}
        <button 
          onClick={()=>{setMenuOpen(false)}} 
          className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
        >
          <MdClose size={24} />
        </button>

        <nav className="pt-16 px-4">
          <ul className="space-y-4">
            {menuData.map((item) => (
              <li key={item.id}>
                <Link 
                  href={item.path || "#"}
                  className="
                    block py-3 px-4 text-white 
                    hover:bg-white/10 rounded-lg 
                    transition-colors duration-200
                  "
                  onClick={setMenuOpen}
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
          </div>
        
      );
    }

export default Menu;