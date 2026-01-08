import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Locale } from 'savings-core';
import { StructuredData } from '@/components/StructuredData';
import "./../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Metadata {
  const { locale } = params as unknown as { locale: Locale };
  
  const metadata: Record<Locale, Metadata> = {
    zh: {
      title: "积蓄模拟器 - 财务规划工具 | 可视化财富增长",
      description: "积蓄模拟器帮助您规划财务未来。实时模拟您的储蓄增长，支持自定义参数、年度调整和多场景对比。完全隐私保护，在浏览器中本地计算。",
      keywords: ["积蓄模拟器", "财务规划", "储蓄计算器", "财务自由", "投资回报", "财务目标", "理财工具", "FIRE", "财务独立"],
      alternates: {
        languages: {
          en: "https://dragonnzhang.github.io/savings-simulator/en",
          zh: "https://dragonnzhang.github.io/savings-simulator/zh",
        },
      },
      openGraph: {
        title: "积蓄模拟器 - 财务规划工具",
        description: "通过交互式模拟器规划您的财务未来。可视化储蓄增长，支持年度调整和多场景对比。",
        url: "https://dragonnzhang.github.io/savings-simulator/zh",
        siteName: "积蓄模拟器",
        locale: "zh_CN",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: "积蓄模拟器",
        description: "规划您的财务未来，可视化储蓄增长。",
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
        },
      },
    },
    en: {
      title: "Savings Simulator - Financial Planning Tool | Visualize Wealth Growth",
      description: "Savings Simulator helps you plan your financial future. Simulate your savings growth in real-time with customizable parameters, yearly adjustments, and scenario comparisons. 100% privacy-focused with local browser calculations.",
      keywords: ["savings simulator", "financial planning", "savings calculator", "financial freedom", "investment returns", "financial goals", "wealth growth", "FIRE", "financial independence"],
      alternates: {
        languages: {
          en: "https://dragonnzhang.github.io/savings-simulator/en",
          zh: "https://dragonnzhang.github.io/savings-simulator/zh",
        },
      },
      openGraph: {
        title: "Savings Simulator - Financial Planning Tool",
        description: "Plan your financial future with our interactive savings simulator. Visualize growth, adjust by year, and compare scenarios.",
        url: "https://dragonnzhang.github.io/savings-simulator/en",
        siteName: "Savings Simulator",
        locale: "en_US",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: "Savings Simulator",
        description: "Visualize your savings growth and plan your financial future.",
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
        },
      },
    },
  };
  
  return metadata[locale] || metadata.en;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        {/* Preconnect to important domains */}
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={`https://dragonnzhang.github.io/savings-simulator/${locale}`} />
        
        {/* Alternate language links */}
        <link rel="alternate" hrefLang="en" href="https://dragonnzhang.github.io/savings-simulator/en" />
        <link rel="alternate" hrefLang="zh" href="https://dragonnzhang.github.io/savings-simulator/zh" />
        <link rel="alternate" hrefLang="zh-CN" href="https://dragonnzhang.github.io/savings-simulator/zh" />
        <link rel="alternate" hrefLang="x-default" href="https://dragonnzhang.github.io/savings-simulator" />
        
        {/* Google Search Console verification (if needed) */}
        {/* <meta name="google-site-verification" content="your-verification-code" /> */}
        
        {/* Additional meta tags for better SEO */}
        <meta name="theme-color" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover" />
        
        {/* Structured Data for SEO */}
        <StructuredData locale={locale} />
        
        {/* Google Analytics */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="lazyOnload"
        />
        <Script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XXXXXXXXXX');
            `,
          }}
          strategy="lazyOnload"
        />
        
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8595589014201175"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
