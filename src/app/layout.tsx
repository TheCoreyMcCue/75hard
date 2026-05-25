import type { Metadata, Viewport } from "next";
import "./globals.css";
import { DatadogInit } from "@/components/datadog-init";

const SITE_URL = "https://sevenfivehard.com";
const SITE_TITLE = "75 Hard Tracker — Run the challenge your way";
const SITE_DESCRIPTION =
  "A free, customizable 75 Hard tracker. Standard rules pre-filled. Edit, add, or remove daily tasks before you start, then lock in for the duration. Daily checklist, calendar, and progress grid.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: "%s · 75 Hard Tracker",
    default: SITE_TITLE,
  },
  description: SITE_DESCRIPTION,
  applicationName: "75 Hard Tracker",
  keywords: [
    "75 hard",
    "75 hard tracker",
    "75 hard app",
    "75 hard challenge",
    "75 hard tracker with custom rules",
    "custom 75 hard",
    "habit tracker",
    "fitness challenge tracker",
    "daily challenge tracker",
  ],
  authors: [{ name: "Corey McCue" }],
  creator: "Corey McCue",
  publisher: "Corey McCue",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "75 Hard Tracker",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
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
      <body className="min-h-full">
        <DatadogInit />
        {children}
      </body>
    </html>
  );
}
