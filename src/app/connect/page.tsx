import Link from "next/link";
import { Gift, ArrowLeft } from "lucide-react";
import { HollowtipsLogo } from "@/components/brand/HollowtipsLogo";
import { MatrixRain } from "@/components/brand/MatrixRain";
import { ConnectForm } from "@/components/verify/ConnectForm";

export const metadata = {
  title: "Join the Giveaway — Hollowtips",
  description: "Drop your email & phone to win Hollowtips gear.",
};

export default function ConnectPage() {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-black px-5 py-10 text-white">
      <div className="absolute inset-0 z-0">
        <MatrixRain opacity={0.7} />
      </div>
      <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_48%_72%_at_center,rgba(0,0,0,0.92)_0%,rgba(0,0,0,0.6)_48%,transparent_82%)]" />

      <div className="relative z-20 w-full max-w-md rounded-3xl border border-gold/15 bg-black/55 p-6 text-center shadow-[0_0_80px_rgba(0,0,0,0.85)] backdrop-blur-md sm:p-8">
        <div className="mb-6 flex justify-center">
          <HollowtipsLogo variant="full" size={40} />
        </div>

        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gold-gradient text-black shadow-gold-glow">
          <Gift className="h-7 w-7" />
        </span>
        <h1 className="mt-5 font-gta text-4xl uppercase tracking-wide text-gold-gradient sm:text-5xl">
          Join the Giveaway
        </h1>
        <p className="mx-auto mt-3 max-w-xs text-sm text-white/70">
          Drop your email &amp; phone for a chance to win Hollowtips gear, plus
          early access to drops &amp; deals.
        </p>

        <div className="mt-7 rounded-2xl border border-gold/30 bg-black/70 p-5 backdrop-blur-xl">
          <ConnectForm />
        </div>

        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-1.5 text-xs text-white/40 underline-offset-4 transition-colors hover:text-gold hover:underline"
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
