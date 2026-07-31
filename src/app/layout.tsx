import type { Metadata } from "next";
import {
  Inter,
  UnifrakturCook,
  Anton,
  Barlow_Condensed,
  Barlow,
} from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Blackletter display face — matches the engraved Hollowtips wordmark.
// Used sparingly (logo lockup only). Only ships weight 700.
const display = UnifrakturCook({
  weight: "700",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

// Condensed bold display for the GTA-styled public pages (Pricedown-alike).
const gta = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-gta",
  display: "swap",
});

// Verify result screens (client mockup): condensed display + body.
const condensed = Barlow_Condensed({
  weight: ["400", "600", "700", "900"],
  subsets: ["latin"],
  variable: "--font-condensed",
  display: "swap",
});
const barlow = Barlow({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://verifyhollowtips.com",
  ),
  title: "Hollowtips Verify",
  description: "Premium QR product verification — Hollowtips admin.",
  icons: {
    icon: "/brand/favicon.png",
    apple: "/brand/apple-icon.png",
  },
  openGraph: {
    title: "Hollowtips",
    description:
      "Scratch the panel on your Hollowtips pack and enter the code to verify authenticity.",
    siteName: "Hollowtips",
    type: "website",
    images: [{ url: "/brand/og-matrix.jpg", width: 1152, height: 1152, alt: "Hollowtips" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/brand/og-matrix.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${inter.variable} ${display.variable} ${gta.variable} ${condensed.variable} ${barlow.variable} font-sans`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
