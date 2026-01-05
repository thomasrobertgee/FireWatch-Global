import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google"; // Import fonts
import { CookieBanner } from "@/components/CookieBanner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
  weight: ["300", "400", "700", "900"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "FireWatch Global",
  description: "Professional news portal for fire services.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${merriweather.variable} antialiased bg-gray-50 text-gray-900`}
      >
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
