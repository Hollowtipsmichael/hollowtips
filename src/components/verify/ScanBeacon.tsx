"use client";

import { useEffect } from "react";

/**
 * Fires a single scan event for this code on mount. Side-effect is kept out of
 * the server render so bots/prefetch (no JS) don't inflate scan counts.
 * Uses sessionStorage so a refresh in the same session doesn't double-count.
 */
export function ScanBeacon({ code }: { code: string }) {
  useEffect(() => {
    const key = `ht-scanned-${code}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    fetch("/api/verify/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
      keepalive: true,
    }).catch(() => {
      // best-effort; ignore network errors
    });
  }, [code]);

  return null;
}
