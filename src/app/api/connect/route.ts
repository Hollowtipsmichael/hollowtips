import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  email: z.string().trim().email(),
  phone: z.string().trim().min(5).max(40).optional().or(z.literal("")),
  name: z.string().trim().max(120).optional(),
});

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
  await prisma.emailCapture.create({
    data: {
      email: parsed.data.email.toLowerCase(),
      phone: parsed.data.phone?.trim() || null,
      name: parsed.data.name?.trim() || null,
    },
  });
  return NextResponse.json({ ok: true });
}
