import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

/**
 * Legacy result URL. The verify result is now an inline state on /verify
 * (three states: entry → LEGIT → BUSTED on one URL). Redirect any old QR /
 * bookmark links to /verify?code=CODE so they keep working.
 */
export default async function LegacyVerifyCodePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  redirect(`/verify?code=${encodeURIComponent(code)}`);
}
