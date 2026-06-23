import { LINKS } from "@/lib/links";

function Instagram() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-[22px] w-[22px]" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="#E1306C" strokeWidth="2" />
      <circle cx="12" cy="12" r="4" stroke="#E1306C" strokeWidth="2" />
      <circle cx="17.5" cy="6.5" r="1" fill="#E1306C" />
    </svg>
  );
}
function XLogo() {
  return (
    <svg viewBox="0 0 24 24" fill="#fff" className="h-[20px] w-[20px]" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644z" />
    </svg>
  );
}
function TikTok() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-[22px] w-[22px]" aria-hidden="true">
      <path d="M9 12a4 4 0 104 4V4a5 5 0 005 5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function YouTube() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-[22px] w-[22px]" aria-hidden="true">
      <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.97C18.88 4 12 4 12 4s-6.88 0-8.59.45A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.97C5.12 20 12 20 12 20s6.88 0 8.59-.45a2.78 2.78 0 001.95-1.97A29 29 0 0023 12a29 29 0 00-.46-5.58z" stroke="#FF0000" strokeWidth="2" />
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" stroke="#FF0000" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

const items = [
  { label: "Instagram", href: LINKS.instagram, Icon: Instagram },
  { label: "X", href: LINKS.x, Icon: XLogo },
  { label: "TikTok", href: LINKS.tiktok, Icon: TikTok },
  { label: "YouTube", href: LINKS.youtube, Icon: YouTube },
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
            className="flex flex-1 flex-col items-center gap-1.5 rounded-[10px] border border-[#222] bg-[#111] px-2 py-3.5 transition-colors hover:border-gold-deep active:scale-[0.96]"
          >
            <Icon />
            <span className="font-condensed text-[11px] uppercase tracking-[1.5px] text-[#888]">
              {label}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
