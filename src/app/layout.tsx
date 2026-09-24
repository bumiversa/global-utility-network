import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BUMIVERSA | Global Utility Network",
  description: "Building privacy-first, browser-based utilities for the world. No uploads, no tracking, 100% client-side.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
