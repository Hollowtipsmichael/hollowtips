"use client";

import { forwardRef, type ReactNode } from "react";

const inputBase =
  "focus-gold w-full rounded-xl border border-subtle bg-bg/60 px-3 py-2.5 text-fg placeholder:text-muted/60 transition-colors disabled:opacity-60";

export function Field({
  label,
  htmlFor,
  error,
  hint,
  required,
  children,
  className = "",
}: {
  label: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label
        htmlFor={htmlFor}
        className="flex items-center gap-1 text-sm font-medium text-muted"
      >
        {label}
        {required && <span className="text-gold">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-muted">{hint}</p>}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

export const TextInput = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(function TextInput({ className = "", ...props }, ref) {
  return <input ref={ref} className={`${inputBase} ${className}`} {...props} />;
});

export const TextArea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(function TextArea({ className = "", rows = 4, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={`${inputBase} resize-y ${className}`}
      {...props}
    />
  );
});

export function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="focus-gold flex w-full items-center justify-between gap-4 rounded-xl border border-subtle bg-bg/40 px-4 py-3 text-left transition-colors hover:border-gold/30"
    >
      <span>
        <span className="block text-sm font-medium text-fg">{label}</span>
        {description && (
          <span className="block text-xs text-muted">{description}</span>
        )}
      </span>
      <span
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? "bg-gold-gradient" : "bg-panel-raised"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-[22px]" : "translate-x-0.5"
          }`}
        />
      </span>
    </button>
  );
}
