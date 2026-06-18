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
  title: "Hollowtips Verify",
  description: "Premium QR product verification — Hollowtips admin.",
  icons: {
    icon: "/brand/hollowtips-bullet.png",
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
