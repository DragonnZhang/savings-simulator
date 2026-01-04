import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import GoogleAdSense from "@/components/GoogleAdSense";

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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <div className="container mx-auto px-4 py-8 text-center text-gray-500 text-sm">
           <p>© {new Date().getFullYear()} Savings Simulator. All rights reserved.</p>
        </div>
        <GoogleAdSense pId={process.env.NEXT_PUBLIC_ADSENSE_PID || "8595589014201175"} />
      </body>
    </html>
  );
}
