import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CodeStatus } from "@/lib/enums";
import { clientIp } from "@/lib/ip";
import { detectDevice } from "@/lib/device";
import { lookupGeo } from "@/lib/geo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Public: the verify page's ScanBeacon posts here once per page load (JS only,
// so bots/link-previews don't inflate counts).
export async function POST(req: Request) {
  let body: { code?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
  const code = body.code?.trim().toUpperCase();
  if (!code) return NextResponse.json({ error: "Missing code" }, { status: 400 });

  const record = await prisma.verificationCode.findUnique({ where: { code } });
  if (!record) return NextResponse.json({ result: "unknown" });

  const wasFlagged = record.status === CodeStatus.FLAGGED;
  const isFirst = record.firstScannedAt === null && !wasFlagged;

  const ua = req.headers.get("user-agent");
  const ip = clientIp(req.headers);
  const geo = await lookupGeo(ip);

  // First scan → VERIFIED + stamp date. Any later scan → FLAGGED (suspicious:
  // a genuine unit is normally scanned once by its buyer). Admin-flagged stays.
  await prisma.$transaction([
    prisma.verificationCode.update({
      where: { id: record.id },
      data: {
        scanCount: { increment: 1 },
        ...(wasFlagged
          ? {}
          : isFirst
            ? { status: CodeStatus.VERIFIED, firstScannedAt: new Date() }
            : { status: CodeStatus.FLAGGED }),
      },
    }),
    prisma.scanEvent.create({
      data: {
        codeId: record.id,
        productId: record.productId,
        ipAddress: ip ?? null,
        country: geo.country ?? null,
        region: geo.region ?? null,
        city: geo.city ?? null,
        latitude: geo.latitude ?? null,
        longitude: geo.longitude ?? null,
        deviceType: detectDevice(ua),
        userAgent: ua ?? null,
        isFirstScan: isFirst,
      },
    }),
  ]);

  return NextResponse.json({
    result: wasFlagged ? "flagged" : isFirst ? "first" : "repeat",
    scanCount: record.scanCount + 1,
  });
}
