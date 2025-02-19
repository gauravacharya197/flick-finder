'use client'
import { ReactNode } from "react";
import Sidebar from "./sidebar";
import Navbar from "./navbar";
import { usePathname } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ToasterContext from "../context/ToastContext";

export default function AdminLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const queryClient = new QueryClient();

    // Exclude layout for the sign-in page
    if (pathname === "/admin/signin") {
      return <> <ToasterContext />{children}</>;
    }
  return (
    <div className="flex min-h-screen bg-background">
              <QueryClientProvider client={queryClient}>

      {/* Sidebar */}
      <Sidebar />
      <ToasterContext />
      <div className="flex flex-col flex-1">
        {/* Navbar */}
        <Navbar />

        {/* Main Content */}
        <main className="p-6">{children}</main>
      </div>
      </QueryClientProvider>
    </div>
  );
}
