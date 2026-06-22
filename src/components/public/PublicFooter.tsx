import Link from "next/link";
import { HollowtipsLogo } from "@/components/brand/HollowtipsLogo";
import { LINKS } from "@/lib/links";

function IG() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}
function TT() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path d="M9 12a4 4 0 104 4V4a5 5 0 005 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function YT() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <rect x="2" y="5" width="20" height="14" rx="4" stroke="currentColor" strokeWidth="2" />
      <polygon points="10 9 16 12 10 15 10 9" fill="currentColor" />
    </svg>
  );
}
function TG() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
      <path d="M21.85 2.68L2.1 10.08c-1.32.53-1.31 1.27-.24 1.6l4.9 1.53 1.89 5.76c.23.63.11.88.77.88.5 0 .73-.24 1.02-.53l2.44-2.38 4.93 3.64c.91.5 1.56.24 1.79-.84l3.24-15.27c.33-1.34-.52-1.95-1.99-1.79z" />
    </svg>
  );
}

const socials = [
  { href: LINKS.instagram, Icon: IG, label: "Instagram" },
  { href: LINKS.tiktok, Icon: TT, label: "TikTok" },
  { href: LINKS.youtube, Icon: YT, label: "YouTube" },
  { href: LINKS.telegram, Icon: TG, label: "Telegram" },
];

const nav = [
  { href: "/", label: "Home" },
  { href: "/lineup", label: "Lineup" },
  { href: "/media", label: "Media" },
  { href: "/verify", label: "Verify" },
  { href: "/connect", label: "Giveaway" },
];

export function PublicFooter() {
  return (
    <footer className="relative z-10 mt-20 border-t border-white/10 bg-black">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:grid-cols-2 lg:grid-cols-3">
        {/* Brand */}
        <div className="space-y-3">
          <HollowtipsLogo variant="full" size={30} />
          <p className="max-w-xs text-sm text-white/45">
            Live Resin · Liquid Diamonds · 2G. Scratch &amp; scan every pack to
            confirm it&apos;s the real thing.
          </p>
          <span className="inline-block rounded-full border border-gold/30 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-gold">
            21+ Only
          </span>
        </div>

        {/* Explore */}
        <div>
          <h4 className="mb-3 font-condensed text-xs font-bold uppercase tracking-[0.25em] text-white/50">
            Explore
          </h4>
          <ul className="space-y-2">
            {nav.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  className="text-sm text-white/70 transition-colors hover:text-gold"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Follow */}
        <div>
          <h4 className="mb-3 font-condensed text-xs font-bold uppercase tracking-[0.25em] text-white/50">
            Follow
          </h4>
          <div className="flex gap-3">
            {socials.map(({ href, Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="grid h-10 w-10 place-items-center rounded-xl border border-white/15 text-white/70 transition-colors hover:border-gold/50 hover:text-gold"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-5 py-5 text-center text-xs text-white/35">
        © {new Date().getFullYear()} Hollowtips. All rights reserved. 21+ only ·
        Keep out of reach of children.
      </div>
    </footer>
  );
}
