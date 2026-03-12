import type { Metadata, Viewport } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";

const playfairDisplay = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || 'https://ghostforestsurfclub.com'),
  title: "Ghost Forest Surf Club Annual — Vol. I",
  description:
    "The official yearbook of Ghost Forest Surf Club. Neskowin, Oregon. Volume I.",
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Ghost Forest Surf Club Annual — Vol. I",
    description:
      "The official yearbook of Ghost Forest Surf Club. Neskowin, Oregon. Volume I.",
    siteName: "Ghost Forest Surf Club",
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Ghost Forest Surf Club Annual — Vol. I',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ghost Forest Surf Club Annual — Vol. I",
    description: "The official yearbook of Ghost Forest Surf Club. Neskowin, Oregon. Volume I.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://cdn.shopify.com" />
      </head>
      <body
        className={`${playfairDisplay.variable} ${dmSans.variable} antialiased bg-cream text-charcoal overflow-x-hidden`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-varsity-blue focus:text-cream focus:px-4 focus:py-2 focus:rounded-sm focus:text-sm"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
