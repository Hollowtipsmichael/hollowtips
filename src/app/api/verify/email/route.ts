import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  email: z.string().trim().email(),
  productId: z.string().optional(),
});

// Public endpoint: optional email opt-in from the verify page.
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
  }

  // Verify the product exists if provided (avoid FK errors / junk).
  let productId: string | null = null;
  if (parsed.data.productId) {
    const p = await prisma.product.findUnique({
      where: { id: parsed.data.productId },
      select: { id: true },
    });
    productId = p?.id ?? null;
  }

  await prisma.emailCapture.create({
    data: { email: parsed.data.email.toLowerCase(), productId },
  });

  return NextResponse.json({ ok: true });
}
