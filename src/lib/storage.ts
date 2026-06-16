import { mkdir, writeFile, unlink } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

/**
 * File storage for product media.
 *
 * Current implementation: local disk under `public/uploads/`, served at
 * `/uploads/<file>`. This works in `npm run dev` and on a long-lived Node
 * server (e.g. EC2). For serverless / multi-instance hosting, swap the body
 * of `saveUpload`/`deleteUpload` for an S3 (or other) client — this is the
 * single intended swap point; the rest of the app only deals in URLs.
 */

export type UploadKind = "image" | "video";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const PUBLIC_PREFIX = "/uploads";

const RULES: Record<
  UploadKind,
  { maxBytes: number; types: Record<string, string> }
> = {
  image: {
    maxBytes: 10 * 1024 * 1024, // 10MB
    types: {
      "image/png": "png",
      "image/jpeg": "jpg",
      "image/webp": "webp",
      "image/gif": "gif",
    },
  },
  video: {
    maxBytes: 50 * 1024 * 1024, // 50MB
    types: {
      "video/mp4": "mp4",
      "video/webm": "webm",
      "video/quicktime": "mov",
    },
  },
};

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
  const ext = rule.types[file.type];
  if (!ext) {
    throw new UploadError(
      `Unsupported ${kind} type. Allowed: ${Object.values(rule.types).join(", ")}.`,
    );
  }

  await mkdir(UPLOAD_DIR, { recursive: true });
  const filename = `${randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(UPLOAD_DIR, filename), buffer);

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
