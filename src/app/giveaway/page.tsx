import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { HollowtipsLogo } from "@/components/brand/HollowtipsLogo";
import { TheChamberForm } from "@/components/verify/TheChamberForm";

export const metadata: Metadata = {
  title: "Win 1 of 100 GTA VI Copies — Hollowtips",
  description:
    "Hollowtips × GTA VI Giveaway. 100 winners picked Nov 19, 2026 — free digital copy, your choice of PS5 or Xbox. Free entry — join the email & SMS list.",
  openGraph: {
    title: "Win 1 of 100 GTA VI Copies — Hollowtips",
    description:
      "100 winners picked Nov 19, 2026 — free digital copy, your choice of PS5 or Xbox. Free entry.",
    url: "/giveaway",
    siteName: "Hollowtips",
    type: "website",
    images: [
      {
        url: "/brand/giveaway-flyer.jpg",
        width: 1080,
        height: 1080,
        alt: "Level Up with Hollowtips — Win 1 of 100 GTA VI copies. Free entry.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/brand/giveaway-flyer.jpg"],
  },
};

const CONTROLLERS = [
  { src: "/brand/controller-ps5.jpg", label: "PS5" },
  { src: "/brand/controller-xbox.jpg", label: "Xbox" },
];

export default function GiveawayPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07060B] px-5 py-8 text-white">
      {/* neon glow backdrop (flyer palette) */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(60%_45%_at_18%_0%,rgba(255,45,143,0.16),transparent_60%),radial-gradient(55%_45%_at_85%_100%,rgba(139,61,255,0.18),transparent_60%)]" />
      <div className="grain pointer-events-none absolute inset-0 z-0 opacity-50" />

      <div className="relative z-10 mx-auto w-full max-w-md animate-fade-in text-center">
        <div className="mb-5 flex justify-center">
          <HollowtipsLogo variant="full" size={36} />
        </div>

        {/* The approved flyer IS the hero */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/giveaway-flyer.jpg"
          width={1080}
          height={1080}
          fetchPriority="high"
          decoding="async"
          alt="Level Up with Hollowtips — Win 1 of 100 GTA VI copies. Join the email & SMS list, free entry. 100 winners. Selection Nov 19, 2026. verifyhollowtips.com"
          className="w-full rounded-2xl border border-neon-pink/30 shadow-[0_0_60px_rgba(255,45,143,0.22)]"
        />

        <p className="mt-7 font-condensed text-xs font-bold uppercase tracking-[3px] text-neon-pink/80">
          Hollowtips × GTA VI Giveaway
        </p>
        <h1 className="mt-1.5 font-condensed text-3xl font-black uppercase leading-[0.95] tracking-[1px] text-neon-gradient sm:text-4xl">
          Win 1 of 100 GTA VI Copies
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-white/70">
          Drop your info. That&apos;s it. 100 winners picked Nov 19, 2026 —
          free digital copy, your choice of PS5 or Xbox.
        </p>

        {/* Your choice — gold Hollowtips controllers */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          {CONTROLLERS.map((c) => (
            <figure
              key={c.label}
              className="overflow-hidden rounded-2xl border border-gold/25 bg-black"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={c.src}
                width={800}
                height={534}
                loading="lazy"
                decoding="async"
                alt={`Gold Hollowtips ${c.label} controller`}
                className="w-full"
              />
              <figcaption className="border-t border-gold/15 py-1.5 font-condensed text-[11px] font-bold uppercase tracking-[2px] text-gold">
                {c.label}
              </figcaption>
            </figure>
          ))}
        </div>

        {/* The Chamber = email list + SMS alerts */}
        <div className="mt-5 rounded-2xl border border-neon-pink/40 bg-black/60 p-5 shadow-neon-glow backdrop-blur-xl">
          <p className="mb-1 font-condensed text-lg font-bold uppercase tracking-wide text-white">
            Join Free — Email &amp; SMS
          </p>
          <p className="mb-4 text-xs text-white/50">
            Add your email and phone to be eligible. Both steps, 100% free.
          </p>
          <TheChamberForm
            source="giveaway-page"
            accent="neon"
            cta="Enter the Giveaway"
            footnote={
              <>
                No purchase necessary. 21+, US only. One entry per person. By
                entering you agree to the{" "}
                <Link
                  href="/giveaway/rules"
                  className="text-neon-pink underline underline-offset-2 hover:text-white"
                >
                  Official Rules
                </Link>
                . Msg &amp; data rates may apply — reply STOP to opt out.
              </>
            }
          />
        </div>

        <p className="mt-6 font-condensed text-sm font-bold uppercase tracking-[2px] text-neon-gradient">
          Stay Vigilant. Level Up.
        </p>
        <p className="mt-1 text-[11px] uppercase tracking-[2px] text-white/40">
          Hollowtips — Authentic · Original · Verified
        </p>

        <Link
          href="/"
          className="mt-5 inline-flex items-center gap-1.5 text-xs text-white/40 underline-offset-4 transition-colors hover:text-neon-pink hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
        </Link>

        <p className="mt-5 text-[11px] text-white/30">
          21+ only · No purchase necessary · © {new Date().getFullYear()} Hollowtips
        </p>
      </div>
    </main>
  );
}
