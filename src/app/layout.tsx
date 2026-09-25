import type { Metadata } from "next";
import SiteHeader from "@/components/site/site-header";
import SiteFooter from "@/components/site/site-footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "BUMIVERSA | Global Utility Network",
    template: "%s | BUMIVERSA",
  },
  description: "A curated collection of privacy-first, browser-based utilities. No uploads, no tracking, 100% client-side processing.",
  keywords: ["free online tools", "json formatter", "base64 decoder", "jwt inspector", "text cleaner", "privacy first tools"],
  authors: [{ name: "BUMIVERSA" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://bumiversa.dev",
    siteName: "BUMIVERSA Global Utility Network",
    title: "BUMIVERSA | Global Utility Network",
    description: "Privacy-first, browser-based utilities for the world.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-white text-zinc-950 antialiased">
        <SiteHeader />
        <main className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
