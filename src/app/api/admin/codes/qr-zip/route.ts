import QRCode from "qrcode";
import JSZip from "jszip";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { verifyUrl } from "@/lib/code";
import { parseCodeFilters, buildCodeWhere } from "@/lib/codeFilters";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX = 2000;

function searchToRecord(sp: URLSearchParams) {
  const r: Record<string, string> = {};
  sp.forEach((v, k) => (r[k] = v));
  return r;
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return new Response("Unauthorized", { status: 401 });

  const url = new URL(req.url);
  const filters = parseCodeFilters(searchToRecord(url.searchParams));
  const where = buildCodeWhere(filters);
  const base = process.env.NEXTAUTH_URL || url.origin;

  const total = await prisma.verificationCode.count({ where });
  const codes = await prisma.verificationCode.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: MAX,
  });
  if (total > MAX) {
    console.warn(`qr-zip: ${total} codes match; capping at ${MAX}.`);
  }

  const zip = new JSZip();
  for (const c of codes) {
    const png = await QRCode.toBuffer(verifyUrl(c.code, base), {
      errorCorrectionLevel: "H",
      width: 600,
      margin: 2,
      color: { dark: "#0A0A0A", light: "#FFFFFF" },
    });
    zip.file(`${c.code}.png`, png);
  }

  const buf = await zip.generateAsync({ type: "nodebuffer" });

  return new Response(new Uint8Array(buf), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="hollowtips-qr-${Date.now()}.zip"`,
    },
  });
}
