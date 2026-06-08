import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function PaginationControls({
  page,
  perPage,
  total,
  makeHref,
}: {
  page: number;
  perPage: number;
  total: number;
  makeHref: (page: number) => string;
}) {
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const from = total === 0 ? 0 : (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);
  const prevDisabled = page <= 1;
  const nextDisabled = page >= totalPages;

  const btn =
    "focus-gold inline-flex items-center gap-1 rounded-lg border border-subtle px-3 py-1.5 text-sm transition-colors";

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
      <p className="text-xs text-muted">
        Showing <span className="text-fg">{from}</span>–
        <span className="text-fg">{to}</span> of{" "}
        <span className="text-fg">{total}</span>
      </p>
      <div className="flex items-center gap-2">
        {prevDisabled ? (
          <span className={`${btn} cursor-not-allowed text-muted/40`}>
            <ChevronLeft className="h-4 w-4" /> Prev
          </span>
        ) : (
          <Link
            href={makeHref(page - 1)}
            className={`${btn} text-muted hover:border-gold/40 hover:text-gold`}
          >
            <ChevronLeft className="h-4 w-4" /> Prev
          </Link>
        )}
        <span className="text-xs text-muted">
          Page {page} / {totalPages}
        </span>
        {nextDisabled ? (
          <span className={`${btn} cursor-not-allowed text-muted/40`}>
            Next <ChevronRight className="h-4 w-4" />
          </span>
        ) : (
          <Link
            href={makeHref(page + 1)}
            className={`${btn} text-muted hover:border-gold/40 hover:text-gold`}
          >
            Next <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </div>
  );
}
