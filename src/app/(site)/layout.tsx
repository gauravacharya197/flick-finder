"use client";

import Footer from "@/components/footer";
import Header from "@/components/header";
import ScrollToTop from "@/components/scroll";
import { ThemeProvider } from "next-themes";
import { GoogleAnalytics } from "@next/third-parties/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ToasterContext from "../context/ToastContext";
import { Provider } from "react-redux";

import store from "@/redux/store";
import NextTopLoader from "nextjs-toploader";
import { Suspense } from "react";
import { AuthProvider } from "../context/AuthContext";


export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient();

  let googleAnalyticsCode = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS;

  return (
    <>
     
          <Provider store={store}>
            <AuthProvider>  
              <ThemeProvider enableSystem={false} attribute="class" defaultTheme="dark">
              <QueryClientProvider client={queryClient}>
                <ToasterContext />
                <NextTopLoader showSpinner={false} color="teal" />
               
                  <Suspense fallback={<></>}>
                    <Header />
                  </Suspense>
                 
                  <main className="min-h-screen">{children}</main>
                  <ReactQueryDevtools initialIsOpen={false} />
               
                <Footer />
                <ScrollToTop />
               
                 </QueryClientProvider>
              </ThemeProvider>
            </AuthProvider>
          </Provider>
          {/* <GoogleAnalytics gaId={googleAnalyticsCode || ""} /> */}
       
    </>
  );
}
