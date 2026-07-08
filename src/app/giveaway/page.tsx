import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { HollowtipsLogo } from "@/components/brand/HollowtipsLogo";
import { MatrixRain } from "@/components/brand/MatrixRain";
import { TheChamberForm } from "@/components/verify/TheChamberForm";

export const metadata = {
  title: "Win 1 of 100 GTA VI Copies — Hollowtips",
  description:
    "Hollowtips × GTA VI Giveaway. 100 copies, 100 winners at random. Free entry — join the email & SMS list. Selection November 19, 2026.",
};

const DETAILS = [
  "No purchase necessary — entry is free",
  "100 copies of Grand Theft Auto VI · 100 winners at random",
  "Winner selection: November 19, 2026",
  "Winners notified via email and SMS",
  "One entry per person",
];

export default function GiveawayPage() {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[#0a0a0a] px-5 py-10 text-white">
      <div className="absolute inset-0 z-0">
        <MatrixRain opacity={0.7} />
      </div>
      <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_48%_72%_at_center,rgba(0,0,0,0.92)_0%,rgba(0,0,0,0.6)_48%,transparent_82%)]" />

      <div className="relative z-20 w-full max-w-md rounded-3xl border border-gold/15 bg-black/55 p-6 text-center shadow-[0_0_80px_rgba(0,0,0,0.85)] backdrop-blur-md sm:p-8">
        <div className="mb-6 flex justify-center">
          <HollowtipsLogo variant="full" size={40} />
        </div>

        {/* Blockstar — giveaway sections only */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/blockstar.png"
          alt="Blockstar"
          className="mx-auto h-20 w-20 rounded-2xl"
        />

        <p className="mt-4 font-condensed text-xs font-bold uppercase tracking-[3px] text-gold/70">
          Hollowtips × GTA VI Giveaway
        </p>
        <h1 className="mt-1.5 font-condensed text-4xl font-black uppercase leading-[0.95] tracking-[1px] text-gold sm:text-5xl">
          Win 1 of 100 GTA VI Copies
        </h1>
        <p className="mx-auto mt-3 max-w-xs text-sm text-white/70">
          100 copies of Grand Theft Auto VI. 100 winners, selected at random.
          Level up with us.
        </p>

        {/* The Chamber = email list + SMS alerts */}
        <div className="mt-7 rounded-2xl border border-gold/30 bg-black/70 p-5 backdrop-blur-xl">
          <p className="mb-1 font-condensed text-lg font-bold uppercase tracking-wide text-white">
            Join Free — Email &amp; SMS
          </p>
          <p className="mb-4 text-xs text-white/50">
            Add your email and phone to be eligible. Both steps, 100% free.
          </p>
          <TheChamberForm source="giveaway-page" />
        </div>

        {/* Key details */}
        <ul className="mt-6 space-y-2 text-left">
          {DETAILS.map((d) => (
            <li key={d} className="flex items-start gap-2 text-[13px] text-white/70">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <span>{d}</span>
            </li>
          ))}
        </ul>

        <p className="mt-6 font-condensed text-sm font-bold uppercase tracking-[2px] text-gold">
          Stay Vigilant. Level Up.
        </p>
        <p className="mt-1 text-[11px] uppercase tracking-[2px] text-white/40">
          Hollowtips — Authentic · Original · Verified
        </p>

        <Link
          href="/"
          className="mt-5 inline-flex items-center gap-1.5 text-xs text-white/40 underline-offset-4 transition-colors hover:text-gold hover:underline"
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
