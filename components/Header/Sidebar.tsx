import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FaFilter, FaFire, FaHome, FaVideo } from "react-icons/fa";

const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-0 h-full w-20 bg-white shadow-lg dark:bg-gray-900 flex flex-col items-center py-6">
      {/* Logo */}
      <div className="mb-8">
        <Image src="/logo.svg" alt="Logo" width={40} height={40} />
      </div>

      {/* Navigation Items */}
      <nav className="flex flex-col items-center gap-6">
        <SidebarItem href="/" icon={<FaHome size={24} />} label="Home" />
        <SidebarItem href="/anime" icon={<FaVideo size={24} />} label="Anime" />
        <SidebarItem href="/trending" icon={<FaFire size={24} />} label="Trending" />
        <SidebarItem href="/category" icon={<FaFilter size={24} />} label="Category" />
      </nav>
    </aside>
  );
};

const SidebarItem = ({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) => (
  <Link href={href} className="flex flex-col items-center text-gray-600 dark:text-gray-300 hover:text-blue-500">
    {icon}
    <span className="text-sm">{label}</span>
  </Link>
);

export default Sidebar;
