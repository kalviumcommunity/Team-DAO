import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../frontend/styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "stuCart - Campus finds, anywhere",
  description: "Buy, sell, and exchange with students on your campus.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-screen flex-col bg-mint-wash text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container">{children}</body>
    </html>
  );
}
