import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Atlas Ecosystem",
  description: "Atlas Skilltech University Command Center",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link id="app-favicon" rel="icon" href="/favicon.svg" />
      </head>
      <body className="min-h-screen antialiased dark:bg-slate-900 dark:text-white">{children}</body>
    </html>
  );
}
