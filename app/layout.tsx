import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "TakjilAI — Mulai Bisnis Takjil dalam 5 Menit",
  description:
    "Platform AI untuk membantu kamu memulai bisnis takjil Ramadan. Dapatkan rekomendasi produk, harga, dan toko online siap pakai.",
  keywords: ["takjil", "ramadan", "bisnis", "AI", "jualan"],
  openGraph: {
    title: "TakjilAI",
    description: "Mulai bisnis takjil Ramadan dalam 5 menit dengan bantuan AI.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
