/**
 * GTA-6 giveaway section — Blockstar logo + prize copy. Used on the verify
 * result screens (LEGIT / BUSTED) and the /giveaway page. Never in header/nav.
 * `note` tailors the closing line (e.g. "Signing up above enters you
 * automatically." on verify, "No purchase required to enter here." on /giveaway).
 */
export function GiveawaySection({ note }: { note?: string }) {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-gold/25 bg-[linear-gradient(135deg,#141008_0%,#1a1200_100%)] px-5 py-6 text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/blockstar.png"
        alt="Blockstar"
        className="mx-auto h-16 w-16 rounded-2xl"
      />
      <p className="mt-4 font-condensed text-[11px] font-bold uppercase tracking-[3px] text-gold/70">
        Hollowtips × GTA VI Giveaway
      </p>
      <h3 className="mt-1.5 font-condensed text-2xl font-black uppercase leading-none tracking-[1px] text-gold">
        Win 1 of 100 GTA VI Copies
      </h3>
      <p className="mt-2 text-[13px] text-[#bbb]">
        100 winners, selected at random. Free entry — join the email &amp; SMS
        list. Selection Nov 19, 2026.
      </p>
      {note && <p className="mt-2 text-xs text-[#888]">{note}</p>}
    </div>
  );
}
