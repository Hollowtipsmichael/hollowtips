import Link from "next/link";
import { Package, Plus, Pencil, QrCode } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { StatusPill } from "@/components/admin/StatusPill";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";

export const metadata = { title: "Products — Hollowtips Verify" };
export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { verificationCodes: true } } },
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1.5">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-gold">
            Catalog
          </p>
          <h2 className="font-condensed text-3xl tracking-wide text-fg">
            Products{" "}
            <span className="text-muted">({products.length})</span>
          </h2>
          <p className="text-sm text-muted">
            Manage the Hollowtips product lineup, media and details.
          </p>
        </div>
        <Link href="/admin/products/new" className="btn-gold focus-gold">
          <Plus className="h-4 w-4" />
          Add Product
        </Link>
      </div>

      <div className="rule-gold" />

      {products.length === 0 ? (
        <div className="card grain flex flex-col items-center justify-center gap-3 py-16 text-center">
          <span className="grid h-12 w-12 place-items-center rounded-xl border border-gold/20 bg-gold/5 text-gold">
            <Package className="h-6 w-6" />
          </span>
          <p className="text-sm font-medium text-fg">No products yet</p>
          <p className="max-w-sm text-sm text-muted">
            Add your first product to start issuing verification codes.
          </p>
          <Link href="/admin/products/new" className="btn-gold focus-gold mt-2">
            <Plus className="h-4 w-4" />
            Add Product
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((p) => (
            <div key={p.id} className="card card-hover grain overflow-hidden">
              {/* Media / placeholder */}
              <div className="relative aspect-[16/10] overflow-hidden bg-black">
                {p.productImageUrl || p.artworkUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={(p.productImageUrl || p.artworkUrl) as string}
                    alt={p.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.12),transparent_60%)]">
                    <Package className="h-8 w-8 text-gold/40" />
                  </div>
                )}
                <div className="absolute right-3 top-3">
                  <StatusPill active={p.isActive} />
                </div>
              </div>

              {/* Body */}
              <div className="space-y-3 p-4">
                <div>
                  <h3 className="font-condensed text-lg leading-tight tracking-wide text-fg">
                    {p.name}
                  </h3>
                  {p.strainName && (
                    <p className="text-xs text-muted">{p.strainName}</p>
                  )}
                </div>

                <Link
                  href={`/admin/codes?product=${p.id}`}
                  className="inline-flex w-fit items-center gap-1.5 text-xs text-muted transition-colors hover:text-gold"
                >
                  <QrCode className="h-3.5 w-3.5" />
                  {p._count.verificationCodes} code
                  {p._count.verificationCodes === 1 ? "" : "s"}
                </Link>

                <div className="flex items-center justify-between gap-2 border-t border-subtle pt-3">
                  <span className="truncate font-mono text-[11px] text-muted/70">
                    /{p.slug}
                  </span>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/products/${p.id}/edit`}
                      aria-label={`Edit ${p.name}`}
                      className="focus-gold grid h-9 w-9 place-items-center rounded-lg border border-subtle text-muted transition-colors hover:border-gold/40 hover:text-gold"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <DeleteProductButton id={p.id} name={p.name} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
