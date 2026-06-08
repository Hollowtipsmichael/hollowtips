"use client";

import { useState, useTransition } from "react";
import { Loader2, Check, AlertCircle } from "lucide-react";
import { changePassword } from "@/app/admin/(shell)/settings/actions";
import { Field, TextInput } from "@/components/admin/ui/form";

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
    <form onSubmit={submit} className="max-w-md space-y-4">
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
      <Field label="Current password" required>
        <TextInput
          type="password"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          autoComplete="current-password"
          required
        />
      </Field>
      <Field label="New password" hint="At least 8 characters" required>
        <TextInput
          type="password"
          value={next}
          onChange={(e) => setNext(e.target.value)}
          autoComplete="new-password"
          required
        />
      </Field>
      <Field label="Confirm new password" required>
        <TextInput
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          autoComplete="new-password"
          required
        />
      </Field>
      <button type="submit" disabled={pending} className="btn-gold focus-gold">
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Update password
      </button>
    </form>
  );
}
