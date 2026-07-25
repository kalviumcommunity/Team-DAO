import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "../frontend/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-playfair-display",
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
      className={`${inter.variable} ${playfairDisplay.variable} h-full antialiased`}
    >
      <body className="flex min-h-screen flex-col bg-mint-wash text-stone-charcoal antialiased">
        {children}
      </body>
    </html>
  );
}
