"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";
import { deleteEmail } from "@/app/admin/(shell)/emails/actions";

export function DeleteEmailButton({ id }: { id: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      aria-label="Delete email"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await deleteEmail(id);
          router.refresh();
        })
      }
      className="focus-gold grid h-8 w-8 place-items-center rounded-lg border border-subtle text-muted hover:border-red-500/40 hover:text-red-400 disabled:opacity-50"
    >
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
    </button>
  );
}
