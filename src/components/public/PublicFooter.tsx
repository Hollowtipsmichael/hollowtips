import Link from "next/link";
import { HollowtipsLogo } from "@/components/brand/HollowtipsLogo";
import { LINKS } from "@/lib/links";

function IG() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px]" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}
function TT() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px]" aria-hidden="true">
      <path d="M9 12a4 4 0 104 4V4a5 5 0 005 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function YT() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px]" aria-hidden="true">
      <rect x="2" y="5" width="20" height="14" rx="4" stroke="currentColor" strokeWidth="2" />
      <polygon points="10 9 16 12 10 15 10 9" fill="currentColor" />
    </svg>
  );
}
function XLogo() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-[16px] w-[16px]" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644z" />
    </svg>
  );
}
function Globe() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px]" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path d="M3 12h18M12 3c2.5 2.5 2.5 15.5 0 18M12 3c-2.5 2.5-2.5 15.5 0 18" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

const socials = [
  { href: LINKS.instagram, Icon: IG, label: "Instagram" },
  { href: LINKS.x, Icon: XLogo, label: "X" },
  { href: LINKS.tiktok, Icon: TT, label: "TikTok" },
  { href: LINKS.youtube, Icon: YT, label: "YouTube" },
  { href: LINKS.website, Icon: Globe, label: "Website" },
];

const nav = [
  { href: "/", label: "Home" },
  { href: "/lineup", label: "Lineup" },
  { href: "/media", label: "Media" },
  { href: "/verify", label: "Verify" },
  { href: "/giveaway", label: "Giveaway" },
];

export function PublicFooter() {
  return (
    <footer className="relative z-10 mt-20 border-t border-gold/15 bg-black">
      {/* faint gold glow line */}
      <div className="mx-auto h-px max-w-md bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-5 py-14 text-center">
        <HollowtipsLogo variant="full" size={34} />

        <p className="max-w-sm text-sm leading-relaxed text-white/45">
          Live Resin · Liquid Diamonds · 2G. Scratch &amp; scan every pack to
          confirm it&apos;s authentic.
        </p>

        {/* nav */}
        <nav className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="font-condensed text-sm font-semibold uppercase tracking-[0.15em] text-white/65 transition-colors hover:text-gold"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        {/* socials */}
        <div className="flex items-center gap-3">
          {socials.map(({ href, Icon, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-gold/60 hover:text-gold"
            >
              <Icon />
            </a>
          ))}
        </div>

        <span className="rounded-full border border-gold/40 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-gold">
          21+ Only
        </span>
      </div>

      <div className="border-t border-white/10 px-5 py-5 text-center text-xs text-white/35">
        © {new Date().getFullYear()} Hollowtips · All rights reserved · Keep out
        of reach of children
      </div>
    </footer>
  );
}
