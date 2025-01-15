"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import "../globals.css";
const inter = Inter({ subsets: ["latin"] });

import ToasterContext from "../context/ToastContext";
import { Provider } from "react-redux";
import { MyApp } from "./MyApp";
import store from "@/redux/store";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
                <link rel="icon" href="/favicon.ico" />

      <body className={`dark:bg-black ${inter.className}`}>
        <Provider store={store}>
          <ThemeProvider
            enableSystem={false}
            attribute="class"
            defaultTheme="dark"
          >
            {/* <Lines /> */}
            <MyApp/>
            <Header />
            <ToasterContext />
            
            {children}
            <Footer />
            <ScrollToTop />
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}
