import { Check, X } from "lucide-react";

export function ResultIcon({ variant }: { variant: "busted" | "legit" }) {
  const legit = variant === "legit";
  return (
    <div
      className={`relative grid h-24 w-24 place-items-center rounded-full border-2 ${
        legit
          ? "ht-pulse-ring border-graffiti-lime/60 bg-graffiti-lime/10 text-graffiti-lime shadow-[0_0_40px_rgba(166,226,46,0.35)]"
          : "ht-pulse-ring ht-shake border-red-500/60 bg-red-500/10 text-red-500 shadow-[0_0_40px_rgba(239,68,68,0.4)]"
      }`}
    >
      {legit ? (
        <Check className="h-11 w-11" strokeWidth={3} />
      ) : (
        <X className="h-11 w-11" strokeWidth={3} />
      )}
    </div>
  );
}
