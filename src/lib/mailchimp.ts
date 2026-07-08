import { createHash } from "node:crypto";

/**
 * Mailchimp master-list sync for The Chamber captures.
 *
 * Activates only when both env vars are set (leads always save to the DB
 * regardless):
 *   MAILCHIMP_API_KEY      e.g. "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-us21"
 *   MAILCHIMP_AUDIENCE_ID  the target audience/list id
 *
 * Upserts the subscriber (idempotent — safe on repeat submits), sets the
 * FNAME + PHONE merge fields, and tags them by source so verify-legit /
 * verify-busted / giveaway-page leads are segmentable in Mailchimp.
 */
export async function syncToMailchimp(input: {
  email: string;
  firstName?: string | null;
  phone?: string | null;
  source?: string | null;
}): Promise<void> {
  const apiKey = process.env.MAILCHIMP_API_KEY;
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;
  if (!apiKey || !audienceId) return; // not configured yet — no-op

  // Datacenter prefix is the part after the dash in the API key (e.g. us21).
  const dc = apiKey.split("-")[1];
  if (!dc) return;

  const base = `https://${dc}.api.mailchimp.com/3.0/lists/${audienceId}`;
  const auth = "Basic " + Buffer.from(`anystring:${apiKey}`).toString("base64");
  const email = input.email.toLowerCase();
  const hash = createHash("md5").update(email).digest("hex");

  // 1) Upsert the member (PUT = create-or-update, no "already exists" error).
  const mergeFields: Record<string, string> = {};
  if (input.firstName) mergeFields.FNAME = input.firstName;
  if (input.phone) mergeFields.PHONE = input.phone;

  await fetch(`${base}/members/${hash}`, {
    method: "PUT",
    headers: { Authorization: auth, "Content-Type": "application/json" },
    body: JSON.stringify({
      email_address: email,
      status_if_new: "subscribed",
      merge_fields: mergeFields,
    }),
  });

  // 2) Tag by source so leads are segmentable in the audience.
  if (input.source) {
    await fetch(`${base}/members/${hash}/tags`, {
      method: "POST",
      headers: { Authorization: auth, "Content-Type": "application/json" },
      body: JSON.stringify({ tags: [{ name: input.source, status: "active" }] }),
    });
  }
}
