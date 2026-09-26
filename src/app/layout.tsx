import type { Metadata, Viewport } from "next";
import Script from "next/script";
import SiteHeader from "@/components/site/site-header";
import SiteFooter from "@/components/site/site-footer";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://bumiversa.dev"),
  title: {
    default: "BUMIVERSA | Global Utility Network",
    template: "%s | BUMIVERSA",
  },
  description: "A curated collection of privacy-first, browser-based utilities. Core data processing happens locally in your browser, while anonymous site usage is measured to improve our tools.",
  keywords: ["free online tools", "json formatter", "base64 decoder", "jwt inspector", "text cleaner", "privacy first tools"],
  authors: [{ name: "BUMIVERSA" }],
  icons: {
    icon: "/bumiversa-favicon.png",
    apple: "/bumiversa-favicon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://bumiversa.dev",
    siteName: "BUMIVERSA Global Utility Network",
    title: "BUMIVERSA | Global Utility Network",
    description: "Core data processing happens locally. Anonymous site usage is measured to improve our tools.",
    images: [
      {
        url: "/bumiversa-og.png",
        width: 1200,
        height: 630,
        alt: "BUMIVERSA Global Utility Network",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BUMIVERSA | Global Utility Network",
    description: "Core data processing happens locally. Anonymous site usage is measured to improve our tools.",
  },
  other: {
    'google-adsense-account': 'ca-pub-2917362809005147',
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
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-QMKFHW1C4B"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-QMKFHW1C4B', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
        <SiteHeader />
        <main className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}