"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Play, X, Download, FileDown } from "lucide-react";
import { parseVideo } from "@/lib/video";

export interface MediaItemDTO {
  id: string;
  title: string;
  type: "video" | "download" | "wallpaper";
  category: string;
  videoUrl: string;
  fileUrl: string | null;
  thumbnailUrl: string | null;
  publishedAt: string | null;
  isNew: boolean;
}

function poster(m: MediaItemDTO): string | null {
  if (m.type === "video") return m.thumbnailUrl || parseVideo(m.videoUrl).posterFallback;
  if (m.type === "wallpaper") return m.fileUrl || m.thumbnailUrl;
  return m.thumbnailUrl; // download: optional preview
}

function fmtDate(s: string) {
  return new Date(s).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function MediaGallery({
  items,
  tabs,
}: {
  items: MediaItemDTO[];
  /** Full tab list to always show (e.g. Trailers, Commercials, Downloads), even if empty. */
  tabs?: string[];
}) {
  const categories = useMemo(
    () =>
      tabs && tabs.length
        ? tabs
        : Array.from(new Set(items.map((m) => m.category))),
    [items, tabs],
  );
  const [active, setActive] = useState(categories[0] ?? "");
  const [playing, setPlaying] = useState<MediaItemDTO | null>(null);
  const [viewing, setViewing] = useState<MediaItemDTO | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setPlaying(null);
        setViewing(null);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const shown = items.filter((m) => m.category === active);

  const cardInner = (m: MediaItemDTO) => {
    const p = poster(m);
    const isDownload = m.type === "download";
    return (
      <>
        <div className="relative aspect-video bg-black">
          {p ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={p}
              alt={m.title}
              className={`h-full w-full transition-transform duration-500 group-hover:scale-105 ${
                m.type === "wallpaper" ? "object-cover" : "object-cover"
              }`}
            />
          ) : (
            <div className="grid h-full w-full place-items-center bg-gradient-to-b from-gold/15 to-black">
              {isDownload && <FileDown className="h-9 w-9 text-gold/70" />}
            </div>
          )}
          <span className="absolute inset-0 grid place-items-center">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-black/55 backdrop-blur transition-transform group-hover:scale-110">
              {m.type === "video" ? (
                <Play className="ml-0.5 h-6 w-6 text-white" fill="currentColor" />
              ) : (
                <Download className="h-6 w-6 text-white" />
              )}
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
          <p className="mt-0.5 text-xs text-white/40">
            {m.type === "video"
              ? m.publishedAt
                ? fmtDate(m.publishedAt)
                : ""
              : m.type === "wallpaper"
                ? "View & download"
                : "Download"}
          </p>
        </div>
      </>
    );
  };

  const cardClass =
    "group block overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c0c] text-left transition-colors hover:border-gold/40";

  return (
    <div className="w-full">
      {/* Tabs */}
      {categories.length >= 1 && (
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
      {shown.length === 0 ? (
        <p className="py-16 text-center text-sm text-white/40">
          Nothing in {active} yet — check back soon.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((m) =>
            m.type === "download" ? (
              <a
                key={m.id}
                href={m.fileUrl ?? "#"}
                download
                className={cardClass}
              >
                {cardInner(m)}
              </a>
            ) : (
              <button
                key={m.id}
                type="button"
                onClick={() =>
                  m.type === "video" ? setPlaying(m) : setViewing(m)
                }
                className={cardClass}
              >
                {cardInner(m)}
              </button>
            ),
          )}
        </div>
      )}

      {/* Video player modal */}
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

      {/* Wallpaper / artwork lightbox */}
      {viewing &&
        mounted &&
        createPortal(
          <div className="fixed inset-0 z-[80] grid place-items-center p-4">
            <div onClick={() => setViewing(null)} className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
            <div className="relative z-10 flex max-h-[90vh] w-full max-w-3xl flex-col items-center">
              <button
                type="button"
                aria-label="Close"
                onClick={() => setViewing(null)}
                className="absolute -top-10 right-0 grid h-9 w-9 place-items-center rounded-lg border border-white/20 text-white/80 hover:text-gold"
              >
                <X className="h-5 w-5" />
              </button>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={viewing.fileUrl ?? viewing.thumbnailUrl ?? ""}
                alt={viewing.title}
                className="max-h-[75vh] w-auto rounded-2xl border border-gold/30 object-contain shadow-gold-glow"
              />
              <a
                href={viewing.fileUrl ?? "#"}
                download
                className="btn-gold focus-gold mt-4"
              >
                <Download className="h-4 w-4" />
                Download
              </a>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
