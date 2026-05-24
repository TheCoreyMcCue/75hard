import type { Metadata, Viewport } from "next";
import "./globals.css";
import { DatadogInit } from "@/components/datadog-init";

export const metadata: Metadata = {
  title: "75 Hard Tracker",
  description: "Track your 75 Hard challenge — with your own rules.",
  appleWebApp: {
    capable: true,
    title: "75 Hard",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  themeColor: "#050810",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://browser-intake-datadoghq.com" crossOrigin="" />
        <link rel="preconnect" href="https://session-replay-datadoghq.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://browser-intake-datadoghq.com" />
      </head>
      <body className="min-h-full">
        <DatadogInit />
        {children}
      </body>
    </html>
  );
}
