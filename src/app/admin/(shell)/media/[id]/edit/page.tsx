import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { mergeCategories } from "@/lib/mediaCategories";
import { MediaForm } from "@/components/admin/MediaForm";

export const metadata = { title: "Edit Media — Hollowtips Verify" };
export const dynamic = "force-dynamic";

export default async function EditMediaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const m = await prisma.mediaItem.findUnique({ where: { id } });
  if (!m) notFound();

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
        <h2 className="font-display text-3xl tracking-wide text-fg">{m.title}</h2>
      </div>
      <div className="rule-gold" />
      <MediaForm
        mode="edit"
        categories={mergeCategories(cats.map((c) => c.category))}
        initial={{
          id: m.id,
          title: m.title,
          category: m.category,
          videoUrl: m.videoUrl,
          thumbnailUrl: m.thumbnailUrl ?? undefined,
          publishedAt: m.publishedAt
            ? m.publishedAt.toISOString().slice(0, 10)
            : "",
          isNew: m.isNew,
          isActive: m.isActive,
          sortOrder: m.sortOrder,
        }}
      />
    </div>
  );
}
