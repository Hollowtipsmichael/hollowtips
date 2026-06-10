import { HollowtipsLogo } from "@/components/brand/HollowtipsLogo";
import { CodeEntryForm } from "@/components/verify/CodeEntryForm";

export const metadata = { title: "Verify — Hollowtips" };

export default function VerifyEntryPage() {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-black px-5 py-10 text-white">
      <div className="grain pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.12),transparent_55%)]" />

      <div className="relative z-10 w-full max-w-sm text-center">
        <div className="mb-8 flex justify-center">
          <HollowtipsLogo variant="full" size={44} />
        </div>

        <h1 className="font-gta text-4xl uppercase tracking-wide text-gold-gradient sm:text-5xl">
          Verify your pack
        </h1>
        <p className="mx-auto mt-3 max-w-xs text-sm text-white/60">
          Scratch the gold panel on the back of your Hollowtips and enter the
          hidden code below to confirm it&apos;s authentic.
        </p>

        <div className="mt-8">
          <CodeEntryForm />
        </div>

        <p className="mt-8 text-[11px] text-white/30">
          21+ only · © {new Date().getFullYear()} Hollowtips
        </p>
      </div>
    </main>
  );
}
