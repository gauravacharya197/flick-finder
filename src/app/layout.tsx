// app/layout.tsx
'use client'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./globals.css";
import { Poppins } from "next/font/google";
import { AuthProvider } from "./context/AuthContext";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient();

  return (
    <>
      <html lang="en" suppressHydrationWarning>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />

        <link rel="icon" href="/favicon.ico" />
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
        <body
          className={`min-h-screen bg-background text-white ${poppins.className}`}
        >
          
          <>{children}</>
        </body>
        </AuthProvider>
        </QueryClientProvider>
        
      </html>
    </>
  );
}
