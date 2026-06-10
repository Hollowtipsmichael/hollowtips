"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";

export function CodeEntryForm() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [pending, setPending] = useState(false);

  function normalize(v: string) {
    // Codes are stored UPPERCASE, trimmed; allow letters/digits/dash.
    return v.toUpperCase().replace(/[^A-Z0-9-]/g, "");
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const c = normalize(code).trim();
    if (!c) return;
    setPending(true);
    router.push(`/verify/${encodeURIComponent(c)}`);
  }

  return (
    <form onSubmit={submit} className="w-full space-y-3">
      <input
        value={code}
        onChange={(e) => setCode(normalize(e.target.value))}
        placeholder="ENTER YOUR CODE"
        autoCapitalize="characters"
        autoCorrect="off"
        spellCheck={false}
        className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3.5 text-center font-mono text-lg tracking-[0.2em] text-white placeholder:tracking-normal placeholder:text-white/30 focus:border-gold focus:outline-none"
      />
      <button
        type="submit"
        disabled={pending || !code}
        className="btn-gold focus-gold w-full justify-center text-base"
      >
        {pending ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <>
            Verify <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
}
