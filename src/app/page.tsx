import { ShieldCheck, QrCode, Sparkles, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { HollowtipsLogo } from "@/components/brand/HollowtipsLogo";
import { AgeGate } from "@/components/public/AgeGate";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Hollowtips — Live Resin Liquid Diamonds",
  description: "Premium 2G disposables. Scratch & scan to verify authenticity.",
};

const TYPE_TINT: Record<string, string> = {
  INDICA: "from-graffiti-pink/30",
  SATIVA: "from-graffiti-lime/30",
  HYBRID: "from-gold/30",
};

export default async function LandingPage() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <AgeGate />

      {/* texture */}
      <div className="grain pointer-events-none fixed inset-0 opacity-50" />

      {/* Header */}
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-5 py-6">
        <HollowtipsLogo variant="full" size={34} />
        <a href="#verify" className="btn-gold focus-gold text-sm">
          <ShieldCheck className="h-4 w-4" />
          Verify
        </a>
      </header>

      {/* Hero — GTA loading screen */}
      <section className="relative z-10 mx-auto max-w-6xl px-5 pb-16 pt-10 text-center sm:pt-16">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.14),transparent_60%)]" />
        <p className="relative inline-block rounded-full border border-gold/30 bg-gold/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.3em] text-gold">
          Round I — V1
        </p>
        <h1 className="relative mt-6 font-gta text-6xl uppercase leading-[0.9] tracking-wide text-gold-gradient drop-shadow-[0_3px_0_rgba(0,0,0,0.5)] sm:text-8xl">
          Hollowtips
        </h1>
        <p className="relative mx-auto mt-4 max-w-xl text-sm uppercase tracking-[0.3em] text-white/60 sm:text-base">
          Live Resin · Liquid Diamonds · 2 Gram
        </p>
        <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a href="#flavors" className="btn-gold focus-gold">
            <Sparkles className="h-4 w-4" />
            Explore the lineup
          </a>
          <a
            href="#verify"
            className="focus-gold inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-2.5 text-sm font-semibold text-white/80 transition-colors hover:border-gold/50 hover:text-gold"
          >
            Verify your product <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      {/* Flavor showcase */}
      <section id="flavors" className="relative z-10 mx-auto max-w-6xl px-5 py-12">
        <h2 className="mb-6 font-gta text-3xl uppercase tracking-wide text-white sm:text-4xl">
          The Lineup
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {products.map((p) => {
            const art = p.artworkUrl || p.productImageUrl;
            const tint = (p.productType && TYPE_TINT[p.productType]) || "from-gold/20";
            return (
              <div
                key={p.id}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c0c]"
              >
                <div
                  className={`relative aspect-[3/4] w-full bg-gradient-to-b ${tint} to-black`}
                >
                  {art ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={art}
                      alt={p.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center">
                      <span className="px-2 text-center font-gta text-xl uppercase leading-tight tracking-wide text-white/80">
                        {p.name}
                      </span>
                    </div>
                  )}
                  {p.productType && (
                    <span className="absolute left-2 top-2 rounded-full border border-gold/40 bg-black/70 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gold backdrop-blur">
                      {p.productType}
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <p className="truncate font-gta text-sm uppercase tracking-wide text-white">
                    {p.name}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Verify explainer */}
      <section
        id="verify"
        className="relative z-10 mx-auto max-w-3xl px-5 py-16 text-center"
      >
        <div className="rounded-3xl border border-gold/20 bg-[#0c0c0c]/80 p-8 sm:p-12">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gold-gradient text-black shadow-gold-glow">
            <QrCode className="h-7 w-7" />
          </span>
          <h2 className="mt-5 font-gta text-3xl uppercase tracking-wide text-gold-gradient sm:text-4xl">
            Scratch &amp; Scan
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-white/60">
            Every Hollowtips pack has a hidden verification code. Scratch the gold
            panel on the back, scan the QR with your phone camera, and confirm
            you&apos;ve got the real thing.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { n: "01", t: "Scratch", d: "Reveal the QR under the gold panel." },
              { n: "02", t: "Scan", d: "Point your camera at the code." },
              { n: "03", t: "Verify", d: "See instant authenticity + product info." },
            ].map((s) => (
              <div key={s.n} className="rounded-2xl border border-white/10 bg-black/40 p-5">
                <p className="font-gta text-3xl text-gold/40">{s.n}</p>
                <p className="mt-1 font-gta text-lg uppercase tracking-wide text-white">
                  {s.t}
                </p>
                <p className="mt-1 text-xs text-white/50">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 px-5 py-10 text-center">
        <HollowtipsLogo variant="mark" size={28} className="mx-auto" />
        <p className="mt-4 text-xs text-white/40">
          © {new Date().getFullYear()} Hollowtips. 21+ only. Keep out of reach of
          children. For use only by adults.
        </p>
      </footer>
    </main>
  );
}
