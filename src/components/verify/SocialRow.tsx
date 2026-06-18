import { Instagram, Youtube } from "lucide-react";
import { LINKS } from "@/lib/links";

function TikTok({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M16.5 3c.36 2.3 1.86 3.94 4.5 4.14v2.6c-1.53.15-2.87-.35-4.43-1.29v5.7c0 5.5-6 7.22-8.41 3.28-1.55-2.54-.6-7 4.39-7.18v2.74c-.38.06-.79.16-1.16.29-1.11.38-1.74 1.08-1.56 2.32.33 2.38 4.7 3.08 4.34-1.58V3h2.34z" />
    </svg>
  );
}

const items = [
  { label: "Instagram", href: LINKS.instagram, Icon: Instagram },
  { label: "TikTok", href: LINKS.tiktok, Icon: TikTok },
  { label: "YouTube", href: LINKS.youtube, Icon: Youtube },
];

export function SocialRow() {
  return (
    <div className="w-full">
      <p className="mb-3 text-center text-xs uppercase tracking-[0.3em] text-white/40">
        Follow Hollowtips
      </p>
      <div className="flex items-center justify-center gap-3">
        {items.map(({ label, href, Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            title={label}
            className="grid h-11 w-11 place-items-center rounded-xl border border-white/15 bg-white/5 text-white/70 transition-colors hover:border-gold/50 hover:text-gold"
          >
            <Icon className="h-5 w-5" />
          </a>
        ))}
      </div>
    </div>
  );
}
