import Link from "next/link";
import { ShieldCheck, Crosshair } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { HollowtipsLogo } from "@/components/brand/HollowtipsLogo";
import { PublicFooter } from "@/components/public/PublicFooter";
import { mergeSections } from "@/lib/mediaCategories";
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
    type: (m.type as MediaItemDTO["type"]) ?? "video",
    category: m.category,
    videoUrl: m.videoUrl,
    fileUrl: m.fileUrl,
    thumbnailUrl: m.thumbnailUrl,
    publishedAt: m.publishedAt ? m.publishedAt.toISOString() : null,
    isNew: m.isNew,
  }));

  // Always show the section tabs (Trailers, Commercials, Downloads,
  // Wallpaper/Artwork) + any custom video categories.
  const tabs = mergeSections(Array.from(new Set(rows.map((r) => r.category))));

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="grain pointer-events-none fixed inset-0 opacity-50" />

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-5 py-6">
        <Link href="/">
          <HollowtipsLogo variant="full" size={32} />
        </Link>
        <div className="flex items-center gap-2.5 sm:gap-3">
          <Link
            href="/giveaway"
            aria-label="Join the Chamber — GTA VI giveaway"
            className="focus-gold inline-flex items-center gap-1.5 rounded-xl border border-neon-pink/50 bg-neon-pink/10 px-3 py-2.5 text-sm font-semibold text-neon-pink transition-colors hover:border-neon-pink hover:bg-neon-pink/20 sm:px-4"
          >
            <Crosshair className="h-4 w-4" />
            <span className="hidden sm:inline">Join the Chamber</span>
          </Link>
          <Link href="/verify" className="btn-gold focus-gold text-sm">
            <ShieldCheck className="h-4 w-4" />
            Verify
          </Link>
        </div>
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

        <MediaGallery items={items} tabs={tabs} />
      </section>

      <PublicFooter />
    </main>
  );
}
