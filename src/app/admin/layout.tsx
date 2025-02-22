'use client'
import { ReactNode, useState } from "react";
import Sidebar from "./sidebar";
import Navbar from "./navbar";
import { usePathname } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ToasterContext from "../context/ToastContext";

export default function AdminLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const queryClient = new QueryClient();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

    // Exclude layout for the sign-in page
    if (pathname === "/admin/signin") {
      return (
        <>
          <ToasterContext />
          {children}
        </>
      );
    }

    return (
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-background overflow-x-hidden">
          {/* Sidebar */}
          <Sidebar 
            collapsed={sidebarCollapsed} 
            setCollapsed={setSidebarCollapsed} 
          />
          
          {/* Main Content Wrapper */}
          <div 
            className={`
              min-h-screen
              transition-[padding] duration-300 ease-in-out
              ${sidebarCollapsed ? 'pl-16' : 'pl-64'}
            `}
          >
            <ToasterContext />
            {/* Navbar */}
            <Navbar />

            {/* Main Content */}
            <main className="p-6">
              {children}
            </main>
          </div>
        </div>
      </QueryClientProvider>
    );
}