const LOGO_SRC = "/brand/hollowtips-logo.png";

type Variant = "full" | "mark" | "wordmark";

interface HollowtipsLogoProps {
  variant?: Variant;
  /** Height of the logo mark in px (wordmark scales with it). */
  size?: number;
  className?: string;
  /** Show the small "VERIFY" sub-label under the wordmark. */
  withTagline?: boolean;
}

/**
 * The Hollowtips brand lockup — the real gold logo (transparent PNG).
 * - `full`     → gold logo mark + blackletter wordmark
 * - `mark`     → logo only (collapsed sidebar / footer / favicon)
 * - `wordmark` → blackletter text only
 */
export function HollowtipsLogo({
  variant = "full",
  size = 36,
  className = "",
  withTagline = false,
}: HollowtipsLogoProps) {
  const Mark = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={LOGO_SRC}
      alt="Hollowtips"
      width={size}
      height={size}
      className="shrink-0 object-contain drop-shadow-[0_0_14px_rgba(212,175,55,0.4)]"
      style={{ height: size, width: size }}
    />
  );

  const Wordmark = (
    <span className="flex flex-col leading-none">
      <span
        className="font-condensed font-bold tracking-wide text-gold-shine"
        style={{ fontSize: size * 0.78 }}
      >
        Hollowtips
      </span>
      {withTagline && (
        <span
          className="mt-1 font-sans font-semibold uppercase tracking-[0.42em] text-muted"
          style={{ fontSize: Math.max(9, size * 0.2) }}
        >
          Verify
        </span>
      )}
    </span>
  );

  if (variant === "mark") {
    return <span className={className}>{Mark}</span>;
  }
  if (variant === "wordmark") {
    return <span className={className}>{Wordmark}</span>;
  }

  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      {Mark}
      {Wordmark}
    </span>
  );
}
