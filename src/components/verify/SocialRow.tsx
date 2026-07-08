import { LINKS } from "@/lib/links";

function Instagram() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-[22px] w-[22px]" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}
function TikTok() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-[22px] w-[22px]" aria-hidden="true">
      <path d="M9 12a4 4 0 104 4V4a5 5 0 005 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function YouTube() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-[22px] w-[22px]" aria-hidden="true">
      <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.97C18.88 4 12 4 12 4s-6.88 0-8.59.45A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.97C5.12 20 12 20 12 20s6.88 0 8.59-.45a2.78 2.78 0 001.95-1.97A29 29 0 0023 12a29 29 0 00-.46-5.58z" stroke="currentColor" strokeWidth="2" />
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}
function Telegram() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-[22px] w-[22px]" aria-hidden="true">
      <path d="M21.5 4.5 2.9 11.4c-.9.35-.9 1.6 0 1.95l4.4 1.5 1.7 5.2c.25.75 1.2.9 1.65.25l2.35-3.1 4.5 3.3c.6.45 1.45.1 1.6-.6L22.9 5.7c.2-.9-.6-1.55-1.4-1.2Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="m7.3 14.85 9.9-6.85-7.6 7.15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const items = [
  { label: "Instagram", href: LINKS.instagram, Icon: Instagram },
  { label: "TikTok", href: LINKS.tiktok, Icon: TikTok },
  { label: "YouTube", href: LINKS.youtube, Icon: YouTube },
  { label: "Telegram", href: LINKS.telegram, Icon: Telegram },
];

export function SocialRow() {
  return (
    <div className="w-full">
      <p className="mb-3.5 text-center font-condensed text-[11px] uppercase tracking-[3px] text-[#888]">
        Follow Hollowtips
      </p>
      <div className="flex w-full gap-3">
        {items.map(({ label, href, Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 flex-col items-center gap-1.5 rounded-[10px] border border-gold/30 bg-[#111] px-2 py-3.5 text-gold transition-colors hover:border-gold hover:bg-gold/5 active:scale-[0.96]"
          >
            <Icon />
            <span className="font-condensed text-[11px] uppercase tracking-[1.5px] text-[#999]">
              {label}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
