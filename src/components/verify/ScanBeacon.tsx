"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

/**
 * Records one scan per page load (JS-only, so bots/link-previews don't count),
 * then refreshes the page so the displayed status/scan-count reflect the DB.
 */
export function ScanBeacon({ code }: { code: string }) {
  const router = useRouter();
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return; // once per mount (guards React StrictMode)
    fired.current = true;
    fetch("/api/verify/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    })
      .then(() => router.refresh())
      .catch(() => {});
  }, [code, router]);

  return null;
}
