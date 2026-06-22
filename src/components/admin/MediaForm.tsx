"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import {
  Loader2,
  AlertCircle,
  Save,
  Link2,
  Upload,
  Film,
  FileDown,
  ImageIcon,
} from "lucide-react";
import type { MediaInput } from "@/lib/validators";
import { categoryForType } from "@/lib/mediaCategories";
import { createMedia, updateMedia } from "@/app/admin/(shell)/media/actions";
import { Field, TextInput, Toggle } from "./ui/form";
import { MediaUploadField } from "./MediaUploadField";

type MediaType = "video" | "download" | "wallpaper";

export interface MediaFormInitial {
  id?: string;
  title: string;
  type: MediaType;
  category: string;
  videoUrl: string;
  fileUrl?: string;
  thumbnailUrl?: string;
  publishedAt: string; // yyyy-mm-dd
  isNew: boolean;
  isActive: boolean;
  sortOrder: number;
}

const EMPTY: MediaFormInitial = {
  title: "",
  type: "video",
  category: "Trailers",
  videoUrl: "",
  publishedAt: "",
  isNew: false,
  isActive: true,
  sortOrder: 0,
};

const TYPES: { value: MediaType; label: string; Icon: typeof Film }[] = [
  { value: "video", label: "Video", Icon: Film },
  { value: "download", label: "Download", Icon: FileDown },
  { value: "wallpaper", label: "Wallpaper / Art", Icon: ImageIcon },
];

export function MediaForm({
  mode,
  initial = EMPTY,
  categories = [],
}: {
  mode: "create" | "edit";
  initial?: MediaFormInitial;
  categories?: string[];
}) {
  const [form, setForm] = useState<MediaFormInitial>(initial);
  const [mediaMode, setMediaMode] = useState<"link" | "upload">(
    initial.videoUrl.startsWith("/uploads/") ? "upload" : "link",
  );
  // Category as a dropdown of existing tabs (+ explicit "new" escape hatch).
  const [catMode, setCatMode] = useState<"existing" | "new">(
    categories.length ? "existing" : "new",
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (
      catMode === "existing" &&
      categories.length &&
      !categories.includes(form.category)
    ) {
      setForm((f) => ({ ...f, category: categories[0] }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function set<K extends keyof MediaFormInitial>(k: K, v: MediaFormInitial[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  const isVideo = form.type === "video";

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const input: MediaInput = {
      title: form.title,
      type: form.type,
      category: categoryForType(form.type, form.category),
      videoUrl: isVideo ? form.videoUrl : "",
      fileUrl: isVideo ? undefined : form.fileUrl || undefined,
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
              {/* Type */}
              <Field label="Type">
                <div className="flex gap-2">
                  {TYPES.map(({ value, label, Icon }) => (
                    <button
                      key={value}
                      type="button"
                      className={tabBtn(form.type === value)}
                      onClick={() => set("type", value)}
                    >
                      <Icon className="h-4 w-4" /> {label}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="Title" htmlFor="title" required>
                <TextInput id="title" value={form.title} onChange={(e) => set("title", e.target.value)} placeholder={isVideo ? "Round 1 — Official Trailer" : "California Dreamin' Wallpaper"} required />
              </Field>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {isVideo ? (
                  <Field label="Category" htmlFor="category" required hint="Tab on the public page">
                    {catMode === "existing" ? (
                      <select
                        id="category"
                        value={form.category}
                        onChange={(e) => {
                          if (e.target.value === "__new__") {
                            setCatMode("new");
                            set("category", "");
                          } else {
                            set("category", e.target.value);
                          }
                        }}
                        className="focus-gold w-full rounded-xl border border-subtle bg-bg/60 px-3 py-2.5 text-fg transition-colors"
                      >
                        {categories.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                        <option value="__new__">+ New category…</option>
                      </select>
                    ) : (
                      <div className="flex gap-2">
                        <TextInput
                          id="category"
                          autoFocus
                          value={form.category}
                          onChange={(e) => set("category", e.target.value)}
                          placeholder="New category name"
                          required
                        />
                        {categories.length > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              setCatMode("existing");
                              set("category", categories[0]);
                            }}
                            className="focus-gold shrink-0 rounded-xl border border-subtle px-3 text-sm text-muted transition-colors hover:text-fg"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    )}
                  </Field>
                ) : (
                  <Field label="Section">
                    <div className="rounded-xl border border-subtle bg-bg/40 px-3 py-2.5 text-sm text-muted">
                      {categoryForType(form.type, form.category)}{" "}
                      <span className="text-muted/60">(automatic)</span>
                    </div>
                  </Field>
                )}
                <Field label="Published date" htmlFor="date">
                  <TextInput id="date" type="date" value={form.publishedAt} onChange={(e) => set("publishedAt", e.target.value)} />
                </Field>
              </div>

              {/* Asset: video / file / image */}
              {isVideo ? (
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
              ) : form.type === "wallpaper" ? (
                <Field label="Image" hint="The wallpaper/artwork — shown and downloadable.">
                  <MediaUploadField
                    kind="image"
                    value={form.fileUrl}
                    onChange={(url) => set("fileUrl", url)}
                    aspect="aspect-video"
                  />
                </Field>
              ) : (
                <Field label="File" hint="Any file — ZIP, PDF, hi-res art, etc.">
                  <MediaUploadField
                    kind="file"
                    value={form.fileUrl}
                    onChange={(url) => set("fileUrl", url)}
                    aspect="aspect-video"
                  />
                </Field>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="card p-5 sm:p-6">
            <h3 className="mb-4 font-display text-lg tracking-wide text-fg">Thumbnail</h3>
            <MediaUploadField kind="image" value={form.thumbnailUrl} onChange={(url) => set("thumbnailUrl", url)} aspect="aspect-video" />
            <p className="mt-2 text-xs text-muted">
              {isVideo
                ? "Optional — YouTube auto-thumbnail is used if blank."
                : form.type === "wallpaper"
                  ? "Optional — the image itself is used if blank."
                  : "Optional preview image for the download card."}
            </p>
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
