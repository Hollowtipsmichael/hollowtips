"use client";

import { useState } from "react";
import { Loader2, Check, Mail, Phone, User } from "lucide-react";

const PERKS =
  "GTA 6 giveaway entry · Early drop access · 15% off first merch (code FIRSTSHOT) · SoCal event invites";

/**
 * "The Chamber" — community lead-capture form. First Name / Email / Phone
 * (all required) → POST /api/chamber, tagged by `source`. Confirms inline
 * ("You're in. Stay locked.") — no redirect.
 *
 * `accent`: "gold" (default — verify screens) | "neon" (flyer-styled
 * /giveaway page: pink focus borders + pink-gradient submit).
 */
export function TheChamberForm({
  source,
  accent = "gold",
}: {
  source: string;
  accent?: "gold" | "neon";
}) {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setError(null);
    try {
      const res = await fetch("/api/chamber", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, email, phone, source }),
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

  const neon = accent === "neon";
  const inputCls = `w-full rounded-xl border border-white/15 bg-black/40 py-3 pl-10 pr-3 text-white placeholder:text-white/40 focus:outline-none ${
    neon ? "focus:border-neon-pink" : "focus:border-gold"
  }`;

  if (state === "done") {
    return (
      <div className="rounded-2xl border border-legit/40 bg-legit/10 px-5 py-6 text-center">
        <Check className="mx-auto mb-2 h-7 w-7 text-legit" />
        <p className="font-condensed text-xl font-bold uppercase tracking-wide text-legit">
          You&apos;re in. Stay locked.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="relative">
        <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
        <input
          required
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First name"
          className={inputCls}
        />
      </div>
      <div className="relative">
        <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          className={inputCls}
        />
      </div>
      <div className="relative">
        <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
        <input
          type="tel"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone"
          className={inputCls}
        />
      </div>
      <button
        type="submit"
        disabled={state === "loading"}
        className={`flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 font-condensed text-base font-bold uppercase tracking-[1.5px] transition active:scale-[0.98] disabled:opacity-70 ${
          neon
            ? "bg-neon-gradient text-white shadow-neon-glow"
            : "bg-gold text-black"
        }`}
      >
        {state === "loading" ? <Loader2 className="h-5 w-5 animate-spin" /> : "Load Me In"}
      </button>
      {error && <p className="text-center text-xs text-red-400">{error}</p>}
      <p className="pt-1 text-center text-[11px] leading-relaxed text-white/45">
        {PERKS}
      </p>
    </form>
  );
}
