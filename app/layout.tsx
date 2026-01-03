import type React from "react";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { inter } from "@/components/fonts";

export const metadata: Metadata = {
  title: "GradeX Admin - Educational Platform Dashboard",
  description:
    "Manage quizzes, students, and educational content for the GradeX learning platform",
  keywords: ["education", "quiz", "learning", "admin", "dashboard"],
};

export const viewport: Viewport = {
  themeColor: "#16a34a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
