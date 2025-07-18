// src/app/layout.tsx (The Final, Corrected RootLayout)

import "./globals.css";
import { Providers } from "./providers";
import { GeistSans } from "geist/font/sans"; // ✅ Correct import for the font
import { GeistMono } from "geist/font/mono"; // ✅ Also import the mono font for consistency
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Amboseli Lewis School",
  description: "School Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
