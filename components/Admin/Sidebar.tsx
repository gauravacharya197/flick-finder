import React, { useState } from 'react';
import { 
  FaHome, 
  FaUsers, 
  FaShoppingCart, 
  FaChartBar, 
  FaCog, 
  FaQuestionCircle, 
  FaBars, 
  FaTimes, 
  FaChevronDown, 
  FaChevronRight 
} from 'react-icons/fa';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState('');
  const [openSubmenu, setOpenSubmenu] = useState('');

  const menuItems = [
    {
      title: 'Dashboard',
      icon: <FaHome className="w-5 h-5" />,
      path: '/dashboard'
    },
    {
      title: 'User Management',
      icon: <FaUsers className="w-5 h-5" />,
      submenu: [
        { title: 'All Users', path: '/users' },
        { title: 'Add User', path: '/users/add' },
        { title: 'Roles', path: '/users/roles' }
      ]
    },
    {
      title: 'Products',
      icon: <FaShoppingCart className="w-5 h-5" />,
      submenu: [
        { title: 'All Products', path: '/products' },
        { title: 'Add Product', path: '/products/add' },
        { title: 'Categories', path: '/products/categories' }
      ]
    },
    {
      title: 'Analytics',
      icon: <FaChartBar className="w-5 h-5" />,
      path: '/analytics'
    },
    {
      title: 'Settings',
      icon: <FaCog className="w-5 h-5" />,
      path: '/settings'
    },
    {
      title: 'Help',
      icon: <FaQuestionCircle className="w-5 h-5" />,
      path: '/help'
    }
  ];

  const handleMenuClick = (title) => {
    setActiveMenu(title);
    setOpenSubmenu(openSubmenu === title ? '' : title);
  };

  return (
    <div 
      className={`h-screen bg-gray-900 text-white transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
       
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-800"
        >
          {isCollapsed ? (
            <FaBars className="w-6 h-6" />
          ) : (
            <FaTimes className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.title}>
              <button
                onClick={() => handleMenuClick(item.title)}
                className={`w-full flex items-center ${
                  isCollapsed ? 'justify-center' : 'justify-between'
                } p-2 rounded-lg hover:bg-gray-800 ${
                  activeMenu === item.title ? 'bg-gray-800' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  {!isCollapsed && <span>{item.title}</span>}
                </div>
                {!isCollapsed && item.submenu && (
                  openSubmenu === item.title ? 
                    <FaChevronDown className="w-4 h-4" /> : 
                    <FaChevronRight className="w-4 h-4" />
                )}
              </button>
              
              {/* Submenu */}
              {!isCollapsed && item.submenu && openSubmenu === item.title && (
                <ul className="ml-6 mt-2 space-y-2">
                  {item.submenu.map((subItem) => (
                    <li key={subItem.title}>
                      <a
                        href={subItem.path}
                        className="block p-2 rounded-lg hover:bg-gray-800"
                      >
                        {subItem.title}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
