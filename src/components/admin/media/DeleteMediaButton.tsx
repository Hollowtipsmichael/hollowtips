"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteMedia } from "@/app/admin/(shell)/media/actions";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

export function DeleteMediaButton({ id, title }: { id: string; title: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onConfirm() {
    setError(null);
    startTransition(async () => {
      const res = await deleteMedia(id);
      if (res?.error) setError(res.error);
      else {
        setOpen(false);
        router.refresh();
      }
    });
  }

  return (
    <>
      <button
        type="button"
        aria-label={`Delete ${title}`}
        onClick={() => setOpen(true)}
        className="focus-gold grid h-9 w-9 place-items-center rounded-lg border border-subtle text-muted transition-colors hover:border-red-500/40 hover:text-red-400"
      >
        <Trash2 className="h-4 w-4" />
      </button>
      <ConfirmDialog
        open={open}
        title="Delete media"
        message={error ?? `Delete "${title}"? This cannot be undone.`}
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
