import React from 'react';

const MediaSidebar = () => {
  const NavItem = ({ icon, label }) => (
    <div className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-800 rounded-md cursor-pointer group">
      <span className="text-white w-5 h-5">{icon}</span>
      <span className="text-white text-sm">{label}</span>
    </div>
  );

  return (
    <div className="fixed top-0 left-0 h-full w-56 bg-black">
      <nav className="space-y-2 pt-4">
        <NavItem icon="🏠" label="Home" />
        <NavItem icon="🔍" label="Search" />
        
        <div className="border-t border-gray-800 my-4"></div>
        
        <NavItem icon="🎬" label="Movies" />
        <NavItem icon="📺" label="Tv Shows" />
        <NavItem icon="🐱" label="Anime" />
        <NavItem icon="📖" label="Manga" />
        <NavItem icon="🛡️" label="K Drama" />
        <NavItem icon="📺" label="Live Tv" />
        <NavItem icon="💬" label="Discord" />
        
        <div className="border-t border-gray-800 my-4"></div>
        
        <NavItem icon="🕒" label="History" />
        <NavItem icon="❤️" label="WatchList" />
        <NavItem icon="⚙️" label="Settings" />
      </nav>
    </div>
  );
};

export default MediaSidebar;