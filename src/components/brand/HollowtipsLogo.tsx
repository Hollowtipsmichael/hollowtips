import Image from "next/image";

const BULLET_SRC = "/brand/hollowtips-bullet.png";

type Variant = "full" | "mark" | "wordmark";

interface HollowtipsLogoProps {
  variant?: Variant;
  /** Height of the bullet mark in px (wordmark scales with it). */
  size?: number;
  className?: string;
  /** Show the small "VERIFY" sub-label under the wordmark. */
  withTagline?: boolean;
}

/**
 * The Hollowtips brand lockup.
 * - `full`     → gold bullet mark + blackletter wordmark
 * - `mark`     → bullet only (for the collapsed sidebar / favicons)
 * - `wordmark` → blackletter text only
 *
 * The bullet PNG can later be swapped for the official SVG without touching
 * consumers of this component.
 */
export function HollowtipsLogo({
  variant = "full",
  size = 36,
  className = "",
  withTagline = false,
}: HollowtipsLogoProps) {
  const Mark = (
    <span
      className="relative inline-block shrink-0 drop-shadow-[0_0_12px_rgba(212,175,55,0.35)]"
      style={{ height: size, width: size * 0.42 }}
    >
      <Image
        src={BULLET_SRC}
        alt="Hollowtips"
        fill
        sizes={`${size}px`}
        className="object-contain"
        priority
      />
    </span>
  );

  const Wordmark = (
    <span className="flex flex-col leading-none">
      <span
        className="font-display tracking-wide text-gold-gradient"
        style={{ fontSize: size * 0.72 }}
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
    <span className={`flex items-center gap-3 ${className}`}>
      {Mark}
      {Wordmark}
    </span>
  );
}
