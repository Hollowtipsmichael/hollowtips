"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Flag, FlagOff, QrCode, Trash2, Loader2 } from "lucide-react";
import { setCodeStatus, deleteCode } from "@/app/admin/(shell)/codes/actions";
import { CodeStatus } from "@/lib/enums";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

export function CodeRowActions({
  id,
  code,
  status,
}: {
  id: string;
  code: string;
  status: string;
}) {
  const router = useRouter();
  const [confirm, setConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const isFlagged = status === CodeStatus.FLAGGED;

  function toggleFlag() {
    startTransition(async () => {
      await setCodeStatus(id, isFlagged ? CodeStatus.UNUSED : CodeStatus.FLAGGED);
      router.refresh();
    });
  }

  function onDelete() {
    setError(null);
    startTransition(async () => {
      const res = await deleteCode(id);
      if ("error" in res) {
        setError(res.error);
      } else {
        setConfirm(false);
        router.refresh();
      }
    });
  }

  const iconBtn =
    "focus-gold grid h-8 w-8 place-items-center rounded-lg border border-subtle transition-colors disabled:opacity-50";

  return (
    <div className="flex items-center justify-end gap-1.5">
      <a
        href={`/api/admin/codes/qr?id=${id}`}
        download={`${code}.png`}
        aria-label="Download QR"
        title="Download QR"
        className={`${iconBtn} text-muted hover:border-gold/40 hover:text-gold`}
      >
        <QrCode className="h-4 w-4" />
      </a>

      <button
        type="button"
        onClick={toggleFlag}
        disabled={pending}
        aria-label={isFlagged ? "Unflag" : "Flag"}
        title={isFlagged ? "Unflag" : "Flag"}
        className={`${iconBtn} ${
          isFlagged
            ? "border-graffiti-pink/40 text-graffiti-pink"
            : "text-muted hover:border-graffiti-pink/40 hover:text-graffiti-pink"
        }`}
      >
        {pending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isFlagged ? (
          <FlagOff className="h-4 w-4" />
        ) : (
          <Flag className="h-4 w-4" />
        )}
      </button>

      <button
        type="button"
        onClick={() => setConfirm(true)}
        aria-label="Delete code"
        title="Delete"
        className={`${iconBtn} text-muted hover:border-red-500/40 hover:text-red-400`}
      >
        <Trash2 className="h-4 w-4" />
      </button>

      <ConfirmDialog
        open={confirm}
        title="Delete code"
        message={error ?? `Permanently delete ${code}? This cannot be undone.`}
        confirmLabel="Delete"
        loading={pending}
        onConfirm={onDelete}
        onCancel={() => {
          setConfirm(false);
          setError(null);
        }}
      />
    </div>
  );
}
