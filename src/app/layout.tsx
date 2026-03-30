import type { Metadata } from "next";
import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "../components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "My Life OS",
  description: "Blogging, Goals, and Calendar | Professional Journal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full bg-white text-[#191919] flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
        <Navbar />
        {/* Medium-style container: Large top padding, max-width for readability */}
        <main className="flex-grow pt-24 pb-16 px-6 max-w-[720px] mx-auto w-full">
          {children}
        </main>
      </body>
    </html>
  );
}