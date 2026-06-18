export type VideoKind = "youtube" | "vimeo" | "file";

export interface ParsedVideo {
  kind: VideoKind;
  /** URL to use in an <iframe> (youtube/vimeo) or <video src> (file). */
  embedUrl: string;
  /** Fallback poster (YouTube only) when no thumbnail is uploaded. */
  posterFallback: string | null;
}

function youtubeId(url: string): string | null {
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/,
  );
  return m ? m[1] : null;
}

function vimeoId(url: string): string | null {
  const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return m ? m[1] : null;
}

export function parseVideo(url: string): ParsedVideo {
  const u = (url || "").trim();
  const yt = youtubeId(u);
  if (yt) {
    return {
      kind: "youtube",
      embedUrl: `https://www.youtube.com/embed/${yt}?autoplay=1&rel=0`,
      posterFallback: `https://img.youtube.com/vi/${yt}/hqdefault.jpg`,
    };
  }
  const vm = vimeoId(u);
  if (vm) {
    return {
      kind: "vimeo",
      embedUrl: `https://player.vimeo.com/video/${vm}?autoplay=1`,
      posterFallback: null,
    };
  }
  return { kind: "file", embedUrl: u, posterFallback: null };
}
