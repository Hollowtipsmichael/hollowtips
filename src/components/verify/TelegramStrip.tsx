import { LINKS } from "@/lib/links";

export function TelegramStrip() {
  return (
    <a
      href={LINKS.telegram}
      target="_blank"
      rel="noopener noreferrer"
      className="flex w-full items-center gap-3.5 rounded-xl border border-[#1a2a3a] bg-[#0f1620] px-5 py-4 transition-colors hover:border-[#2a6096]"
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#229ED9]">
        <svg viewBox="0 0 24 24" fill="white" className="h-[18px] w-[18px]" aria-hidden="true">
          <path d="M21.85 2.68L2.1 10.08c-1.32.53-1.31 1.27-.24 1.6l4.9 1.53 1.89 5.76c.23.63.11.88.77.88.5 0 .73-.24 1.02-.53l2.44-2.38 4.93 3.64c.91.5 1.56.24 1.79-.84l3.24-15.27c.33-1.34-.52-1.95-1.99-1.79z" />
        </svg>
      </span>
      <div>
        <div className="font-condensed text-[15px] font-bold tracking-[0.5px] text-white">
          Join the Telegram
        </div>
        <div className="mt-0.5 text-xs text-[#555]">
          Drops, deals &amp; exclusive updates
        </div>
      </div>
    </a>
  );
}
