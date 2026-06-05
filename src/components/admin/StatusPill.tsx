export function StatusPill({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${
        active
          ? "border-graffiti-lime/30 bg-graffiti-lime/10 text-graffiti-lime"
          : "border-subtle bg-panel-raised text-muted"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          active ? "bg-graffiti-lime" : "bg-muted"
        }`}
      />
      {active ? "Active" : "Inactive"}
    </span>
  );
}
