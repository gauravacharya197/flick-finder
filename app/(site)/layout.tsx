"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import { ThemeProvider } from "next-themes";
import { Poppins } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ToasterContext from "../context/ToastContext";
import { Provider } from "react-redux";

import store from "@/redux/store";
import NextTopLoader from "nextjs-toploader";
import { Suspense } from "react";
import { AuthProvider } from "../context/AuthContext";
import { DataLoader } from "./dataLoader";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient();
  let googleAnalyticsCode = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS;

  return (
      <>
      <link rel="icon" href="/favicon.ico" />

      <body className={`dark:bg-background dark:text-white  ${poppins.className}`}>
        <Provider store={store}>
          <AuthProvider>  
            <ThemeProvider
              enableSystem={false}
              attribute="class"
              defaultTheme="dark"
            >
              
              

              <ToasterContext />
              <NextTopLoader showSpinner={false} color="teal" />
              <QueryClientProvider client={queryClient}>
              <Suspense fallback={<></>}>
                <Header />
              </Suspense>
              <DataLoader />
                
                
                <div className="min-h-screen">{children}</div>
                {/* <ReactQueryDevtools initialIsOpen={false} /> */}
              </QueryClientProvider>
              <Footer />

              <ScrollToTop />

              <GoogleAnalytics gaId={googleAnalyticsCode || ""} />
            </ThemeProvider>
          </AuthProvider>
        </Provider>
      </body>
     </>
  );
}