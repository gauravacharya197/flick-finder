import Footer from "@/components/footer";
import Header from "@/components/header";
import { Suspense } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";
import Providers from "./Provider";
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  let googleAnalyticsCode = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS;

  return (
    <Providers>
      <Suspense fallback={<></>}>
        <Header />
      </Suspense>
      <main className="min-h-screen">{children}</main>
      <Footer />
      <GoogleAnalytics gaId={googleAnalyticsCode || ""} />

    </Providers>
  );
}
