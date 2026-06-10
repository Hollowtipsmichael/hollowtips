import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CodeStatus } from "@/lib/enums";
import { clientIp } from "@/lib/ip";
import { detectDevice } from "@/lib/device";
import { lookupGeo } from "@/lib/geo";
import { FLAG_DISTINCT_IP_THRESHOLD } from "@/lib/code";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Public endpoint: the verify page's ScanBeacon posts here once per visit.
export async function POST(req: Request) {
  let body: { code?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
  const code = body.code?.trim();
  if (!code) return NextResponse.json({ error: "Missing code" }, { status: 400 });

  const record = await prisma.verificationCode.findUnique({ where: { code } });
  if (!record) return NextResponse.json({ status: "unknown" });

  if (record.status === CodeStatus.FLAGGED) {
    return NextResponse.json({ status: "flagged" });
  }

  const isFirstScan = record.firstScannedAt === null;
  const ua = req.headers.get("user-agent");
  const ip = clientIp(req.headers);
  const geo = await lookupGeo(ip);

  // Update the code (first scan flips to VERIFIED), then log the scan event.
  await prisma.$transaction([
    prisma.verificationCode.update({
      where: { id: record.id },
      data: {
        scanCount: { increment: 1 },
        ...(isFirstScan
          ? { status: CodeStatus.VERIFIED, firstScannedAt: new Date() }
          : {}),
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
        isFirstScan,
      },
    }),
  ]);

  // Counterfeit heuristic: a genuine code copied onto many fakes gets scanned
  // from many different IPs. If distinct-IP count crosses the threshold, flag it.
  let flagged = false;
  if (!isFirstScan && ip) {
    const distinct = await prisma.scanEvent.findMany({
      where: { codeId: record.id, ipAddress: { not: null } },
      distinct: ["ipAddress"],
      select: { ipAddress: true },
    });
    if (distinct.length > FLAG_DISTINCT_IP_THRESHOLD) {
      await prisma.verificationCode.update({
        where: { id: record.id },
        data: { status: CodeStatus.FLAGGED },
      });
      flagged = true;
    }
  }

  return NextResponse.json({
    status: flagged ? "flagged" : "authentic",
    firstScan: isFirstScan,
    scanCount: record.scanCount + 1,
  });
}
