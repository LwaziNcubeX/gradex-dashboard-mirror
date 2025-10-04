import type React from "react";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { inter } from "@/fonts";
import { ErrorBoundary } from "@/components/error-boundary";
import { CONFIG } from "@/lib/config";

export const metadata: Metadata = {
  title: {
    template: `%s | ${CONFIG.APP.NAME}`,
    default: CONFIG.APP.NAME,
  },
  description: CONFIG.APP.DESCRIPTION,
  keywords: ["education", "quiz", "management", "dashboard", "gradex"],
  authors: [{ name: "GradeX Team" }],
  creator: "GradeX",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "./",
    siteName: CONFIG.APP.NAME,
    title: CONFIG.APP.NAME,
    description: CONFIG.APP.DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: CONFIG.APP.NAME,
    description: CONFIG.APP.DESCRIPTION,
  },
  robots: {
    index: CONFIG.APP.IS_PRODUCTION,
    follow: CONFIG.APP.IS_PRODUCTION,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={"dark " + `${inter.className}`}
    >
      <head>
        {CONFIG.APP.IS_PRODUCTION && (
          <>
            <link rel="preconnect" href={CONFIG.API.BASE_URL} />
            <link rel="dns-prefetch" href={CONFIG.API.BASE_URL} />
          </>
        )}
      </head>
      <body className="antialiased">
        <ErrorBoundary>{children}</ErrorBoundary>
      </body>
    </html>
  );
}
