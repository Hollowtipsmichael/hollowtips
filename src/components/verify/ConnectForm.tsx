"use client";

import { useState } from "react";
import { Loader2, Check, Mail, Phone, User } from "lucide-react";

export function ConnectForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setError(null);
    try {
      const res = await fetch("/api/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone }),
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

  const inputCls =
    "w-full rounded-xl border border-white/15 bg-black/40 py-2.5 pl-10 pr-3 text-white placeholder:text-white/40 focus:border-gold focus:outline-none";

  if (state === "done") {
    return (
      <div className="flex items-center justify-center gap-2 rounded-xl border border-graffiti-lime/30 bg-graffiti-lime/10 px-4 py-4 text-sm text-graffiti-lime">
        <Check className="h-5 w-5" />
        You&apos;re entered — good luck! We&apos;ll be in touch.
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="relative">
        <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name (optional)" className={inputCls} />
      </div>
      <div className="relative">
        <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" className={inputCls} />
      </div>
      <div className="relative">
        <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" className={inputCls} />
      </div>
      <button type="submit" disabled={state === "loading"} className="btn-gold focus-gold w-full justify-center">
        {state === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enter the giveaway"}
      </button>
      {error && <p className="text-center text-xs text-red-400">{error}</p>}
    </form>
  );
}
