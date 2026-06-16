"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Loader2, X, MapPin } from "lucide-react";
import { CopyButton } from "./CopyButton";

interface ScanRow {
  n: number;
  ip: string | null;
  location: string;
  device: string;
  first: boolean;
  at: string;
}

export function CodeScansDialog({ code, codeId }: { code: string; codeId: string }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scans, setScans] = useState<ScanRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);

  async function openDialog() {
    setOpen(true);
    if (scans) return; // already loaded
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/codes/scans?id=${codeId}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to load");
      setScans(json.scans);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <span className="inline-flex items-center gap-1.5">
        <button
          type="button"
          onClick={openDialog}
          className="focus-gold rounded font-mono text-fg underline-offset-2 hover:text-gold hover:underline"
          title="View scan history"
        >
          {code}
        </button>
        <CopyButton value={code} />
      </span>

      {open &&
        mounted &&
        createPortal(
          <div className="fixed inset-0 z-[60] grid place-items-center p-4">
            <div
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Scan history"
              className="relative z-10 max-h-[85vh] w-full max-w-2xl animate-fade-in overflow-hidden rounded-2xl border border-subtle bg-panel shadow-panel"
            >
              <div className="flex items-center justify-between border-b border-subtle px-5 py-4">
                <div>
                  <h3 className="font-display text-lg tracking-wide text-fg">
                    Scan history
                  </h3>
                  <p className="font-mono text-xs text-muted">{code}</p>
                </div>
                <button
                  type="button"
                  aria-label="Close"
                  onClick={() => setOpen(false)}
                  className="focus-gold grid h-8 w-8 place-items-center rounded-lg text-muted hover:text-fg"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="max-h-[65vh] overflow-auto scrollbar-thin">
                {loading ? (
                  <div className="grid place-items-center py-16">
                    <Loader2 className="h-6 w-6 animate-spin text-gold" />
                  </div>
                ) : error ? (
                  <p className="py-12 text-center text-sm text-red-400">{error}</p>
                ) : !scans || scans.length === 0 ? (
                  <p className="py-12 text-center text-sm text-muted">
                    No scans recorded for this code yet.
                  </p>
                ) : (
                  <table className="w-full min-w-[560px] text-sm">
                    <thead>
                      <tr className="border-b border-subtle text-left text-xs uppercase tracking-wide text-muted">
                        <th className="px-4 py-3 font-medium">#</th>
                        <th className="px-4 py-3 font-medium">When</th>
                        <th className="px-4 py-3 font-medium">Location</th>
                        <th className="px-4 py-3 font-medium">IP address</th>
                        <th className="px-4 py-3 font-medium">Device</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scans.map((s) => (
                        <tr
                          key={s.n}
                          className="border-b border-subtle/60 last:border-0"
                        >
                          <td className="px-4 py-3">
                            <span className="font-medium text-fg">{s.n}</span>
                            {s.first && (
                              <span className="ml-1.5 rounded-full border border-graffiti-lime/30 bg-graffiti-lime/10 px-1.5 py-0.5 text-[10px] text-graffiti-lime">
                                first
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-muted">
                            {new Date(s.at).toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-muted">
                            <span className="inline-flex items-center gap-1.5">
                              <MapPin className="h-3.5 w-3.5 text-gold/60" />
                              {s.location}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-mono text-xs text-muted">
                            {s.ip ?? "—"}
                          </td>
                          <td className="px-4 py-3 text-muted">
                            {s.device.charAt(0) + s.device.slice(1).toLowerCase()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
