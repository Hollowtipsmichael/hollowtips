import { Check, AlertTriangle } from "lucide-react";

/**
 * Verify result hero icon.
 * LEGIT  → green checkmark (#22c55e) with soft pulsing rings.
 * BUSTED → red pulsing alert triangle (#ef4444) with a one-shot shake.
 */
export function ResultIcon({ variant }: { variant: "busted" | "legit" }) {
  const legit = variant === "legit";
  const color = legit ? "#22c55e" : "#ef4444";

  return (
    <div className="relative grid h-[180px] w-[180px] place-items-center">
      {/* two pulsing burst rings */}
      <span
        className="ht-ring absolute h-[140px] w-[140px] rounded-full border-2"
        style={{ borderColor: color }}
      />
      <span
        className="ht-ring absolute h-[180px] w-[180px] rounded-full border-2"
        style={{ borderColor: color, animationDelay: "0.4s", opacity: 0.1 }}
      />
      {/* icon circle */}
      <div
        className={`relative z-10 grid h-[88px] w-[88px] place-items-center rounded-full border-2 ${
          legit ? "" : "ht-shake ht-pulse"
        }`}
        style={{
          backgroundColor: legit ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)",
          borderColor: legit ? "rgba(34,197,94,0.4)" : "rgba(239,68,68,0.4)",
          color,
        }}
      >
        {legit ? (
          <Check className="h-10 w-10" strokeWidth={2.5} />
        ) : (
          <AlertTriangle className="h-9 w-9" strokeWidth={2.5} />
        )}
      </div>
    </div>
  );
}
