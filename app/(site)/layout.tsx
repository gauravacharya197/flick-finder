"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Lines from "@/components/Lines";
import ScrollToTop from "@/components/ScrollToTop";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import "../globals.css";
const inter = Inter({ subsets: ["latin"] });

import ToasterContext from "../context/ToastContext";
import { Provider, useDispatch } from "react-redux";
import { useEffect, useRef } from "react";
import { getFilters } from "@/services/MovieService";
import { setFilters } from "@/redux/movies/filterSlice";
import toast from "react-hot-toast";
import { MyApp } from "./MyApp";
import store from "@/redux/store";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("loaded");

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`dark:bg-black ${inter.className}`}>
        <Provider store={store}>
          <ThemeProvider
            enableSystem={false}
            attribute="class"
            defaultTheme="light"
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
