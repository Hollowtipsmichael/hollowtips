"use client";

import { useEffect, useRef, useState } from "react";
import { signOut } from "next-auth/react";
import { ChevronDown, LogOut } from "lucide-react";

interface UserMenuProps {
  name: string;
  email: string;
}

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function UserMenu({ name, email }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="focus-gold flex items-center gap-2 rounded-xl border border-subtle bg-panel py-1.5 pl-1.5 pr-2.5 transition-colors hover:border-gold/40"
      >
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-gold-gradient text-xs font-bold text-black">
          {initials(name)}
        </span>
        <span className="hidden text-sm font-medium text-fg sm:block">
          {name}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-muted transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-subtle bg-panel-raised shadow-panel"
        >
          <div className="border-b border-subtle px-4 py-3">
            <p className="truncate text-sm font-semibold text-fg">{name}</p>
            <p className="truncate text-xs text-muted">{email}</p>
          </div>
          <button
            type="button"
            role="menuitem"
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-muted transition-colors hover:bg-bg hover:text-red-400"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
