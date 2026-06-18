import Link from "next/link";
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

const title = (s: string) => s.charAt(0) + s.slice(1).toLowerCase();

const homeIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <polyline points="9 22 9 12 15 12 15 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

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
    <main className="flex min-h-screen flex-col items-center bg-[#0A0A0A] text-[#F2F0EA]">
      {record && <ScanBeacon code={code} />}

      {/* Nav */}
      <nav className="flex w-full max-w-[480px] items-center justify-between px-6 pt-5">
        <Link href="/">
          <HollowtipsLogo variant="full" size={26} />
        </Link>
      </nav>

      <div className="flex w-full max-w-[480px] flex-1 flex-col items-center px-6">
        {/* Icon */}
        <div className="flex w-full justify-center pb-6 pt-7">
          <ResultIcon variant={legit ? "legit" : "busted"} />
        </div>

        {/* Verdict */}
        <h1
          className="font-condensed text-[72px] font-black uppercase leading-none tracking-[4px]"
          style={{ color: legit ? "#34C759" : "#3BBFFF" }}
        >
          {legit ? "Legit" : "Busted"}
        </h1>
        <p className="mt-2 font-condensed text-[13px] font-semibold uppercase tracking-[4px] text-[#888]">
          {legit ? "Authentic Hollowtips Product" : "Code not recognized"}
        </p>

        {!legit && (
          <>
            <p className="mt-3.5 max-w-[300px] text-center text-[15px] leading-relaxed text-[#aaa]">
              This code isn&apos;t in our system. It may be mistyped or
              counterfeit. Buy only from authorized Hollowtips sources.
            </p>
            <div className="mt-4 rounded-md border border-[#222] bg-[#1a1a1a] px-4 py-2 font-condensed text-[13px] tracking-[3px] text-[#888]">
              {code}
            </div>
          </>
        )}

        {/* LEGIT product card */}
        {legit && record && (
          <div className="mt-5 flex w-full items-center gap-4 rounded-[14px] border border-[#222] bg-[#111] px-5 py-[18px]">
            <span className="h-3 w-3 shrink-0 rounded-full bg-gold" />
            <div className="min-w-0">
              <div className="font-condensed text-[18px] font-bold tracking-[0.5px] text-white">
                {record.product.name}
              </div>
              <div className="mt-0.5 text-xs text-[#555]">
                {[
                  record.product.sku,
                  record.product.productType ? title(record.product.productType) : null,
                  record.product.size ?? "2G",
                  "Live Resin Liquid Diamonds",
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </div>
            </div>
            <div className="ml-auto shrink-0 text-right">
              <div className="font-condensed text-[22px] font-bold text-gold">
                {record.scanCount}×
              </div>
              <div className="text-[10px] uppercase tracking-[1px] text-[#444]">
                Scanned
              </div>
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="my-8 h-px w-full bg-[#222]" />

        {/* Actions */}
        <div className="flex w-full flex-col gap-3">
          {!legit && (
            <Link
              href="/verify"
              className="flex w-full items-center justify-center gap-2.5 rounded-[10px] bg-gold px-5 py-4 font-condensed text-base font-bold uppercase tracking-[1.5px] text-black transition active:scale-[0.98]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M1 4v6h6M23 20v-6h-6" stroke="#000" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" stroke="#000" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Try Again
            </Link>
          )}
          <Link
            href="/"
            className="flex w-full items-center justify-center gap-2.5 rounded-[10px] border border-[#2a2a2a] bg-[#1a1a1a] px-5 py-4 font-condensed text-base font-bold uppercase tracking-[1.5px] text-[#F2F0EA] transition active:scale-[0.98]"
          >
            <span className="text-[#aaa]">{homeIcon}</span>
            Back to Home
          </Link>
        </div>

        {/* Social + giveaway + telegram */}
        <div className="mt-7 w-full">
          <SocialRow />
        </div>
        <div className="mt-5 w-full">
          <GiveawayStrip />
        </div>
        <div className="mt-3 w-full">
          <TelegramStrip />
        </div>
      </div>

      <p className="px-6 pb-9 pt-8 text-center text-[11px] tracking-[1px] text-[#333]">
        21+ ONLY · © {new Date().getFullYear()} HOLLOWTIPS
      </p>
    </main>
  );
}
