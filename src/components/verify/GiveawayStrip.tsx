import Link from "next/link";
import { Gift, ArrowRight } from "lucide-react";
import { LINKS } from "@/lib/links";

export function GiveawayStrip() {
  return (
    <Link
      href={LINKS.giveaway}
      className="group flex w-full items-center gap-3 rounded-2xl border border-gold/40 bg-gradient-to-r from-gold/15 to-transparent p-4 transition-colors hover:border-gold/70"
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gold-gradient text-black shadow-gold-glow">
        <Gift className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1 text-left">
        <span className="block font-gta text-base uppercase tracking-wide text-gold-gradient">
          Join the Giveaway
        </span>
        <span className="block text-xs text-white/60">
          Drop your email &amp; phone — win gear.
        </span>
      </span>
      <ArrowRight className="h-4 w-4 shrink-0 text-gold transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}
