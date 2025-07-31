import type React from "react";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "../lib/provider";
import { Header } from "@/components/layout/header";
import Head from "./head";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  keywords: [
    "event ticketing",
    "book tickets",
    "event management",
    "ticket booking platform",
    "discover events",
  ],
};

export const viewport: Viewport = {
  themeColor: "#2563EB",
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Head />
      <body className={inter.className}>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}

