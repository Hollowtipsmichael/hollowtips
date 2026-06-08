import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { verifyUrl } from "@/lib/code";
import { parseCodeFilters, buildCodeWhere } from "@/lib/codeFilters";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function searchToRecord(sp: URLSearchParams) {
  const r: Record<string, string> = {};
  sp.forEach((v, k) => (r[k] = v));
  return r;
}

function csvCell(v: string) {
  return /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user)
    return new Response("Unauthorized", { status: 401 });

  const url = new URL(req.url);
  const filters = parseCodeFilters(searchToRecord(url.searchParams));
  const where = buildCodeWhere(filters);
  const base = process.env.NEXTAUTH_URL || url.origin;

  const codes = await prisma.verificationCode.findMany({
    where,
    include: {
      product: { select: { name: true } },
      variant: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const header = "code,verifyUrl,product,variant,status,scanCount,createdAt";
  const rows = codes.map((c) =>
    [
      c.code,
      verifyUrl(c.code, base),
      c.product.name,
      c.variant?.name ?? "",
      c.status,
      String(c.scanCount),
      c.createdAt.toISOString(),
    ]
      .map(csvCell)
      .join(","),
  );
  const csv = [header, ...rows].join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="hollowtips-codes-${Date.now()}.csv"`,
    },
  });
}
