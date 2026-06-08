"use client";

import { useState } from "react";
import { Loader2, Check, Mail } from "lucide-react";

export function EmailOptIn({ productId }: { productId?: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setError(null);
    try {
      const res = await fetch("/api/verify/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, productId }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Something went wrong.");
      }
      setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="flex items-center justify-center gap-2 rounded-xl border border-graffiti-lime/30 bg-graffiti-lime/10 px-4 py-3 text-sm text-graffiti-lime">
        <Check className="h-4 w-4" />
        You&apos;re on the list — drops incoming.
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-2">
      <p className="text-center text-xs uppercase tracking-[0.25em] text-white/50">
        Get the next drop first
      </p>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="w-full rounded-xl border border-white/15 bg-black/40 py-2.5 pl-10 pr-3 text-white placeholder:text-white/40 focus:border-gold focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={state === "loading"}
          className="btn-gold focus-gold shrink-0"
        >
          {state === "loading" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Notify me"
          )}
        </button>
      </div>
      {error && <p className="text-center text-xs text-red-400">{error}</p>}
    </form>
  );
}
