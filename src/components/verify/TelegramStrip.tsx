import { ArrowRight } from "lucide-react";
import { LINKS } from "@/lib/links";

function TelegramIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M21.94 4.6 18.6 20.3c-.25 1.1-.9 1.38-1.83.86l-5.06-3.73-2.44 2.35c-.27.27-.5.5-1.02.5l.36-5.16 9.4-8.5c.4-.36-.09-.56-.63-.2L4.13 13.2l-5-1.56C-1.95 11.3-1.98 10.55.3 9.7L19.5 2.3c.96-.36 1.8.22 1.44 2.3z" />
    </svg>
  );
}

export function TelegramStrip() {
  return (
    <a
      href={LINKS.telegram}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex w-full items-center gap-3 rounded-2xl border border-white/15 bg-white/5 p-4 transition-colors hover:border-[#27A7E5]/60"
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#27A7E5] text-white">
        <TelegramIcon className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1 text-left">
        <span className="block text-sm font-semibold text-white">
          Join us on Telegram
        </span>
        <span className="block text-xs text-white/60">
          Drops, deals &amp; exclusive updates.
        </span>
      </span>
      <ArrowRight className="h-4 w-4 shrink-0 text-white/50 transition-transform group-hover:translate-x-0.5" />
    </a>
  );
}
