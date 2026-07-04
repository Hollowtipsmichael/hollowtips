import type { LucideIcon } from "lucide-react";

type Accent = "gold" | "pink" | "lime" | "orange";

const accentRing: Record<Accent, string> = {
  gold: "from-gold-light via-gold to-gold-deep",
  pink: "from-graffiti-pink/80 to-graffiti-pink",
  lime: "from-graffiti-lime/80 to-graffiti-lime",
  orange: "from-graffiti-orange/80 to-graffiti-orange",
};

const accentText: Record<Accent, string> = {
  gold: "text-gold",
  pink: "text-graffiti-pink",
  lime: "text-graffiti-lime",
  orange: "text-graffiti-orange",
};

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  accent?: Accent;
  hint?: string;
  loading?: boolean;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  accent = "gold",
  hint,
  loading = false,
}: StatCardProps) {
  return (
    <div className="card card-hover grain relative overflow-hidden p-5">
      {/* Hairline accent line at the top */}
      <div
        className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${accentRing[accent]} opacity-70`}
      />

      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted">{label}</p>
          {loading ? (
            <div className="relative mt-2 h-8 w-20 overflow-hidden rounded-md bg-panel-raised">
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>
          ) : (
            <p className="font-condensed text-3xl leading-none tracking-wide text-fg">
              {value}
            </p>
          )}
          {hint && <p className="pt-1 text-xs text-muted">{hint}</p>}
        </div>

        <span
          className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${accentRing[accent]} shadow-gold-glow`}
        >
          <Icon className="h-5 w-5 text-black/80" />
        </span>
      </div>
    </div>
  );
}

export { accentText };
