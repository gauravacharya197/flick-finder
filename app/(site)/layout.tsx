"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import { ThemeProvider } from "next-themes";
import { Poppins } from "next/font/google"; // Replace Inter with Poppins
import "../globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"] }); // Configure Poppins

import ToasterContext from "../context/ToastContext";
import { Provider } from "react-redux";
import { MyApp } from "./MyApp";
import store from "@/redux/store";

import NextTopLoader from "nextjs-toploader";
import { Suspense } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient();

  let googleAnalyticsCode = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS;
  return (
    <html lang="en" suppressHydrationWarning>
      <link rel="icon" href="/favicon.ico" />

      <body className={`dark:bg-gray-900 ${poppins.className}`}>
        <Provider store={store}>
          <ThemeProvider
            enableSystem={false}
            attribute="class"
            defaultTheme="dark"
          >
            <MyApp />
            <Suspense fallback={<></>}>
              <Header />
            </Suspense>

            <ToasterContext />
            <NextTopLoader showSpinner={false} />
            <QueryClientProvider client={queryClient}>
              {children}
              <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
            <Footer />

            <ScrollToTop />

            <GoogleAnalytics gaId={googleAnalyticsCode || ""} />
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}
