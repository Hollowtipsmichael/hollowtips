import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { MediaForm } from "@/components/admin/MediaForm";

export const metadata = { title: "New Media — Hollowtips Verify" };
export const dynamic = "force-dynamic";

export default async function NewMediaPage() {
  const cats = await prisma.mediaItem.findMany({
    distinct: ["category"],
    select: { category: true },
    orderBy: { category: "asc" },
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-3">
        <Link href="/admin/media" className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-gold">
          <ArrowLeft className="h-4 w-4" />
          Back to media
        </Link>
        <h2 className="font-display text-3xl tracking-wide text-fg">New Media</h2>
      </div>
      <div className="rule-gold" />
      <MediaForm mode="create" categories={cats.map((c) => c.category)} />
    </div>
  );
}
