import { CodeStatus } from "@/lib/enums";

const STYLES: Record<string, string> = {
  [CodeStatus.UNUSED]: "border-subtle bg-panel-raised text-muted",
  [CodeStatus.VERIFIED]:
    "border-graffiti-lime/30 bg-graffiti-lime/10 text-graffiti-lime",
  [CodeStatus.FLAGGED]:
    "border-graffiti-pink/30 bg-graffiti-pink/10 text-graffiti-pink",
};

const DOT: Record<string, string> = {
  [CodeStatus.UNUSED]: "bg-muted",
  [CodeStatus.VERIFIED]: "bg-graffiti-lime",
  [CodeStatus.FLAGGED]: "bg-graffiti-pink",
};

const LABEL: Record<string, string> = {
  [CodeStatus.UNUSED]: "Unused",
  [CodeStatus.VERIFIED]: "Verified",
  [CodeStatus.FLAGGED]: "Flagged",
};

export function CodeStatusBadge({ status }: { status: string }) {
  const style = STYLES[status] ?? STYLES[CodeStatus.UNUSED];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${style}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${DOT[status] ?? "bg-muted"}`} />
      {LABEL[status] ?? status}
    </span>
  );
}
