import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/context/app";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "MedBox — Your Online Pharmacy",
    template: "%s | MedBox Pharmacy",
  },
  description:
    "Order medicines, vitamins, skincare and wellness essentials online with fast delivery, trusted products, and expert pharmacy support.",
  keywords: ["pharmacy", "online pharmacy", "medicines", "vitamins", "health"],
};

export default function RootLayout({ children }: LayoutProp) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-full antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
