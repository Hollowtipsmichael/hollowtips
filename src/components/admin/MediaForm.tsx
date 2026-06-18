"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Loader2, AlertCircle, Save, Link2, Upload } from "lucide-react";
import type { MediaInput } from "@/lib/validators";
import { createMedia, updateMedia } from "@/app/admin/(shell)/media/actions";
import { Field, TextInput, Toggle } from "./ui/form";
import { MediaUploadField } from "./MediaUploadField";

export interface MediaFormInitial {
  id?: string;
  title: string;
  category: string;
  videoUrl: string;
  thumbnailUrl?: string;
  publishedAt: string; // yyyy-mm-dd
  isNew: boolean;
  isActive: boolean;
  sortOrder: number;
}

const EMPTY: MediaFormInitial = {
  title: "",
  category: "Trailers",
  videoUrl: "",
  publishedAt: "",
  isNew: false,
  isActive: true,
  sortOrder: 0,
};

export function MediaForm({
  mode,
  initial = EMPTY,
}: {
  mode: "create" | "edit";
  initial?: MediaFormInitial;
}) {
  const [form, setForm] = useState<MediaFormInitial>(initial);
  const [mediaMode, setMediaMode] = useState<"link" | "upload">(
    initial.videoUrl.startsWith("/uploads/") ? "upload" : "link",
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function set<K extends keyof MediaFormInitial>(k: K, v: MediaFormInitial[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const input: MediaInput = {
      title: form.title,
      category: form.category,
      videoUrl: form.videoUrl,
      thumbnailUrl: form.thumbnailUrl || undefined,
      publishedAt: form.publishedAt || undefined,
      isNew: form.isNew,
      isActive: form.isActive,
      sortOrder: form.sortOrder,
    };
    startTransition(async () => {
      const res =
        mode === "create"
          ? await createMedia(input)
          : await updateMedia(initial.id!, input);
      if (res?.error) setError(res.error);
    });
  }

  const tabBtn = (active: boolean) =>
    `flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
      active
        ? "border-gold/40 bg-gold/10 text-gold"
        : "border-subtle text-muted hover:text-fg"
    }`;

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {error && (
        <div role="alert" className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <div className="card p-5 sm:p-6">
            <h3 className="mb-4 font-display text-lg tracking-wide text-fg">Details</h3>
            <div className="space-y-4">
              <Field label="Title" htmlFor="title" required>
                <TextInput id="title" value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Round 1 — Official Trailer" required />
              </Field>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Category" htmlFor="category" required hint="Tab on the public page (e.g. Trailers)">
                  <TextInput id="category" value={form.category} onChange={(e) => set("category", e.target.value)} placeholder="Trailers" required />
                </Field>
                <Field label="Published date" htmlFor="date">
                  <TextInput id="date" type="date" value={form.publishedAt} onChange={(e) => set("publishedAt", e.target.value)} />
                </Field>
              </div>

              {/* Video: link or upload */}
              <Field label="Video">
                <div className="mb-2 flex gap-2">
                  <button type="button" className={tabBtn(mediaMode === "link")} onClick={() => setMediaMode("link")}>
                    <Link2 className="h-4 w-4" /> Link
                  </button>
                  <button type="button" className={tabBtn(mediaMode === "upload")} onClick={() => setMediaMode("upload")}>
                    <Upload className="h-4 w-4" /> Upload
                  </button>
                </div>
                {mediaMode === "link" ? (
                  <TextInput
                    type="url"
                    value={form.videoUrl.startsWith("/uploads/") ? "" : form.videoUrl}
                    onChange={(e) => set("videoUrl", e.target.value)}
                    placeholder="https://youtube.com/watch?v=… or Vimeo URL"
                  />
                ) : (
                  <MediaUploadField
                    kind="video"
                    value={form.videoUrl.startsWith("/uploads/") ? form.videoUrl : undefined}
                    onChange={(url) => set("videoUrl", url ?? "")}
                    aspect="aspect-video"
                  />
                )}
              </Field>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="card p-5 sm:p-6">
            <h3 className="mb-4 font-display text-lg tracking-wide text-fg">Thumbnail</h3>
            <MediaUploadField kind="image" value={form.thumbnailUrl} onChange={(url) => set("thumbnailUrl", url)} aspect="aspect-video" />
            <p className="mt-2 text-xs text-muted">Optional — YouTube auto-thumbnail is used if blank.</p>
          </div>
          <div className="card space-y-4 p-5 sm:p-6">
            <h3 className="font-display text-lg tracking-wide text-fg">Options</h3>
            <Toggle checked={form.isNew} onChange={(v) => set("isNew", v)} label="NEW badge" description="Highlight as new" />
            <Toggle checked={form.isActive} onChange={(v) => set("isActive", v)} label="Active" description="Visible on /media" />
            <Field label="Sort order" htmlFor="sort" hint="Lower shows first">
              <TextInput id="sort" type="number" min={0} value={String(form.sortOrder)} onChange={(e) => set("sortOrder", Number(e.target.value) || 0)} />
            </Field>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-subtle pt-5">
        <Link href="/admin/media" className="focus-gold rounded-xl border border-subtle px-4 py-2.5 text-sm font-medium text-muted transition-colors hover:text-fg">
          Cancel
        </Link>
        <button type="submit" disabled={pending} className="btn-gold focus-gold">
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {mode === "create" ? "Add media" : "Save changes"}
        </button>
      </div>
    </form>
  );
}
