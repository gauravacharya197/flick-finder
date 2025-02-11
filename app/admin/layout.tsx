"use client";
import { useState } from "react";
import Link from "next/link";
import {
  FaBars,
  FaTachometerAlt,
  FaUsers,
  FaCog,
  FaUserCircle,
} from "react-icons/fa";
import { Layout, Menu, Dropdown } from "antd";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const { Header, Sider, Content } = Layout;

const SidebarMenu = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: <FaTachometerAlt />,
    href: "/admin",
  },
  { key: "users", label: "Users", icon: <FaUsers />, href: "/admin/videos" },
  {
    key: "settings",
    label: "Settings",
    icon: <FaCog />,
    href: "/admin/settings",
  },
];

const user = {
  name: "John Doe",
  email: "john@example.com",
};

export default function AdminLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const queryClient = new QueryClient();

  const userMenu = (
    <Menu>
      <Menu.Item key="profile">Profile</Menu.Item>
      <Menu.Item key="logout">Logout</Menu.Item>
    </Menu>
  );

  return (
    <Layout className="min-h-screen">
      {/* Sidebar */}
      <QueryClientProvider client={queryClient}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          className="bg-gray-900"
        >
          <div className="my-4 text-center text-xl font-bold text-white">
            Admin
          </div>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={["dashboard"]}>
            {SidebarMenu.map((item) => (
              <Menu.Item key={item.key} icon={item.icon}>
                <Link href={item.href}>{item.label}</Link>
              </Menu.Item>
            ))}
          </Menu>
        </Sider>

        {/* Main Layout */}
        <Layout className="bg-gray-800">
          <Header className="flex items-center justify-between bg-gray-900 px-4 text-white shadow">
            {/* Sidebar Toggle */}
            <FaBars
              className="cursor-pointer text-xl"
              onClick={() => setCollapsed(!collapsed)}
            />

            {/* User Profile Dropdown */}
            <Dropdown overlay={userMenu} placement="bottomRight">
              <div className="flex cursor-pointer items-center space-x-2">
                <FaUserCircle className="text-2xl" />
                <span className="hidden md:inline">{user.name}</span>
              </div>
            </Dropdown>
          </Header>

          {/* Page Content */}
          <Content className="min-h-screen bg-gray-800 p-6 text-white">
            {children}
          </Content>
        </Layout>
      </QueryClientProvider>
    </Layout>
  );
}
