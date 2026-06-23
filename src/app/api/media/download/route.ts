import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

const MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  mp4: "video/mp4",
  webm: "video/webm",
  mov: "video/quicktime",
  pdf: "application/pdf",
  zip: "application/zip",
};

function slugify(s: string): string {
  return (
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "hollowtips"
  );
}

/** Forces a file to download (Content-Disposition: attachment) for a known media item. */
export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id." }, { status: 400 });

  const item = await prisma.mediaItem.findUnique({ where: { id } });
  const url = item?.fileUrl;
  if (!item || !url || !url.startsWith("/uploads/")) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const filename = url.slice("/uploads/".length);
  // Guard against path traversal.
  if (!filename || filename.includes("/") || filename.includes("..")) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  let data: Buffer;
  try {
    data = await readFile(path.join(UPLOAD_DIR, filename));
  } catch {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const ext = (filename.split(".").pop() || "bin").toLowerCase();
  const downloadName = `${slugify(item.title)}.${ext}`;

  return new NextResponse(new Uint8Array(data), {
    headers: {
      "Content-Type": MIME[ext] ?? "application/octet-stream",
      "Content-Disposition": `attachment; filename="${downloadName}"`,
      "Content-Length": String(data.length),
      "Cache-Control": "public, max-age=86400",
    },
  });
}
