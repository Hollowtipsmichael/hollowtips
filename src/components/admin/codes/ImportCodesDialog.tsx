"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Upload, X, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

interface ImportResult {
  imported: number;
  skipped: number;
  unmatched: string[];
  unmatchedCount: number;
  blank: number;
}

export function ImportCodesDialog() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  async function onFile(file: File) {
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/codes/import", { method: "POST", body });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Import failed.");
      setResult(json);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Import failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          setResult(null);
          setError(null);
        }}
        className="focus-gold inline-flex items-center gap-2 rounded-xl border border-subtle px-4 py-2.5 text-sm font-medium text-muted transition-colors hover:border-gold/40 hover:text-gold"
      >
        <Upload className="h-4 w-4" />
        Import CSV
      </button>

      {open && mounted && createPortal(
        <div className="fixed inset-0 z-[60] grid place-items-center p-4">
          <div
            onClick={() => !busy && setOpen(false)}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Import codes"
            className="relative z-10 w-full max-w-md rounded-2xl border border-subtle bg-panel p-6 shadow-panel"
          >
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="font-display text-lg tracking-wide text-fg">
                  Import codes (CSV)
                </h3>
                <p className="text-xs text-muted">
                  Columns: <span className="font-mono">code, product</span>{" "}
                  (optional <span className="font-mono">variant</span>).
                </p>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={() => !busy && setOpen(false)}
                className="focus-gold grid h-8 w-8 place-items-center rounded-lg text-muted hover:text-fg"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {error && (
              <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-300">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            {result ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 rounded-xl border border-graffiti-lime/30 bg-graffiti-lime/10 px-4 py-3 text-sm text-graffiti-lime">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  Imported {result.imported} · skipped {result.skipped}
                  {result.unmatchedCount > 0
                    ? ` · ${result.unmatchedCount} unmatched`
                    : ""}
                </div>
                {result.unmatched.length > 0 && (
                  <div className="max-h-40 overflow-auto rounded-xl border border-subtle bg-bg/40 p-3 text-xs text-muted">
                    <p className="mb-1 font-medium text-fg">Unmatched (product not found):</p>
                    {result.unmatched.map((u, i) => (
                      <p key={i} className="font-mono">{u}</p>
                    ))}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="btn-gold focus-gold w-full justify-center"
                >
                  Done
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={busy}
                className="focus-gold flex aspect-[2/1] w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-subtle bg-bg/40 text-center transition-colors hover:border-gold/40"
              >
                {busy ? (
                  <Loader2 className="h-6 w-6 animate-spin text-gold" />
                ) : (
                  <>
                    <Upload className="h-6 w-6 text-gold" />
                    <span className="text-sm text-muted">Click to choose a .csv file</span>
                  </>
                )}
              </button>
            )}

            <input
              ref={inputRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void onFile(f);
              }}
            />
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
