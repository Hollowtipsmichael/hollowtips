import { Sparkles } from "lucide-react";
import { HollowtipsLogo } from "@/components/brand/HollowtipsLogo";
import { MatrixRain } from "@/components/brand/MatrixRain";
import { CodeEntryForm } from "@/components/verify/CodeEntryForm";

export const metadata = {
  title: "Verify — Hollowtips",
  description: "Scratch the panel on your Hollowtips pack and enter the code to verify authenticity.",
};

export default function HomeVerifyPage() {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-black px-5 py-10 text-white">
      {/* Cinematic HOLLOWTIPS code-rain backdrop */}
      <div className="absolute inset-0 z-0">
        <MatrixRain opacity={0.85} />
      </div>
      {/* center-dark scrim: keeps the centered text crisp, lets side columns show */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_50%_60%_at_center,rgba(0,0,0,0.78)_0%,rgba(0,0,0,0.35)_45%,transparent_75%)]" />

      <div className="relative z-20 w-full max-w-sm animate-fade-in text-center">
        <div className="mb-8 flex justify-center">
          <HollowtipsLogo variant="full" size={46} />
        </div>

        <h1 className="font-gta text-4xl uppercase tracking-wide text-gold-gradient sm:text-5xl">
          Verify your pack
        </h1>
        <p className="mx-auto mt-3 max-w-xs text-sm text-white/60">
          Scratch the gold panel on the back of your Hollowtips and enter the
          hidden code to confirm it&apos;s authentic.
        </p>

        <div className="mt-8 rounded-2xl border border-gold/20 bg-[#0c0c0c]/80 p-6 shadow-gold-glow backdrop-blur-xl">
          <CodeEntryForm />
        </div>

        <a
          href="/lineup"
          className="mt-6 inline-flex items-center gap-1.5 text-xs text-white/40 underline-offset-4 transition-colors hover:text-gold hover:underline"
        >
          <Sparkles className="h-3.5 w-3.5" /> Explore the lineup
        </a>

        <p className="mt-6 text-[11px] text-white/30">
          21+ only · © {new Date().getFullYear()} Hollowtips
        </p>
      </div>
    </main>
  );
}
