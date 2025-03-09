// SiteLayout.jsx
import Footer from "@/components/footer";
import { Suspense } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";
import SiteProviders from "./SiteProvider";
import Sidebar from "./Sidebar";
import Header from "@/components/header";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  let googleAnalyticsCode = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS;

  return (
    <SiteProviders>
      <div className="flex">
        {/* Sidebar with fixed position */}
        <Sidebar />
        
        {/* Main content with margin to account for sidebar */}
        <div className="flex flex-col min-h-screen w-full md:ml-14 overflow-x-hidden"> 
          <Header />
          
          <Suspense fallback={<></>} />
          
          <main className="flex-1">
            {children}
          </main>

          <Footer />
        </div>
      </div>

      <GoogleAnalytics gaId={googleAnalyticsCode || ""} />
    </SiteProviders>
  );
}