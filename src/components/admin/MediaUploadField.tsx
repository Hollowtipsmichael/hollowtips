"use client";

import { useRef, useState } from "react";
import { Loader2, UploadCloud, X, ImageIcon, Film } from "lucide-react";

interface MediaUploadFieldProps {
  kind: "image" | "video";
  value?: string;
  onChange: (url: string | undefined) => void;
  /** aspect ratio class for the preview box */
  aspect?: string;
}

export function MediaUploadField({
  kind,
  value,
  onChange,
  aspect = "aspect-square",
}: MediaUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const accept = kind === "image" ? "image/*" : "video/*";
  const Icon = kind === "image" ? ImageIcon : Film;

  async function upload(file: File) {
    setError(null);
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("kind", kind);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed.");
      onChange(json.url as string);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  function onFiles(files: FileList | null) {
    const file = files?.[0];
    if (file) void upload(file);
  }

  if (value) {
    return (
      <div className={`group relative ${aspect} overflow-hidden rounded-xl border border-subtle bg-bg/40`}>
        {kind === "image" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="h-full w-full object-cover" />
        ) : (
          <video
            src={value}
            className="h-full w-full object-cover"
            muted
            playsInline
            controls
          />
        )}
        <button
          type="button"
          aria-label="Remove"
          onClick={() => onChange(undefined)}
          className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-lg bg-black/70 text-white opacity-0 backdrop-blur transition-opacity hover:bg-black/90 group-hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          onFiles(e.dataTransfer.files);
        }}
        className={`focus-gold flex ${aspect} w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed text-center transition-colors ${
          dragging
            ? "border-gold/60 bg-gold/5"
            : "border-subtle bg-bg/40 hover:border-gold/40"
        }`}
      >
        {uploading ? (
          <Loader2 className="h-6 w-6 animate-spin text-gold" />
        ) : (
          <span className="grid h-11 w-11 place-items-center rounded-xl border border-gold/20 bg-gold/5 text-gold">
            <UploadCloud className="h-5 w-5" />
          </span>
        )}
        <span className="text-xs text-muted">
          {uploading ? "Uploading…" : "Drop or click to upload"}
        </span>
        <span className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-muted/70">
          <Icon className="h-3 w-3" />
          {kind === "image" ? "PNG · JPG · WEBP · GIF" : "MP4 · WEBM"}
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => onFiles(e.target.files)}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
