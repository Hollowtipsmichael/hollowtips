import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function csvCell(v: string) {
  return /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return new Response("Unauthorized", { status: 401 });

  const rows = await prisma.emailCapture.findMany({
    include: { product: { select: { name: true } } },
    orderBy: { capturedAt: "desc" },
  });

  const csv = [
    "email,name,product,capturedAt",
    ...rows.map((r) =>
      [r.email, r.name ?? "", r.product?.name ?? "", r.capturedAt.toISOString()]
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
