"use client";

import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Provider } from "react-redux";
import store from "@/redux/store";
import { useState } from "react";
import { AuthProvider } from "../context/AuthContext";
import NextTopLoader from "nextjs-toploader";
import ToasterContext from "../context/ToastContext";
import ScrollToTop from "@/components/scroll";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider enableSystem={false} attribute="class" defaultTheme="dark">
            <ToasterContext />
            <NextTopLoader showSpinner={false} color="teal" />
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
      <ScrollToTop />
    </Provider>
  );
}
