import Link from "next/link";
import { Mail, FileDown, Package } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { DeleteEmailButton } from "@/components/admin/emails/DeleteEmailButton";

export const metadata = { title: "Emails — Hollowtips Verify" };
export const dynamic = "force-dynamic";

export default async function EmailsPage() {
  const emails = await prisma.emailCapture.findMany({
    include: { product: { select: { name: true } } },
    orderBy: { capturedAt: "desc" },
    take: 500,
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1.5">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-gold">
            Marketing
          </p>
          <h2 className="font-display text-3xl tracking-wide text-fg">
            Emails <span className="text-muted">({emails.length})</span>
          </h2>
          <p className="text-sm text-muted">
            Opt-ins captured on the product verify page.
          </p>
        </div>
        {emails.length > 0 && (
          <Link
            href="/api/admin/emails/export"
            className="focus-gold inline-flex items-center gap-2 rounded-xl border border-subtle px-4 py-2.5 text-sm font-medium text-muted transition-colors hover:border-gold/40 hover:text-gold"
          >
            <FileDown className="h-4 w-4" />
            Export CSV
          </Link>
        )}
      </div>

      <div className="rule-gold" />

      {emails.length === 0 ? (
        <div className="card grain flex flex-col items-center justify-center gap-3 py-16 text-center">
          <span className="grid h-12 w-12 place-items-center rounded-xl border border-gold/20 bg-gold/5 text-gold">
            <Mail className="h-6 w-6" />
          </span>
          <p className="text-sm font-medium text-fg">No emails yet</p>
          <p className="max-w-sm text-sm text-muted">
            Customer opt-ins from the verify page will collect here.
          </p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-subtle text-left text-xs uppercase tracking-wide text-muted">
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Phone</th>
                  <th className="px-4 py-3 font-medium">Product</th>
                  <th className="px-4 py-3 font-medium">Captured</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {emails.map((e) => (
                  <tr
                    key={e.id}
                    className="border-b border-subtle/60 last:border-0 hover:bg-panel-raised/40"
                  >
                    <td className="px-4 py-3 text-fg">{e.email}</td>
                    <td className="px-4 py-3 text-muted">{e.name ?? "—"}</td>
                    <td className="px-4 py-3 text-muted">{e.phone ?? "—"}</td>
                    <td className="px-4 py-3 text-muted">
                      <span className="inline-flex items-center gap-1.5">
                        <Package className="h-3.5 w-3.5 text-gold/60" />
                        {e.product?.name ?? "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {e.capturedAt.toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end">
                        <DeleteEmailButton id={e.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
