// SiteLayout.jsx
import Footer from "@/components/footer";
import { Suspense } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";
import SiteProviders from "./SiteProvider";
import Sidebar from "./Sidebar";
import Header from "@/components/header";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let googleAnalyticsCode = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS;

  return (
   <>
      {children}
   </>
  );
}
