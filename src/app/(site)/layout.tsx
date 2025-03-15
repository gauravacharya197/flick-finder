// SiteLayout.jsx
import Footer from "@/components/footer";
import { Suspense } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";
import SiteProviders from "./SiteProvider";
import Sidebar from "./Sidebar";
import Header from "@/components/header";
import Head from "next/head";
import Script from "next/script";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let googleAnalyticsCode = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS;

  return (
    <SiteProviders>
      <div className="flex">
        <Script defer src="https://cloud.umami.is/script.js" data-website-id="d8ddab61-aa5d-4cc3-a1e8-77bd5eff208d"></Script>
       
        {/* Sidebar with fixed position */}

        <Suspense fallback={<></>}>
          <Sidebar />
        </Suspense>
        {/* Main content with margin to account for sidebar */}
        <div className="flex flex-col min-h-screen w-full md:ml-14 overflow-x-hidden">
          <Suspense fallback={<></>}>
            <Header />
          </Suspense>
          <main className="min-h-screen">{children}</main>

          <Footer />
        </div>
      </div>

      <GoogleAnalytics key={'gaa'} gaId={googleAnalyticsCode || ""} />
    </SiteProviders>
  );
}
