import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function csvCell(v: string) {
  return /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return new Response("Unauthorized", { status: 401 });

  const source = new URL(req.url).searchParams.get("source") || undefined;

  const rows = await prisma.emailCapture.findMany({
    where: source ? { source } : undefined,
    include: { product: { select: { name: true } } },
    orderBy: { capturedAt: "desc" },
  });

  const csv = [
    "email,name,phone,source,product,capturedAt",
    ...rows.map((r) =>
      [
        r.email,
        r.name ?? "",
        r.phone ?? "",
        r.source ?? "",
        r.product?.name ?? "",
        r.capturedAt.toISOString(),
      ]
        .map(csvCell)
        .join(","),
    ),
  ].join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="hollowtips-emails-${Date.now()}.csv"`,
    },
  });
}
