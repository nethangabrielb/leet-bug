import type { Metadata } from "next";

import { Inter, JetBrains_Mono } from "next/font/google";
import NextTopLoader from 'nextjs-toploader';
import QueryProvider from "@/providers/query-provider";
import { Toaster } from "@/components/ui/sonner";

import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LeetBug — Master Patterns, Ace Interviews",
  description:
    "A premium, interactive LeetCode training system. Track your progress through 10 core patterns, 31-day plan, spaced repetition, and daily practice logs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <QueryProvider>
          <NextTopLoader
            color="#10b981"
            initialPosition={0.08}
            crawlSpeed={200}
            height={3}
            crawl={true}
            showSpinner={false}
            easing="ease"
            speed={200}
            shadow="0 0 10px #10b981,0 0 5px #10b981"
            zIndex={1600}
            showAtBottom={false}
          />
          {children}
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
