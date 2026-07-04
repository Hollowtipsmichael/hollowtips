import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Public: record a view (open/play) of a media item. */
export async function POST(req: Request) {
  let id: string | undefined;
  try {
    id = (await req.json())?.id;
  } catch {
    // sendBeacon may deliver text — tolerate
  }
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  await prisma.mediaItem
    .update({ where: { id }, data: { viewCount: { increment: 1 } } })
    .catch(() => {}); // ignore unknown ids

  return NextResponse.json({ ok: true });
}
