import { QrCode, ScanLine, BadgeCheck, Flag, Mail, Package } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { CodeStatus } from "@/lib/enums";
import { StatCard } from "@/components/admin/StatCard";
import {
  ScansLineChart,
  DevicePieChart,
  StatusBarChart,
} from "@/components/admin/analytics/AnalyticsCharts";

export const metadata = { title: "Analytics — Hollowtips Verify" };
export const dynamic = "force-dynamic";

const DAY_MS = 24 * 60 * 60 * 1000;

export default async function AnalyticsPage() {
  const since = new Date(Date.now() - 13 * DAY_MS);
  since.setHours(0, 0, 0, 0);

  const [
    totalCodes,
    totalScans,
    verified,
    flagged,
    totalProducts,
    totalEmails,
    recentScans,
    deviceGroups,
    countryGroups,
    productScans,
  ] = await Promise.all([
    prisma.verificationCode.count(),
    prisma.scanEvent.count(),
    prisma.verificationCode.count({ where: { status: CodeStatus.VERIFIED } }),
    prisma.verificationCode.count({ where: { status: CodeStatus.FLAGGED } }),
    prisma.product.count(),
    prisma.emailCapture.count(),
    prisma.scanEvent.findMany({
      where: { scannedAt: { gte: since } },
      select: { scannedAt: true },
    }),
    prisma.scanEvent.groupBy({ by: ["deviceType"], _count: { _all: true } }),
    prisma.scanEvent.groupBy({
      by: ["country"],
      _count: { _all: true },
      where: { country: { not: null } },
    }),
    prisma.scanEvent.groupBy({ by: ["productId"], _count: { _all: true } }),
  ]);

  // Bucket scans by day (last 14 days)
  const buckets = new Map<string, number>();
  for (let i = 0; i < 14; i++) {
    const d = new Date(since.getTime() + i * DAY_MS);
    buckets.set(d.toLocaleDateString(undefined, { month: "short", day: "numeric" }), 0);
  }
  for (const s of recentScans) {
    const key = s.scannedAt.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
    if (buckets.has(key)) buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }
  const scansSeries = [...buckets.entries()].map(([day, scans]) => ({ day, scans }));

  const deviceData = deviceGroups.map((g) => ({
    name: g.deviceType.charAt(0) + g.deviceType.slice(1).toLowerCase(),
    value: g._count._all,
  }));

  const statusData = [
    { name: "Verified", value: verified },
    { name: "Flagged", value: flagged },
    { name: "Unused", value: Math.max(0, totalCodes - verified - flagged) },
  ];

  const topCountries = countryGroups
    .map((g) => ({ name: g.country as string, value: g._count._all }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  // Top products by scans
  const productIds = productScans.map((p) => p.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, name: true },
  });
  const nameById = new Map(products.map((p) => [p.id, p.name]));
  const topProducts = productScans
    .map((p) => ({ name: nameById.get(p.productId) ?? "—", value: p._count._all }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);
  const maxProduct = Math.max(1, ...topProducts.map((p) => p.value));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-1.5">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-gold">
          Insights
        </p>
        <h2 className="font-display text-3xl tracking-wide text-fg">Analytics</h2>
      </div>

      <div className="rule-gold" />

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Scans" value={totalScans.toLocaleString()} icon={ScanLine} accent="orange" />
        <StatCard label="Codes" value={totalCodes.toLocaleString()} icon={QrCode} accent="gold" />
        <StatCard label="Verified" value={verified.toLocaleString()} icon={BadgeCheck} accent="lime" />
        <StatCard label="Flagged" value={flagged.toLocaleString()} icon={Flag} accent="pink" />
        <StatCard label="Products" value={totalProducts.toLocaleString()} icon={Package} accent="gold" />
        <StatCard label="Emails" value={totalEmails.toLocaleString()} icon={Mail} accent="lime" />
      </section>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <h3 className="mb-4 font-display text-lg tracking-wide text-fg">
            Scans — last 14 days
          </h3>
          <ScansLineChart data={scansSeries} />
        </div>
        <div className="card p-5">
          <h3 className="mb-4 font-display text-lg tracking-wide text-fg">
            By device
          </h3>
          <DevicePieChart data={deviceData} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="card p-5">
          <h3 className="mb-4 font-display text-lg tracking-wide text-fg">
            Codes by status
          </h3>
          <StatusBarChart data={statusData} />
        </div>
        <div className="card p-5">
          <h3 className="mb-4 font-display text-lg tracking-wide text-fg">
            Top countries
          </h3>
          {topCountries.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted">No data yet</p>
          ) : (
            <ul className="space-y-2">
              {topCountries.map((c) => (
                <li key={c.name} className="flex items-center justify-between text-sm">
                  <span className="text-muted">{c.name}</span>
                  <span className="font-medium text-fg">{c.value}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="card p-5">
          <h3 className="mb-4 font-display text-lg tracking-wide text-fg">
            Top products
          </h3>
          {topProducts.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted">No data yet</p>
          ) : (
            <ul className="space-y-3">
              {topProducts.map((p) => (
                <li key={p.name} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="truncate text-muted">{p.name}</span>
                    <span className="font-medium text-fg">{p.value}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-panel-raised">
                    <div
                      className="h-full bg-gold-gradient"
                      style={{ width: `${(p.value / maxProduct) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
