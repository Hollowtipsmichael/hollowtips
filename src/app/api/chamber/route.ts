import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  firstName: z.string().trim().min(1).max(120),
  email: z.string().trim().email(),
  phone: z.string().trim().min(5).max(40),
  source: z.enum(["verify-legit", "verify-busted", "giveaway-page"]).optional(),
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
    return NextResponse.json(
      { error: "First name, a valid email, and phone are all required." },
      { status: 400 },
    );
  }

  const { firstName, email, phone, source } = parsed.data;

  await prisma.emailCapture.create({
    data: {
      email: email.toLowerCase(),
      name: firstName,
      phone,
      source: source ?? null,
    },
  });

  // Master-list webhook (Make / Klaviyo / Mailchimp) — one-line add once the
  // client confirms the destination. Leads are stored in the DB meanwhile.
  // await fetch(process.env.MASTER_LIST_WEBHOOK_URL, { method: "POST", ... });

  return NextResponse.json({ ok: true });
}
