"use client";

import { useState, useTransition } from "react";
import { Loader2, Check, AlertCircle, Lock, Eye, EyeOff } from "lucide-react";
import { changePassword } from "@/app/admin/(shell)/settings/actions";

function PasswordField({
  id,
  label,
  value,
  onChange,
  hint,
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  autoComplete?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="flex items-center gap-1 text-sm font-medium text-muted">
        {label} <span className="text-gold">*</span>
      </label>
      <div className="relative">
        <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          required
          className="focus-gold w-full rounded-xl border border-subtle bg-bg/60 py-2.5 pl-10 pr-10 text-fg placeholder:text-muted/60"
        />
        <button
          type="button"
          aria-label={show ? "Hide password" : "Show password"}
          onClick={() => setShow((s) => !s)}
          className="focus-gold absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-md text-muted hover:text-gold"
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {hint && <p className="text-xs text-muted">{hint}</p>}
    </div>
  );
}

export function ChangePasswordForm() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pending, startTransition] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setDone(false);
    if (next.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    if (next !== confirm) {
      setError("New passwords do not match.");
      return;
    }
    startTransition(async () => {
      const res = await changePassword(current, next);
      if ("error" in res) {
        setError(res.error);
        return;
      }
      setDone(true);
      setCurrent("");
      setNext("");
      setConfirm("");
    });
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}
      {done && (
        <div className="flex items-center gap-2 rounded-xl border border-graffiti-lime/30 bg-graffiti-lime/10 px-4 py-2.5 text-sm text-graffiti-lime">
          <Check className="h-4 w-4 shrink-0" />
          Password updated.
        </div>
      )}

      <PasswordField
        id="current-password"
        label="Current password"
        value={current}
        onChange={setCurrent}
        autoComplete="current-password"
      />
      <PasswordField
        id="new-password"
        label="New password"
        value={next}
        onChange={setNext}
        hint="At least 8 characters"
        autoComplete="new-password"
      />
      <PasswordField
        id="confirm-password"
        label="Confirm new password"
        value={confirm}
        onChange={setConfirm}
        autoComplete="new-password"
      />

      <button
        type="submit"
        disabled={pending}
        className="btn-gold focus-gold w-full justify-center"
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Update password
      </button>
    </form>
  );
}
