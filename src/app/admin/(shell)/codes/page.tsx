import Link from "next/link";
import { QrCode, FileDown, Printer, Package } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { CodeStatus } from "@/lib/enums";
import {
  parseCodeFilters,
  buildCodeWhere,
  codeQuery,
} from "@/lib/codeFilters";
import { CodeStatusBadge } from "@/components/admin/codes/CodeStatusBadge";
import { CopyButton } from "@/components/admin/codes/CopyButton";
import { CodeRowActions } from "@/components/admin/codes/CodeRowActions";
import { PaginationControls } from "@/components/admin/codes/PaginationControls";
import { GenerateCodesDialog } from "@/components/admin/codes/GenerateCodesDialog";

export const metadata = { title: "Codes — Hollowtips Verify" };
export const dynamic = "force-dynamic";

export default async function CodesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const filters = parseCodeFilters(params);
  const where = buildCodeWhere(filters);

  const [products, total, codes] = await Promise.all([
    prisma.product.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        variants: {
          where: { isActive: true },
          orderBy: { createdAt: "asc" },
          select: { id: true, name: true },
        },
      },
    }),
    prisma.verificationCode.count({ where }),
    prisma.verificationCode.findMany({
      where,
      include: {
        product: { select: { name: true } },
        variant: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (filters.page - 1) * filters.perPage,
      take: filters.perPage,
    }),
  ]);

  // Export links carry only the data filters (not pagination).
  const exportQs = codeQuery({
    product: filters.product,
    status: filters.status,
    q: filters.q,
  });

  const selectCls =
    "focus-gold rounded-xl border border-subtle bg-bg/60 px-3 py-2 text-sm text-fg";

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1.5">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-gold">
            Verification
          </p>
          <h2 className="font-display text-3xl tracking-wide text-fg">
            Codes <span className="text-muted">({total})</span>
          </h2>
          <p className="text-sm text-muted">
            Generate, track and export product verification codes.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/api/admin/codes/export${exportQs}`}
            className="focus-gold inline-flex items-center gap-2 rounded-xl border border-subtle px-4 py-2.5 text-sm font-medium text-muted transition-colors hover:border-gold/40 hover:text-gold"
          >
            <FileDown className="h-4 w-4" />
            Export CSV
          </Link>
          <Link
            href={`/api/admin/codes/qr-zip${exportQs}`}
            className="focus-gold inline-flex items-center gap-2 rounded-xl border border-subtle px-4 py-2.5 text-sm font-medium text-muted transition-colors hover:border-gold/40 hover:text-gold"
          >
            <QrCode className="h-4 w-4" />
            QR (ZIP)
          </Link>
          <Link
            href={`/admin/codes/print${exportQs}`}
            target="_blank"
            className="focus-gold inline-flex items-center gap-2 rounded-xl border border-subtle px-4 py-2.5 text-sm font-medium text-muted transition-colors hover:border-gold/40 hover:text-gold"
          >
            <Printer className="h-4 w-4" />
            Print labels
          </Link>
          <GenerateCodesDialog
            products={products}
            defaultProductId={filters.product}
          />
        </div>
      </div>

      <div className="rule-gold" />

      {/* Filters */}
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
          Status
          <select name="status" defaultValue={filters.status ?? ""} className={selectCls}>
            <option value="">All statuses</option>
            <option value={CodeStatus.UNUSED}>Unused</option>
            <option value={CodeStatus.VERIFIED}>Verified</option>
            <option value={CodeStatus.FLAGGED}>Flagged</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs text-muted">
          Search code
          <input
            name="q"
            defaultValue={filters.q ?? ""}
            placeholder="HT-…"
            className={`${selectCls} placeholder:text-muted/60`}
          />
        </label>
        <button type="submit" className="btn-gold focus-gold">
          Apply
        </button>
        {(filters.product || filters.status || filters.q) && (
          <Link
            href="/admin/codes"
            className="focus-gold rounded-xl px-3 py-2.5 text-sm text-muted hover:text-fg"
          >
            Clear
          </Link>
        )}
      </form>

      {/* Table / empty state */}
      {codes.length === 0 ? (
        <div className="card grain flex flex-col items-center justify-center gap-3 py-16 text-center">
          <span className="grid h-12 w-12 place-items-center rounded-xl border border-gold/20 bg-gold/5 text-gold">
            <QrCode className="h-6 w-6" />
          </span>
          <p className="text-sm font-medium text-fg">No codes found</p>
          <p className="max-w-sm text-sm text-muted">
            {products.length === 0
              ? "Create a product first, then generate codes for it."
              : "Generate codes for a product, or adjust your filters."}
          </p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full min-w-[680px] text-sm">
              <thead>
                <tr className="border-b border-subtle text-left text-xs uppercase tracking-wide text-muted">
                  <th className="px-4 py-3 font-medium">Code</th>
                  <th className="px-4 py-3 font-medium">Product</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Scans</th>
                  <th className="px-4 py-3 font-medium">Created</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {codes.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b border-subtle/60 last:border-0 hover:bg-panel-raised/40"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-fg">{c.code}</span>
                        <CopyButton value={c.code} />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted">
                      <span className="inline-flex items-center gap-1.5">
                        <Package className="h-3.5 w-3.5 text-gold/60" />
                        <span>
                          {c.product.name}
                          {c.variant && (
                            <span className="block text-[11px] text-muted/70">
                              {c.variant.name}
                            </span>
                          )}
                        </span>
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <CodeStatusBadge status={c.status} />
                    </td>
                    <td className="px-4 py-3 text-muted">{c.scanCount}</td>
                    <td className="px-4 py-3 text-muted">
                      {c.createdAt.toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <CodeRowActions id={c.id} code={c.code} status={c.status} />
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
          makeHref={(p) => `/admin/codes${codeQuery({ ...filters, page: p })}`}
        />
      )}
    </div>
  );
}
