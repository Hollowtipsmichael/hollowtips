import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const scans = await prisma.scanEvent.findMany({
    where: { codeId: id },
    orderBy: { scannedAt: "asc" },
    select: {
      id: true,
      ipAddress: true,
      country: true,
      region: true,
      city: true,
      deviceType: true,
      isFirstScan: true,
      scannedAt: true,
    },
  });

  return NextResponse.json({
    scans: scans.map((s, i) => ({
      n: i + 1,
      ip: s.ipAddress,
      location: [s.city, s.region, s.country].filter(Boolean).join(", ") || "Unknown",
      device: s.deviceType,
      first: s.isFirstScan,
      at: s.scannedAt.toISOString(),
    })),
  });
}
