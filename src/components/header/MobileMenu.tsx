import { MdClose } from "react-icons/md";
import menuData from "./menuData";
import NavItem from "./NavItem";


export const MobileMenu = ({ isOpen, menuContentRef, closeMenu }) => (
    <div
      ref={menuContentRef}
      className={`w-48 fixed left-0 top-12 bottom-0 z-40 bg-gradient-to-b from-gray-900 to-black shadow-lg transition-all duration-300 ease-in-out transform overflow-y-auto scrollbar-hide md:hidden ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
      aria-hidden={!isOpen}
    >
      <div className="flex flex-col h-full py-2 overflow-y-auto hide-scrollbar">
        {/* Regular menu items */}
        <ul className="flex-1">
          {menuData.filter((x) => x.showOnMobile && !x.requireLogin).map((item) => (
            <li key={item.id} className="mb-1 relative group">
              <NavItem
                key={item.title}
                item={item}
                closeMenu={closeMenu}
                isSidebar={false}
              />
            </li>
          ))}
        </ul>
        
        {/* Divider if there are login-required items */}
        <div className="w-full px-3 my-2">
          <div className="w-full h-px bg-gray-700"></div>
        </div>
        
        {/* Login-required items */}
        <ul className="mb-4">
          {menuData.filter((x) => x.showOnMobile && x.requireLogin).map((item) => (
            <li key={item.id} className="mb-1 relative group">
              <NavItem
                key={item.title}
                item={item}
                closeMenu={closeMenu}
                isSidebar={false}
              />
            </li>
          ))}
        </ul>
        
        {/* Close button */}
        <div className="mt-auto mx-3 mb-4">
          <button
            onClick={closeMenu}
            className="w-full h-9 flex items-center justify-center rounded-md bg-primary hover:bg-opacity-90 transition-colors"
            aria-label="Close Menu"
          >
            <MdClose className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );