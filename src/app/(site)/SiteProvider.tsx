"use client";

import { ThemeProvider } from "next-themes";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Provider } from "react-redux";
import store from "@/redux/store";
import NextTopLoader from "nextjs-toploader";
import ToasterContext from "../context/ToastContext";
import ScrollToTop from "@/components/scroll";

export default function SiteProviders({ children }: { children: React.ReactNode }) {

  return (
    <Provider store={store}>
     
          <ThemeProvider enableSystem={false} attribute="class" defaultTheme="dark">
            <ToasterContext />
            <NextTopLoader showSpinner={false} color="teal" />
            {children}
            {/* <ReactQueryDevtools initialIsOpen={false} /> */}
          </ThemeProvider>
       
      <ScrollToTop />
    </Provider>
  );
}
