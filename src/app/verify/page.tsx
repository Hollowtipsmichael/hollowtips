import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CodeStatus } from "@/lib/enums";
import { HollowtipsLogo } from "@/components/brand/HollowtipsLogo";
import { MatrixRain } from "@/components/brand/MatrixRain";
import { CodeEntryForm } from "@/components/verify/CodeEntryForm";
import { ScanBeacon } from "@/components/verify/ScanBeacon";
import { VerifyResult } from "@/components/verify/VerifyResult";

export const dynamic = "force-dynamic";
export const metadata = { title: "Verify — Hollowtips" };

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;
  const normalized = (code ?? "").trim().toUpperCase();

  // ── STATE 1: entry form (no code) ─────────────────────────────
  if (!normalized) {
    return (
      <main className="relative grid min-h-screen place-items-center overflow-hidden bg-black px-5 py-10 text-white">
        <div className="absolute inset-0 z-0">
          <MatrixRain opacity={0.8} />
        </div>
        <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_48%_72%_at_center,rgba(0,0,0,0.92)_0%,rgba(0,0,0,0.6)_48%,transparent_82%)]" />

        <div className="relative z-20 w-full max-w-md animate-fade-in rounded-3xl border border-gold/15 bg-black/55 p-6 text-center shadow-[0_0_80px_rgba(0,0,0,0.85)] backdrop-blur-md sm:p-8">
          <div className="mb-7 flex justify-center">
            <HollowtipsLogo variant="full" size={44} />
          </div>

          <h1 className="font-gta text-4xl uppercase tracking-wide text-gold-gradient drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] sm:text-5xl">
            Verify your Bullet
          </h1>
          <p className="mx-auto mt-3 max-w-xs text-sm text-white/70">
            Scratch the gold panel on the back of your Hollowtips and enter the
            hidden code below to confirm it&apos;s authentic.
          </p>

          <div className="mt-8 rounded-2xl border border-gold/40 bg-black/85 p-6 shadow-[0_0_0_1px_rgba(212,175,55,0.25),0_0_40px_rgba(212,175,55,0.22)] backdrop-blur-xl">
            <CodeEntryForm />
          </div>

          <p className="mt-8 text-[11px] text-white/40">
            21+ only · © {new Date().getFullYear()} Hollowtips
          </p>
        </div>
      </main>
    );
  }

  // ── STATE 2 / 3: LEGIT or BUSTED result ──────────────────────
  const record = await prisma.verificationCode.findUnique({
    where: { code: normalized },
    include: { product: true, variant: true },
  });
  const legit = !!record && record.status !== CodeStatus.FLAGGED;

  // Variant media takes precedence over the product's when present.
  const product = record
    ? {
        name: record.variant?.strainName || record.product.name,
        productType: record.variant?.productType ?? record.product.productType,
        artworkUrl: record.variant?.artworkUrl ?? record.product.artworkUrl,
        productImageUrl:
          record.variant?.productImageUrl ?? record.product.productImageUrl,
      }
    : null;

  return (
    <main className="relative flex min-h-screen flex-col items-center bg-[#0a0a0a] text-[#F2F0EA]">
      {record && <ScanBeacon code={normalized} />}

      {/* signature H-monogram luxury texture */}
      <div className="bg-monogram pointer-events-none absolute inset-0" />

      <nav className="relative z-10 flex w-full max-w-[480px] items-center justify-between px-6 pt-5">
        <Link href="/">
          <HollowtipsLogo variant="full" size={26} />
        </Link>
      </nav>

      <div className="relative z-10 flex w-full max-w-[480px] flex-1 flex-col items-center px-6 pb-12">
        <VerifyResult
          variant={legit ? "legit" : "busted"}
          code={normalized}
          product={legit ? product : null}
        />
      </div>

      <p className="relative z-10 px-6 pb-9 text-center text-[11px] tracking-[1px] text-[#333]">
        21+ ONLY · © {new Date().getFullYear()} HOLLOWTIPS
      </p>
    </main>
  );
}
