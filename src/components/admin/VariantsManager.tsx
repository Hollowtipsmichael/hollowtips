"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Loader2, X, AlertCircle, Layers } from "lucide-react";
import {
  createVariant,
  updateVariant,
  deleteVariant,
} from "@/app/admin/(shell)/products/variant-actions";
import { Field, TextInput, Toggle } from "./ui/form";
import { MediaUploadField } from "./MediaUploadField";
import { ConfirmDialog } from "./ConfirmDialog";
import { StatusPill } from "./StatusPill";

export interface VariantRow {
  id: string;
  name: string;
  strainName: string | null;
  productType: string | null;
  artworkUrl: string | null;
  productImageUrl: string | null;
  isActive: boolean;
}

interface FormState {
  name: string;
  strainName: string;
  productType: string;
  artworkUrl?: string;
  productImageUrl?: string;
  isActive: boolean;
}

const EMPTY: FormState = {
  name: "",
  strainName: "",
  productType: "",
  isActive: true,
};

const selectCls =
  "focus-gold w-full rounded-xl border border-subtle bg-bg/60 px-3 py-2.5 text-fg";

export function VariantsManager({
  productId,
  variants,
}: {
  productId: string;
  variants: VariantRow[];
}) {
  const router = useRouter();
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [toDelete, setToDelete] = useState<VariantRow | null>(null);

  function openNew() {
    setForm(EMPTY);
    setError(null);
    setEditing("new");
  }
  function openEdit(v: VariantRow) {
    setForm({
      name: v.name,
      strainName: v.strainName ?? "",
      productType: v.productType ?? "",
      artworkUrl: v.artworkUrl ?? undefined,
      productImageUrl: v.productImageUrl ?? undefined,
      isActive: v.isActive,
    });
    setError(null);
    setEditing(v.id);
  }

  function save() {
    setError(null);
    const input = {
      name: form.name,
      strainName: form.strainName || undefined,
      productType: (form.productType || undefined) as
        | "INDICA"
        | "SATIVA"
        | "HYBRID"
        | undefined,
      artworkUrl: form.artworkUrl || undefined,
      productImageUrl: form.productImageUrl || undefined,
      isActive: form.isActive,
    };
    startTransition(async () => {
      const res =
        editing === "new"
          ? await createVariant(productId, input)
          : await updateVariant(editing as string, input);
      if ("error" in res) {
        setError(res.error);
        return;
      }
      setEditing(null);
      router.refresh();
    });
  }

  function confirmDelete() {
    if (!toDelete) return;
    startTransition(async () => {
      await deleteVariant(toDelete.id);
      setToDelete(null);
      router.refresh();
    });
  }

  return (
    <div className="card p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-display text-lg tracking-wide text-fg">
          <Layers className="h-4 w-4 text-gold" />
          Variants
        </h3>
        {editing === null && (
          <button type="button" onClick={openNew} className="btn-gold focus-gold text-sm">
            <Plus className="h-4 w-4" />
            Add variant
          </button>
        )}
      </div>
      <p className="mb-4 text-xs text-muted">
        SKUs that get their own QR codes — e.g. “2G Disposable · Round 1 V1”.
      </p>

      {/* List */}
      {variants.length === 0 && editing === null ? (
        <p className="rounded-xl border border-dashed border-subtle py-6 text-center text-sm text-muted">
          No variants yet. Codes can be generated at product level until you add some.
        </p>
      ) : (
        <ul className="space-y-2">
          {variants.map((v) => (
            <li
              key={v.id}
              className="flex items-center gap-3 rounded-xl border border-subtle bg-bg/40 p-2.5"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-lg border border-subtle bg-black">
                {v.artworkUrl || v.productImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={(v.artworkUrl || v.productImageUrl) as string}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Layers className="h-4 w-4 text-gold/40" />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-fg">{v.name}</p>
                <p className="truncate text-xs text-muted">
                  {[v.productType, v.strainName].filter(Boolean).join(" · ") || "—"}
                </p>
              </div>
              <StatusPill active={v.isActive} />
              <button
                type="button"
                onClick={() => openEdit(v)}
                aria-label="Edit variant"
                className="focus-gold grid h-8 w-8 place-items-center rounded-lg border border-subtle text-muted hover:border-gold/40 hover:text-gold"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setToDelete(v)}
                aria-label="Delete variant"
                className="focus-gold grid h-8 w-8 place-items-center rounded-lg border border-subtle text-muted hover:border-red-500/40 hover:text-red-400"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Add/Edit form */}
      {editing !== null && (
        <div className="mt-4 space-y-4 rounded-xl border border-gold/20 bg-bg/40 p-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-fg">
              {editing === "new" ? "New variant" : "Edit variant"}
            </h4>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="focus-gold grid h-7 w-7 place-items-center rounded-lg text-muted hover:text-fg"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Variant name" required>
              <TextInput
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="2G Disposable · Round 1 V1"
              />
            </Field>
            <Field label="Type">
              <select
                value={form.productType}
                onChange={(e) => setForm({ ...form, productType: e.target.value })}
                className={selectCls}
              >
                <option value="">Inherit / none</option>
                <option value="INDICA">Indica</option>
                <option value="SATIVA">Sativa</option>
                <option value="HYBRID">Hybrid</option>
              </select>
            </Field>
          </div>

          <Field label="Strain / lineage">
            <TextInput
              value={form.strainName}
              onChange={(e) => setForm({ ...form, strainName: e.target.value })}
            />
          </Field>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Artwork">
              <MediaUploadField
                kind="image"
                value={form.artworkUrl}
                onChange={(url) => setForm({ ...form, artworkUrl: url })}
                aspect="aspect-video"
              />
            </Field>
            <Field label="Product image">
              <MediaUploadField
                kind="image"
                value={form.productImageUrl}
                onChange={(url) => setForm({ ...form, productImageUrl: url })}
                aspect="aspect-video"
              />
            </Field>
          </div>

          <Toggle
            checked={form.isActive}
            onChange={(v) => setForm({ ...form, isActive: v })}
            label="Active"
            description="Selectable when generating codes"
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="focus-gold rounded-xl border border-subtle px-4 py-2 text-sm text-muted hover:text-fg"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={save}
              disabled={pending || !form.name}
              className="btn-gold focus-gold text-sm"
            >
              {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {editing === "new" ? "Add variant" : "Save"}
            </button>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!toDelete}
        title="Delete variant"
        message={`Delete "${toDelete?.name}"? Its verification codes will also be removed. This cannot be undone.`}
        confirmLabel="Delete"
        loading={pending}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
