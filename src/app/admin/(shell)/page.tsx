import Link from "next/link";
import { getServerSession } from "next-auth";
import {
  QrCode,
  ScanLine,
  BadgeCheck,
  Flag,
  Activity,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/admin/StatCard";
import { CodeStatus } from "@/lib/enums";

export const metadata = {
  title: "Dashboard — Hollowtips Verify",
};

// Always reflect the latest DB counts.
export const dynamic = "force-dynamic";

async function getStats() {
  const [totalCodes, totalScans, verified, flagged] = await Promise.all([
    prisma.verificationCode.count(),
    prisma.scanEvent.count(),
    prisma.verificationCode.count({ where: { status: CodeStatus.VERIFIED } }),
    prisma.verificationCode.count({ where: { status: CodeStatus.FLAGGED } }),
  ]);
  return { totalCodes, totalScans, verified, flagged };
}

export default async function DashboardPage() {
  const [session, stats, recentScans] = await Promise.all([
    getServerSession(authOptions),
    getStats(),
    prisma.scanEvent.findMany({
      include: {
        product: { select: { name: true } },
        code: { select: { code: true } },
      },
      orderBy: { scannedAt: "desc" },
      take: 8,
    }),
  ]);

  const firstName = (session?.user?.name ?? "Admin").split(" ")[0];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome header */}
      <header className="space-y-1.5">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-gold">
          Hollowtips Verify
        </p>
        <h2 className="font-condensed text-3xl tracking-wide text-fg sm:text-4xl">
          Welcome back, {firstName}
        </h2>
        <p className="max-w-2xl text-sm text-muted">
          Your product-authentication command center. Codes, scans and
          verification activity will surface here as your catalog goes live.
        </p>
      </header>

      <div className="rule-gold" />

      {/* Stat cards */}
      <section
        aria-label="Overview"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <StatCard
          label="Total Codes"
          value={stats.totalCodes.toLocaleString()}
          icon={QrCode}
          accent="gold"
          hint="Verification codes issued"
        />
        <StatCard
          label="Total Scans"
          value={stats.totalScans.toLocaleString()}
          icon={ScanLine}
          accent="orange"
          hint="Across all products"
        />
        <StatCard
          label="Verified"
          value={stats.verified.toLocaleString()}
          icon={BadgeCheck}
          accent="lime"
          hint="Authenticated codes"
        />
        <StatCard
          label="Flagged"
          value={stats.flagged.toLocaleString()}
          icon={Flag}
          accent="pink"
          hint="Needs attention"
        />
      </section>

      {/* Recent scans — styled empty state */}
      <section aria-label="Recent scans" className="card grain p-6 sm:p-8">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-condensed text-xl tracking-wide text-fg">
            Recent Scans
          </h3>
          {recentScans.length > 0 && (
            <Link
              href="/admin/scans"
              className="inline-flex items-center gap-1 text-xs text-muted transition-colors hover:text-gold"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>

        {recentScans.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-subtle py-14 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-xl border border-gold/20 bg-gold/5 text-gold">
              <Activity className="h-6 w-6" />
            </span>
            <p className="text-sm font-medium text-fg">No scans yet</p>
            <p className="max-w-sm text-sm text-muted">
              Once products ship with QR codes, real-time scan activity and
              geolocation will appear here.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-subtle/60">
            {recentScans.map((s) => (
              <li key={s.id} className="flex items-center gap-3 py-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-gold/20 bg-gold/5 text-gold">
                  <ScanLine className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-fg">
                    {s.product.name}
                    {s.isFirstScan && (
                      <span className="ml-2 rounded-full border border-graffiti-lime/30 bg-graffiti-lime/10 px-1.5 py-0.5 text-[10px] text-graffiti-lime">
                        First
                      </span>
                    )}
                  </p>
                  <p className="flex items-center gap-1 truncate text-xs text-muted">
                    <MapPin className="h-3 w-3" />
                    {[s.city, s.country].filter(Boolean).join(", ") || "Unknown"}
                    <span className="font-mono text-muted/60">· {s.code?.code}</span>
                  </p>
                </div>
                <span className="shrink-0 text-xs text-muted">
                  {s.scannedAt.toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
