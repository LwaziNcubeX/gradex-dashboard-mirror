import type React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { inter } from "@/fonts";

export const metadata: Metadata = {
  title: "GradeX Admin Dashboard",
  description: "Manage your educational platform",
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
      <body className="antialiased">{children}</body>
    </html>
  );
}
