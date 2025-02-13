// app/layout.tsx
import "./globals.css";
import { Poppins } from "next/font/google";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <link rel="icon" href="/favicon.ico" />
        <body
          className={`min-h-screen bg-background text-white ${poppins.className}`}
        >
          
          <>{children}</>
        </body>
      </html>
    </>
  );
}
