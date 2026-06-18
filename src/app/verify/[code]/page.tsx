import Link from "next/link";
import { Home, RotateCcw } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { CodeStatus } from "@/lib/enums";
import { HollowtipsLogo } from "@/components/brand/HollowtipsLogo";
import { ScanBeacon } from "@/components/verify/ScanBeacon";
import { ResultIcon } from "@/components/verify/ResultIcon";
import { SocialRow } from "@/components/verify/SocialRow";
import { GiveawayStrip } from "@/components/verify/GiveawayStrip";
import { TelegramStrip } from "@/components/verify/TelegramStrip";

export const dynamic = "force-dynamic";
export const metadata = { title: "Verify — Hollowtips" };

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="grain pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.10),transparent_55%)]" />
      <div className="relative z-10 mx-auto flex w-full max-w-md flex-col items-center gap-5 px-5 pb-12 pt-8">
        {children}
      </div>
    </main>
  );
}

const btnGold =
  "btn-gold focus-gold w-full justify-center";
const btnDark =
  "focus-gold inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white/80 transition-colors hover:border-gold/50 hover:text-gold";

export default async function VerifyPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const record = await prisma.verificationCode.findUnique({
    where: { code },
    include: { product: true, variant: true },
  });

  const legit = !!record && record.status !== CodeStatus.FLAGGED;

  return (
    <Shell>
      {record && <ScanBeacon code={code} />}

      <HollowtipsLogo variant="full" size={34} />

      {legit ? (
        <ResultIcon variant="legit" />
      ) : (
        <ResultIcon variant="busted" />
      )}

      <div className="text-center">
        <h1
          className={`font-gta text-6xl uppercase leading-none tracking-wide drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] ${
            legit ? "text-graffiti-lime" : "text-sky-400"
          }`}
        >
          {legit ? "Legit" : "Busted"}
        </h1>
        <p className="mt-2 text-sm uppercase tracking-[0.3em] text-white/60">
          {legit ? "Authentic product" : "Not recognized"}
        </p>
      </div>

      {legit && record ? (
        // Product card with SKU / type / size + scan count
        <div className="flex w-full items-center justify-between gap-4 rounded-2xl border border-gold/30 bg-black/60 p-5 backdrop-blur-xl">
          <div className="min-w-0">
            <h2 className="font-gta text-2xl uppercase tracking-wide text-white">
              {record.product.name}
            </h2>
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
              {record.product.sku && (
                <span className="rounded-md border border-white/15 px-2 py-0.5 text-xs font-medium text-white/70">
                  {record.product.sku}
                </span>
              )}
              {record.product.productType && (
                <span className="rounded-md border border-gold/40 bg-gold/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-gold">
                  {record.product.productType}
                </span>
              )}
              <span className="rounded-md border border-white/15 px-2 py-0.5 text-xs font-medium text-white/70">
                {record.product.size ?? "2G"}
              </span>
            </div>
          </div>
          <div className="shrink-0 text-center">
            <p className="font-gta text-3xl leading-none text-gold">
              {record.scanCount}×
            </p>
            <p className="mt-1 text-[10px] uppercase tracking-widest text-white/40">
              Scanned
            </p>
          </div>
        </div>
      ) : (
        <code className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-white/50">
          {code}
        </code>
      )}

      {/* Buttons */}
      <div className="flex w-full flex-col gap-2.5">
        {!legit && (
          <Link href="/verify" className={btnGold}>
            <RotateCcw className="h-4 w-4" />
            Try Again
          </Link>
        )}
        <Link href="/" className={btnDark}>
          <Home className="h-4 w-4" />
          Back to Home
        </Link>
      </div>

      {/* Social + giveaway + telegram */}
      <div className="mt-2 w-full space-y-4">
        <SocialRow />
        <GiveawayStrip />
        <TelegramStrip />
      </div>

      <p className="mt-2 text-center text-[11px] text-white/30">
        Scratch &amp; scan · © {new Date().getFullYear()} Hollowtips
      </p>
    </Shell>
  );
}
