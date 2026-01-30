import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/Header";
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
  title: "API Reference | Human Passport",
  description: "Interactive API Reference for the Human Passport Developer Platform. Test endpoints, view code samples, and explore the Stamps and Models APIs.",
  keywords: ["Human Passport", "Gitcoin Passport", "API", "Sybil Defense", "Web3", "Identity"],
  openGraph: {
    title: "API Reference | Human Passport",
    description: "Interactive API Reference for the Human Passport Developer Platform",
    type: "website",
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.png', type: 'image/png' }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
