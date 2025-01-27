"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import "../globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
const inter = Inter({ subsets: ["latin"] });

import ToasterContext from "../context/ToastContext";
import { Provider } from "react-redux";
import { MyApp } from "./MyApp";
import store from "@/redux/store";

import NextTopLoader from "nextjs-toploader";

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

      <body className={`dark:bg-gray-900 ${inter.className}`}>
        <Provider store={store}>
          <ThemeProvider
            enableSystem={false}
            attribute="class"
            defaultTheme="dark"
          >
            <MyApp/>

            <Header />
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
