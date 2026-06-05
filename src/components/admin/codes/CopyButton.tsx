"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard blocked — ignore
    }
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      aria-label="Copy code"
      className="focus-gold grid h-7 w-7 place-items-center rounded-md text-muted transition-colors hover:text-gold"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-graffiti-lime" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
    </button>
  );
}
