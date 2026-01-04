import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Savings Simulator",
  description: "A powerful savings simulator to help you plan your financial future. Visualize your savings growth over time with customizable parameters.",
  keywords: ["savings", "simulator", "finance", "calculator", "investment", "growth", "interest", "fire", "financial independence"],
  openGraph: {
    title: "Savings Simulator",
    description: "Plan your financial future with our interactive savings simulator.",
    url: "https://dragonnzhang.github.io/savings-simulator",
    siteName: "Savings Simulator",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Savings Simulator",
    description: "Visualize your savings growth with our interactive simulator.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8595589014201175"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
