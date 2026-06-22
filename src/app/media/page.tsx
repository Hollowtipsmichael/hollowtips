import Link from "next/link";
import { ShieldCheck, Clapperboard } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { HollowtipsLogo } from "@/components/brand/HollowtipsLogo";
import { mergeCategories } from "@/lib/mediaCategories";
import { MediaGallery, type MediaItemDTO } from "@/components/media/MediaGallery";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Media — Hollowtips",
  description: "Hollowtips trailers, drops & videos.",
};

export default async function MediaPage() {
  const rows = await prisma.mediaItem.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { publishedAt: "desc" }, { createdAt: "desc" }],
  });

  const items: MediaItemDTO[] = rows.map((m) => ({
    id: m.id,
    title: m.title,
    category: m.category,
    videoUrl: m.videoUrl,
    thumbnailUrl: m.thumbnailUrl,
    publishedAt: m.publishedAt ? m.publishedAt.toISOString() : null,
    isNew: m.isNew,
  }));

  // Always show the default tabs (Trailers, Commercials) + any custom ones.
  const tabs = mergeCategories(Array.from(new Set(rows.map((r) => r.category))));

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="grain pointer-events-none fixed inset-0 opacity-50" />

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-5 py-6">
        <Link href="/">
          <HollowtipsLogo variant="full" size={32} />
        </Link>
        <Link href="/verify" className="btn-gold focus-gold text-sm">
          <ShieldCheck className="h-4 w-4" />
          Verify
        </Link>
      </header>

      <section className="relative z-10 mx-auto max-w-6xl px-5 pb-16 pt-6">
        <div className="mb-8 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">
            Hollowtips
          </p>
          <h1 className="mt-2 font-gta text-5xl uppercase tracking-wide text-gold-shine sm:text-6xl">
            Media
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-2xl border border-white/10 bg-[#0c0c0c] py-16 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-xl border border-gold/20 bg-gold/5 text-gold">
              <Clapperboard className="h-6 w-6" />
            </span>
            <p className="text-sm font-medium text-white">No media yet</p>
            <p className="max-w-xs text-sm text-white/50">
              Trailers and videos will appear here soon.
            </p>
          </div>
        ) : (
          <MediaGallery items={items} tabs={tabs} />
        )}
      </section>

      <footer className="relative z-10 border-t border-white/10 px-5 py-8 text-center">
        <p className="text-xs text-white/40">
          21+ only · © {new Date().getFullYear()} Hollowtips
        </p>
      </footer>
    </main>
  );
}
