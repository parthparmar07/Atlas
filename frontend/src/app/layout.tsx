import type { Metadata } from "next";
import { Playfair_Display, Manrope } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: "--font-playfair",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "Atlas Ecosystem",
  description: "Atlas Skilltech University Command Center",
};

import { SchoolProvider } from "@/context/SchoolContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${manrope.variable}`}>
      <head>
        <link id="app-favicon" rel="icon" href="/favicon.svg" />
      </head>
      <body className="min-h-screen antialiased font-body dark:bg-slate-900 dark:text-white bg-slate-50">
        <SchoolProvider>
          {children}
        </SchoolProvider>
      </body>
    </html>
  );
}
