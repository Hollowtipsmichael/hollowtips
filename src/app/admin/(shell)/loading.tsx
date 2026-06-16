export default function AdminLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-3 w-28 animate-pulse rounded bg-panel-raised" />
        <div className="h-8 w-56 animate-pulse rounded bg-panel-raised" />
      </div>
      <div className="rule-gold" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card h-28 animate-pulse" />
        ))}
      </div>
      <div className="card h-80 animate-pulse" />
    </div>
  );
}
