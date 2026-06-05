import { getServerSession } from "next-auth";
import { QrCode, ScanLine, BadgeCheck, Flag, Activity } from "lucide-react";
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
  const [session, stats] = await Promise.all([
    getServerSession(authOptions),
    getStats(),
  ]);

  const firstName = (session?.user?.name ?? "Admin").split(" ")[0];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome header */}
      <header className="space-y-1.5">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-gold">
          Hollowtips Verify
        </p>
        <h2 className="font-display text-3xl tracking-wide text-fg sm:text-4xl">
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
          <h3 className="font-display text-xl tracking-wide text-fg">
            Recent Scans
          </h3>
          <span className="rounded-full border border-subtle px-3 py-1 text-xs text-muted">
            Live feed
          </span>
        </div>

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
      </section>
    </div>
  );
}
