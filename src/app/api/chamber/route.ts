import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { syncToMailchimp } from "@/lib/mailchimp";

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

  // Master list → Mailchimp. Never blocks the response: the lead is already
  // saved above, so a Mailchimp hiccup can't lose it or error the submit.
  // No-ops until MAILCHIMP_API_KEY + MAILCHIMP_AUDIENCE_ID are set.
  try {
    await syncToMailchimp({ email, firstName, phone, source });
  } catch (err) {
    console.error("Mailchimp sync failed:", err);
  }

  return NextResponse.json({ ok: true });
}
