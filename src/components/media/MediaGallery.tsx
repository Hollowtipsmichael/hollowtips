"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Play, X } from "lucide-react";
import { parseVideo } from "@/lib/video";

export interface MediaItemDTO {
  id: string;
  title: string;
  category: string;
  videoUrl: string;
  thumbnailUrl: string | null;
  publishedAt: string | null;
  isNew: boolean;
}

function poster(m: MediaItemDTO): string | null {
  return m.thumbnailUrl || parseVideo(m.videoUrl).posterFallback;
}

export function MediaGallery({ items }: { items: MediaItemDTO[] }) {
  const categories = useMemo(
    () => Array.from(new Set(items.map((m) => m.category))),
    [items],
  );
  const [active, setActive] = useState(categories[0] ?? "");
  const [playing, setPlaying] = useState<MediaItemDTO | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setPlaying(null);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const shown = items.filter((m) => m.category === active);

  return (
    <div className="w-full">
      {/* Tabs */}
      {categories.length > 1 && (
        <div className="mb-7 flex flex-wrap justify-center gap-2">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setActive(c)}
              className={`rounded-full px-5 py-2 font-condensed text-sm font-bold uppercase tracking-wide transition-colors ${
                active === c
                  ? "bg-gold text-black"
                  : "border border-white/15 text-white/70 hover:border-gold/50 hover:text-gold"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {/* Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((m) => {
          const p = poster(m);
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setPlaying(m)}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c0c] text-left transition-colors hover:border-gold/40"
            >
              <div className="relative aspect-video bg-black">
                {p ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p} alt={m.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="h-full w-full bg-gradient-to-b from-gold/15 to-black" />
                )}
                <span className="absolute inset-0 grid place-items-center">
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-black/55 backdrop-blur transition-transform group-hover:scale-110">
                    <Play className="ml-0.5 h-6 w-6 text-white" fill="currentColor" />
                  </span>
                </span>
                {m.isNew && (
                  <span className="absolute left-3 top-3 rounded bg-gold px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-black">
                    New
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-condensed text-lg font-bold uppercase tracking-wide text-white">
                  {m.title}
                </h3>
                {m.publishedAt && (
                  <p className="mt-0.5 text-xs text-white/40">
                    {new Date(m.publishedAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Player modal */}
      {playing &&
        mounted &&
        createPortal(
          <div className="fixed inset-0 z-[80] grid place-items-center p-4">
            <div onClick={() => setPlaying(null)} className="absolute inset-0 bg-black/85 backdrop-blur-sm" />
            <div className="relative z-10 w-full max-w-3xl">
              <button
                type="button"
                aria-label="Close"
                onClick={() => setPlaying(null)}
                className="absolute -top-10 right-0 grid h-9 w-9 place-items-center rounded-lg border border-white/20 text-white/80 hover:text-gold"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="aspect-video w-full overflow-hidden rounded-2xl border border-gold/30 bg-black shadow-gold-glow">
                {(() => {
                  const v = parseVideo(playing.videoUrl);
                  return v.kind === "file" ? (
                    <video
                      src={v.embedUrl}
                      controls
                      autoPlay
                      playsInline
                      preload="metadata"
                      className="h-full w-full bg-black object-contain"
                    />
                  ) : (
                    <iframe
                      src={v.embedUrl}
                      title={playing.title}
                      allow="autoplay; encrypted-media; picture-in-picture"
                      allowFullScreen
                      className="h-full w-full"
                    />
                  );
                })()}
              </div>
              <p className="mt-3 text-center font-condensed text-lg font-bold uppercase tracking-wide text-white">
                {playing.title}
              </p>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
