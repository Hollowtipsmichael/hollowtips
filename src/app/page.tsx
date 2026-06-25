import { Sparkles, Clapperboard } from "lucide-react";
import { HollowtipsLogo } from "@/components/brand/HollowtipsLogo";
import { MatrixBg } from "@/components/brand/MatrixBg";
import { CodeEntryForm } from "@/components/verify/CodeEntryForm";

export const metadata = {
  title: "Verify — Hollowtips",
  description: "Scratch the panel on your Hollowtips pack and enter the code to verify authenticity.",
};

export default function HomeVerifyPage() {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-black px-5 py-10 text-white">
      {/* Hollowtips Matrix background (design handoff) — includes its own vignette */}
      <div className="absolute inset-0 z-0">
        <MatrixBg />
      </div>

      <div className="relative z-20 w-full max-w-md animate-fade-in rounded-3xl border border-gold/15 bg-black/55 p-6 text-center shadow-[0_0_80px_rgba(0,0,0,0.85)] backdrop-blur-md sm:p-8">
        <div className="mb-7 flex justify-center">
          <HollowtipsLogo variant="full" size={46} />
        </div>

        <h1 className="font-gta text-4xl uppercase tracking-wide text-gold-gradient drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] sm:text-5xl">
          Verify your Bullet
        </h1>
        <p className="mx-auto mt-3 max-w-xs text-sm text-white/70">
          Scratch the gold panel on the back of your Hollowtips and enter the
          hidden code to confirm it&apos;s authentic.
        </p>

        <div className="mt-8 rounded-2xl border border-gold/40 bg-black/85 p-6 shadow-[0_0_0_1px_rgba(212,175,55,0.25),0_0_40px_rgba(212,175,55,0.22)] backdrop-blur-xl">
          <CodeEntryForm />
        </div>

        <div className="mt-6 flex items-center justify-center gap-5 text-xs text-white/40">
          <a
            href="/lineup"
            className="inline-flex items-center gap-1.5 underline-offset-4 transition-colors hover:text-gold hover:underline"
          >
            <Sparkles className="h-3.5 w-3.5" /> Explore the lineup
          </a>
          <a
            href="/media"
            className="inline-flex items-center gap-1.5 underline-offset-4 transition-colors hover:text-gold hover:underline"
          >
            <Clapperboard className="h-3.5 w-3.5" /> Media
          </a>
        </div>

        <p className="mt-6 text-[11px] text-white/30">
          21+ only · © {new Date().getFullYear()} Hollowtips
        </p>
      </div>
    </main>
  );
}
