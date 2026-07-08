import { mkdir, writeFile, unlink } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { optimizeVideo, optimizeImage } from "./transcode";

/**
 * File storage for product media.
 *
 * Current implementation: local disk under `public/uploads/`, served at
 * `/uploads/<file>`. This works in `npm run dev` and on a long-lived Node
 * server (e.g. EC2). For serverless / multi-instance hosting, swap the body
 * of `saveUpload`/`deleteUpload` for an S3 (or other) client — this is the
 * single intended swap point; the rest of the app only deals in URLs.
 */

export type UploadKind = "image" | "video" | "file";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const PUBLIC_PREFIX = "/uploads";

// `types: null` → accept any file type (derive extension from the filename).
const RULES: Record<
  UploadKind,
  { maxBytes: number; types: Record<string, string> | null }
> = {
  image: {
    maxBytes: 40 * 1024 * 1024, // 40MB — big raws are downscaled on save
    types: {
      "image/png": "png",
      "image/jpeg": "jpg",
      "image/webp": "webp",
      "image/gif": "gif",
    },
  },
  video: {
    maxBytes: 2 * 1024 * 1024 * 1024, // 2GB — effectively unlimited for trailers
    types: {
      "video/mp4": "mp4",
      "video/webm": "webm",
      "video/quicktime": "mov",
      "video/x-matroska": "mkv",
    },
  },
  // Downloads: any file (zip, pdf, png, hi-res art, etc.)
  file: {
    maxBytes: 2 * 1024 * 1024 * 1024, // 2GB
    types: null,
  },
};

function safeExt(name: string): string {
  const ext = (name.split(".").pop() || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  return ext ? ext.slice(0, 8) : "bin";
}

export class UploadError extends Error {}

export async function saveUpload(
  file: File,
  kind: UploadKind,
): Promise<{ url: string }> {
  const rule = RULES[kind];

  if (!file || file.size === 0) {
    throw new UploadError("No file provided.");
  }
  if (file.size > rule.maxBytes) {
    throw new UploadError(
      `File too large. Max ${Math.round(rule.maxBytes / (1024 * 1024))}MB.`,
    );
  }
  const ext = rule.types ? rule.types[file.type] : safeExt(file.name);
  if (!ext) {
    throw new UploadError(
      `Unsupported ${kind} type. Allowed: ${Object.values(rule.types ?? {}).join(", ")}.`,
    );
  }

  await mkdir(UPLOAD_DIR, { recursive: true });
  const filename = `${randomUUID()}.${ext}`;
  const fullPath = path.join(UPLOAD_DIR, filename);
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(fullPath, buffer);

  // Web-optimize videos (1080p, faststart, good quality) so they autoplay fast.
  if (kind === "video") {
    await optimizeVideo(fullPath);
  }
  // Web-optimize images (downscale long side, preserve alpha) so big 4K
  // uploads shrink to a sane size for the verify reveal / cards.
  if (kind === "image") {
    await optimizeImage(fullPath);
  }

  return { url: `${PUBLIC_PREFIX}/${filename}` };
}

/** Best-effort removal of a previously stored local upload. */
export async function deleteUpload(url?: string | null): Promise<void> {
  if (!url || !url.startsWith(`${PUBLIC_PREFIX}/`)) return;
  const filename = url.slice(PUBLIC_PREFIX.length + 1);
  // Guard against path traversal.
  if (!filename || filename.includes("/") || filename.includes("..")) return;
  try {
    await unlink(path.join(UPLOAD_DIR, filename));
  } catch {
    // already gone / never existed — ignore
  }
}
