import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Ghost Forest Surf Club Annual — Vol. I",
  description:
    "The official yearbook of Ghost Forest Surf Club. Neskowin, Oregon. Volume I.",
  openGraph: {
    title: "Ghost Forest Surf Club Annual — Vol. I",
    description:
      "The official yearbook of Ghost Forest Surf Club. Neskowin, Oregon. Volume I.",
    siteName: "Ghost Forest Surf Club",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfairDisplay.variable} ${dmSans.variable} antialiased bg-cream text-charcoal overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
