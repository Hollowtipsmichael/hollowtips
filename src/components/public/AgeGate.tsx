"use client";

import { useEffect, useState } from "react";
import { HollowtipsLogo } from "@/components/brand/HollowtipsLogo";

const KEY = "ht-age-ok";

export function AgeGate() {
  const [open, setOpen] = useState(false);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(KEY) !== "1") setOpen(true);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-black px-5">
      <div className="grain pointer-events-none absolute inset-0 opacity-60" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.12),transparent_60%)]" />
      <div className="relative z-10 w-full max-w-md text-center">
        <div className="mb-8 flex justify-center">
          <HollowtipsLogo variant="full" size={48} />
        </div>
        {blocked ? (
          <>
            <h1 className="font-gta text-4xl uppercase tracking-wide text-red-500">
              Access Denied
            </h1>
            <p className="mt-3 text-sm text-white/60">
              You must be 21 or older to enter. Come back when you&apos;re of age.
            </p>
          </>
        ) : (
          <>
            <h1 className="font-gta text-4xl uppercase tracking-wide text-gold-gradient sm:text-5xl">
              Are you 21+?
            </h1>
            <p className="mt-3 text-sm text-white/60">
              Hollowtips is for adults 21 and over. Please verify your age to enter.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={() => {
                  localStorage.setItem(KEY, "1");
                  setOpen(false);
                }}
                className="btn-gold focus-gold"
              >
                I&apos;m 21 or older
              </button>
              <button
                type="button"
                onClick={() => setBlocked(true)}
                className="focus-gold rounded-xl border border-white/15 px-5 py-2.5 text-sm font-medium text-white/70 transition-colors hover:text-white"
              >
                Under 21
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
