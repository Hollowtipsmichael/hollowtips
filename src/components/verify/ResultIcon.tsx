import { Check, X } from "lucide-react";

export function ResultIcon({ variant }: { variant: "busted" | "legit" }) {
  const legit = variant === "legit";
  const color = legit ? "#34C759" : "#FF3B30";

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
          legit ? "" : "ht-shake"
        }`}
        style={{
          backgroundColor: legit ? "rgba(52,199,89,0.12)" : "rgba(255,59,48,0.12)",
          borderColor: legit ? "rgba(52,199,89,0.4)" : "rgba(255,59,48,0.4)",
          color,
        }}
      >
        {legit ? (
          <Check className="h-10 w-10" strokeWidth={2.5} />
        ) : (
          <X className="h-10 w-10" strokeWidth={2.5} />
        )}
      </div>
    </div>
  );
}
