import Link from "next/link";
import { ScanLine, MapPin, Smartphone } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { DeviceType } from "@/lib/enums";
import { parseScanFilters, buildScanWhere, scanQuery } from "@/lib/scanFilters";
import { PaginationControls } from "@/components/admin/codes/PaginationControls";

export const metadata = { title: "Scans — Hollowtips Verify" };
export const dynamic = "force-dynamic";

export default async function ScansPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const filters = parseScanFilters(params);
  const where = buildScanWhere(filters);

  const [products, total, scans] = await Promise.all([
    prisma.product.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    prisma.scanEvent.count({ where }),
    prisma.scanEvent.findMany({
      where,
      include: {
        product: { select: { name: true } },
        code: { select: { code: true } },
      },
      orderBy: { scannedAt: "desc" },
      skip: (filters.page - 1) * filters.perPage,
      take: filters.perPage,
    }),
  ]);

  const selectCls =
    "focus-gold rounded-xl border border-subtle bg-bg/60 px-3 py-2 text-sm text-fg";

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-1.5">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-gold">
          Activity
        </p>
        <h2 className="font-display text-3xl tracking-wide text-fg">
          Scans <span className="text-muted">({total})</span>
        </h2>
        <p className="text-sm text-muted">
          Every product verification scan, with location &amp; device.
        </p>
      </div>

      <div className="rule-gold" />

      <form
        method="get"
        className="flex flex-wrap items-end gap-3 rounded-2xl border border-subtle bg-panel p-4"
      >
        <label className="flex flex-col gap-1 text-xs text-muted">
          Product
          <select name="product" defaultValue={filters.product ?? ""} className={selectCls}>
            <option value="">All products</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs text-muted">
          Device
          <select name="device" defaultValue={filters.device ?? ""} className={selectCls}>
            <option value="">All devices</option>
            {Object.values(DeviceType).map((d) => (
              <option key={d} value={d}>
                {d.charAt(0) + d.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className="btn-gold focus-gold">
          Apply
        </button>
        {(filters.product || filters.device) && (
          <Link
            href="/admin/scans"
            className="focus-gold rounded-xl px-3 py-2.5 text-sm text-muted hover:text-fg"
          >
            Clear
          </Link>
        )}
      </form>

      {scans.length === 0 ? (
        <div className="card grain flex flex-col items-center justify-center gap-3 py-16 text-center">
          <span className="grid h-12 w-12 place-items-center rounded-xl border border-gold/20 bg-gold/5 text-gold">
            <ScanLine className="h-6 w-6" />
          </span>
          <p className="text-sm font-medium text-fg">No scans yet</p>
          <p className="max-w-sm text-sm text-muted">
            Scans appear here as customers verify products.
          </p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-subtle text-left text-xs uppercase tracking-wide text-muted">
                  <th className="px-4 py-3 font-medium">Code</th>
                  <th className="px-4 py-3 font-medium">Product</th>
                  <th className="px-4 py-3 font-medium">Location</th>
                  <th className="px-4 py-3 font-medium">Device</th>
                  <th className="px-4 py-3 font-medium">Result</th>
                  <th className="px-4 py-3 font-medium">When</th>
                </tr>
              </thead>
              <tbody>
                {scans.map((s) => (
                  <tr
                    key={s.id}
                    className="border-b border-subtle/60 last:border-0 hover:bg-panel-raised/40"
                  >
                    <td className="px-4 py-3 font-mono text-xs text-fg">
                      {s.code?.code ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-muted">{s.product.name}</td>
                    <td className="px-4 py-3 text-muted">
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-gold/60" />
                        {[s.city, s.region, s.country].filter(Boolean).join(", ") ||
                          "Unknown"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted">
                      <span className="inline-flex items-center gap-1.5">
                        <Smartphone className="h-3.5 w-3.5 text-gold/60" />
                        {s.deviceType.charAt(0) +
                          s.deviceType.slice(1).toLowerCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {s.isFirstScan ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-graffiti-lime/30 bg-graffiti-lime/10 px-2 py-0.5 text-xs font-medium text-graffiti-lime">
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full border border-graffiti-pink/30 bg-graffiti-pink/10 px-2 py-0.5 text-xs font-medium text-graffiti-pink">
                          Flagged
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {s.scannedAt.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {total > 0 && (
        <PaginationControls
          page={filters.page}
          perPage={filters.perPage}
          total={total}
          makeHref={(p) => `/admin/scans${scanQuery({ ...filters, page: p })}`}
        />
      )}
    </div>
  );
}
