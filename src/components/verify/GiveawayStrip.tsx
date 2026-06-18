import Link from "next/link";
import { LINKS } from "@/lib/links";

export function GiveawayStrip() {
  return (
    <Link
      href={LINKS.giveaway}
      className="flex w-full items-center justify-between gap-3 rounded-xl border border-gold-deep bg-[linear-gradient(135deg,#141008_0%,#1a1200_100%)] px-5 py-4 transition-colors hover:border-gold"
    >
      <div>
        <div className="font-condensed text-[10px] uppercase tracking-[3px] text-gold-deep">
          Free Merch
        </div>
        <div className="font-condensed text-base font-bold tracking-[0.5px] text-gold">
          Join the Giveaway
        </div>
        <div className="mt-0.5 text-xs text-[#666]">
          Drop your email &amp; phone — win gear
        </div>
      </div>
      <span className="shrink-0 text-2xl leading-none text-gold">→</span>
    </Link>
  );
}
