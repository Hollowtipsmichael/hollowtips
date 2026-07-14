import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { HollowtipsLogo } from "@/components/brand/HollowtipsLogo";

export const metadata: Metadata = {
  title: "Official Rules — Hollowtips “Level Up” Giveaway",
  description:
    "Official rules for the Hollowtips “Level Up” GTA VI giveaway. No purchase necessary. US, 21+. Entry period July 9 – November 18, 2026.",
};

// NOTE: [address] / [email] are the client's placeholders — swap in the
// sponsor address + contact email as soon as Michael supplies them.
const RULES: { title: string; body: string }[] = [
  {
    title: "1. Sponsor",
    body: "Hollowtips, [address], [email]. Not sponsored or endorsed by Rockstar Games, Take-Two Interactive, Sony, Microsoft, or any social platform.",
  },
  {
    title: "2. Eligibility",
    body: "Legal residents of the 50 US states & D.C., age 21+. Employees of Sponsor and its promotional partners are not eligible.",
  },
  {
    title: "3. Entry Period",
    body: "July 9, 2026 – November 18, 2026, 11:59 PM ET.",
  },
  {
    title: "4. How to Enter",
    body: "Submit your name, email, and phone number at verifyhollowtips.com. Free to enter — no purchase or product scan required. Limit one entry per person; duplicates and automated entries disqualified.",
  },
  {
    title: "5. Prizes",
    body: "100 winners each receive one digital copy of Grand Theft Auto VI (winner's choice: PS5 or Xbox Series X|S), delivered as a redemption code. ARV $70 each / $7,000 total. Non-transferable, no cash substitution. Sponsor may substitute a prize of equal or greater value.",
  },
  {
    title: "6. Winners",
    body: "Selected by random drawing on or about November 19, 2026, from all eligible entries. Odds depend on number of entries. Winners notified by email/text and must respond within 72 hours or forfeit; alternate winners may be selected.",
  },
  {
    title: "7. Marketing",
    body: "Entrants may opt in to Hollowtips email/SMS. Consent is not a condition of entry. Msg & data rates may apply; reply STOP to cancel.",
  },
  {
    title: "8. General",
    body: "By entering, you release Sponsor and its partners from claims arising from participation or prize use, and (except where prohibited) allow use of your first name, last initial, and state for promotion. Winners responsible for taxes. Sponsor may modify or end the Giveaway if it can't run as planned. Winners list: email [email] after Nov 30, 2026.",
  },
];

export default function GiveawayRulesPage() {
  return (
    <main className="relative min-h-screen bg-[#07060B] px-5 py-10 text-white">
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(60%_40%_at_50%_0%,rgba(255,45,143,0.1),transparent_60%)]" />

      <div className="relative z-10 mx-auto w-full max-w-2xl animate-fade-in">
        <div className="mb-8 flex justify-center">
          <Link href="/">
            <HollowtipsLogo variant="full" size={34} />
          </Link>
        </div>

        <h1 className="text-center font-condensed text-3xl font-black uppercase leading-tight tracking-[1px] text-neon-gradient sm:text-4xl">
          Hollowtips &ldquo;Level Up&rdquo; Giveaway — Official Rules
        </h1>
        <p className="mt-3 text-center font-condensed text-sm font-bold uppercase tracking-[2px] text-white/70">
          No purchase necessary. Void where prohibited.
        </p>

        <div className="mt-8 space-y-5">
          {RULES.map((r) => (
            <section
              key={r.title}
              className="rounded-2xl border border-white/10 bg-black/50 p-5"
            >
              <h2 className="font-condensed text-base font-bold uppercase tracking-[1px] text-neon-pink">
                {r.title}
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-white/75">
                {r.body}
              </p>
            </section>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/giveaway"
            className="inline-flex items-center gap-1.5 text-sm text-neon-pink underline-offset-4 transition-colors hover:text-white hover:underline"
          >
            <ArrowLeft className="h-4 w-4" /> Back to the Giveaway
          </Link>
        </div>

        <p className="mt-8 text-center text-[11px] text-white/30">
          21+ only · © {new Date().getFullYear()} Hollowtips
        </p>
      </div>
    </main>
  );
}
