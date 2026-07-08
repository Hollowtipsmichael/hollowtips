import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { HollowtipsLogo } from "@/components/brand/HollowtipsLogo";
import { MatrixRain } from "@/components/brand/MatrixRain";
import { TheChamberForm } from "@/components/verify/TheChamberForm";

export const metadata = {
  title: "Win 1 of 100 GTA 6 Copies — Hollowtips",
  description:
    "Enter The Chamber for a chance to win 1 of 100 GTA 6 copies. Winner drawn November 19.",
};

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

        <h1 className="mt-5 font-condensed text-4xl font-black uppercase leading-[0.95] tracking-[1px] text-gold sm:text-5xl">
          Win 1 of 100 GTA 6 Copies
        </h1>
        <p className="mx-auto mt-3 max-w-xs text-sm text-white/70">
          Enter The Chamber below for your shot. Winner drawn{" "}
          <span className="font-semibold text-white/90">November 19</span>.
        </p>

        <div className="mt-7 rounded-2xl border border-gold/30 bg-black/70 p-5 backdrop-blur-xl">
          <TheChamberForm source="giveaway-page" />
        </div>

        <p className="mt-5 text-[11px] text-white/40">
          No purchase required to enter here.
        </p>

        <Link
          href="/"
          className="mt-5 inline-flex items-center gap-1.5 text-xs text-white/40 underline-offset-4 transition-colors hover:text-gold hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
        </Link>

        <p className="mt-5 text-[11px] text-white/30">
          21+ only · © {new Date().getFullYear()} Hollowtips
        </p>
      </div>
    </main>
  );
}
