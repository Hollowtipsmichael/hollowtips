import Link from "next/link";
import { Clapperboard, Plus, Pencil, Play } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { parseVideo } from "@/lib/video";
import { StatusPill } from "@/components/admin/StatusPill";
import { DeleteMediaButton } from "@/components/admin/media/DeleteMediaButton";

export const metadata = { title: "Media — Hollowtips Verify" };
export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  const items = await prisma.mediaItem.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1.5">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-gold">
            Content
          </p>
          <h2 className="font-display text-3xl tracking-wide text-fg">
            Media <span className="text-muted">({items.length})</span>
          </h2>
          <p className="text-sm text-muted">
            Trailers &amp; videos shown on the public /media page (grouped by category).
          </p>
        </div>
        <Link href="/admin/media/new" className="btn-gold focus-gold">
          <Plus className="h-4 w-4" />
          Add media
        </Link>
      </div>

      <div className="rule-gold" />

      {items.length === 0 ? (
        <div className="card grain flex flex-col items-center justify-center gap-3 py-16 text-center">
          <span className="grid h-12 w-12 place-items-center rounded-xl border border-gold/20 bg-gold/5 text-gold">
            <Clapperboard className="h-6 w-6" />
          </span>
          <p className="text-sm font-medium text-fg">No media yet</p>
          <p className="max-w-sm text-sm text-muted">
            Add trailers (YouTube/Vimeo links or uploads) — they&apos;ll appear on
            the public Media page under their category tab.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((m) => {
            const poster = m.thumbnailUrl || parseVideo(m.videoUrl).posterFallback;
            return (
              <div key={m.id} className="card card-hover overflow-hidden">
                <div className="relative aspect-video bg-black">
                  {poster ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={poster} alt={m.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="grid h-full w-full place-items-center text-gold/40">
                      <Play className="h-8 w-8" />
                    </div>
                  )}
                  <span className="absolute left-2 top-2 rounded-full border border-subtle bg-black/70 px-2 py-0.5 text-[10px] uppercase tracking-wide text-white/80 backdrop-blur">
                    {m.category}
                  </span>
                  {m.isNew && (
                    <span className="absolute right-2 top-2 rounded bg-gold px-1.5 py-0.5 text-[10px] font-bold uppercase text-black">
                      New
                    </span>
                  )}
                </div>
                <div className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display text-base leading-tight tracking-wide text-fg">
                      {m.title}
                    </h3>
                    <StatusPill active={m.isActive} />
                  </div>
                  <div className="flex items-center justify-between border-t border-subtle pt-3">
                    <span className="text-xs text-muted">
                      {m.publishedAt ? m.publishedAt.toLocaleDateString() : "—"}
                    </span>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/media/${m.id}/edit`}
                        aria-label="Edit"
                        className="focus-gold grid h-9 w-9 place-items-center rounded-lg border border-subtle text-muted hover:border-gold/40 hover:text-gold"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <DeleteMediaButton id={m.id} title={m.title} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
