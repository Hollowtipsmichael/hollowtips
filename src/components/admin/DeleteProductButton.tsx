"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteProduct } from "@/app/admin/(shell)/products/actions";
import { ConfirmDialog } from "./ConfirmDialog";

export function DeleteProductButton({
  id,
  name,
  variant = "icon",
}: {
  id: string;
  name: string;
  variant?: "icon" | "button";
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onConfirm() {
    setError(null);
    startTransition(async () => {
      const res = await deleteProduct(id);
      if (res?.error) {
        setError(res.error);
      } else {
        setOpen(false);
      }
    });
  }

  return (
    <>
      {variant === "icon" ? (
        <button
          type="button"
          aria-label={`Delete ${name}`}
          onClick={() => setOpen(true)}
          className="focus-gold grid h-9 w-9 place-items-center rounded-lg border border-subtle text-muted transition-colors hover:border-red-500/40 hover:text-red-400"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="focus-gold inline-flex items-center gap-2 rounded-xl border border-subtle px-4 py-2.5 text-sm font-medium text-muted transition-colors hover:border-red-500/40 hover:text-red-400"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </button>
      )}

      <ConfirmDialog
        open={open}
        title="Delete product"
        message={
          error
            ? error
            : `"${name}" and all its verification codes & scans will be permanently removed. This cannot be undone.`
        }
        confirmLabel="Delete"
        loading={pending}
        onConfirm={onConfirm}
        onCancel={() => {
          setOpen(false);
          setError(null);
        }}
      />
    </>
  );
}
