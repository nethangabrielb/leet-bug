import type { Metadata } from "next";

import { Inter, JetBrains_Mono } from "next/font/google";

import QueryProvider from "@/providers/query-provider";

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
  title: "LeetCode Tracker — Master Patterns, Ace Interviews",
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
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
