"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Loader2, AlertCircle, Save } from "lucide-react";
import { slugify } from "@/lib/slug";
import { SOCIAL_PLATFORMS, type SocialLinks } from "@/lib/social";
import type { ProductInput } from "@/lib/validators";
import { createProduct, updateProduct } from "@/app/admin/(shell)/products/actions";
import { Field, TextInput, TextArea, Toggle } from "./ui/form";
import { MediaUploadField } from "./MediaUploadField";

export interface ProductFormInitial {
  id?: string;
  name: string;
  slug: string;
  sku: string;
  size: string;
  strainName: string;
  productType: string;
  description: string;
  ingredients: string;
  warningText: string;
  productImageUrl?: string;
  artworkUrl?: string;
  videoUrl?: string;
  social: SocialLinks;
  isActive: boolean;
}

const EMPTY: ProductFormInitial = {
  name: "",
  slug: "",
  sku: "",
  size: "2G",
  strainName: "",
  productType: "",
  description: "",
  ingredients: "",
  warningText: "",
  social: {},
  isActive: true,
};

export function ProductForm({
  mode,
  initial = EMPTY,
}: {
  mode: "create" | "edit";
  initial?: ProductFormInitial;
}) {
  const [form, setForm] = useState<ProductFormInitial>(initial);
  const [slugEdited, setSlugEdited] = useState(mode === "edit");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function set<K extends keyof ProductFormInitial>(
    key: K,
    value: ProductFormInitial[K],
  ) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function onNameChange(name: string) {
    setForm((f) => ({
      ...f,
      name,
      slug: slugEdited ? f.slug : slugify(name),
    }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const input: ProductInput = {
      name: form.name,
      slug: form.slug || undefined,
      sku: form.sku || undefined,
      size: form.size || undefined,
      strainName: form.strainName || undefined,
      productType: (form.productType || undefined) as
        | "INDICA"
        | "SATIVA"
        | "HYBRID"
        | undefined,
      description: form.description || undefined,
      ingredients: form.ingredients || undefined,
      warningText: form.warningText || undefined,
      productImageUrl: form.productImageUrl || undefined,
      artworkUrl: form.artworkUrl || undefined,
      videoUrl: form.videoUrl || undefined,
      socialLinks: form.social,
      isActive: form.isActive,
    };

    startTransition(async () => {
      const res =
        mode === "create"
          ? await createProduct(input)
          : await updateProduct(initial.id!, input);
      // On success the action redirects; only errors return here.
      if (res?.error) setError(res.error);
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {error && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main details */}
        <div className="space-y-5 lg:col-span-2">
          <div className="card p-5 sm:p-6">
            <h3 className="mb-4 font-condensed text-lg tracking-wide text-fg">
              Details
            </h3>
            <div className="space-y-4">
              <Field label="Name" htmlFor="name" required>
                <TextInput
                  id="name"
                  value={form.name}
                  onChange={(e) => onNameChange(e.target.value)}
                  placeholder="Sorbet Shooter"
                  required
                />
              </Field>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Slug" htmlFor="slug" hint="Used in the public URL">
                  <TextInput
                    id="slug"
                    value={form.slug}
                    onChange={(e) => {
                      setSlugEdited(true);
                      set("slug", slugify(e.target.value));
                    }}
                    placeholder="sorbet-shooter"
                  />
                </Field>
                <Field label="Type" htmlFor="ptype">
                  <select
                    id="ptype"
                    value={form.productType}
                    onChange={(e) => set("productType", e.target.value)}
                    className="focus-gold w-full rounded-xl border border-subtle bg-bg/60 px-3 py-2.5 text-fg"
                  >
                    <option value="">None</option>
                    <option value="INDICA">Indica</option>
                    <option value="SATIVA">Sativa</option>
                    <option value="HYBRID">Hybrid</option>
                  </select>
                </Field>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="SKU" htmlFor="sku" hint="e.g. A1–A10">
                  <TextInput
                    id="sku"
                    value={form.sku}
                    onChange={(e) => set("sku", e.target.value.toUpperCase())}
                    placeholder="A1"
                  />
                </Field>
                <Field label="Size" htmlFor="size">
                  <TextInput
                    id="size"
                    value={form.size}
                    onChange={(e) => set("size", e.target.value)}
                    placeholder="2G"
                  />
                </Field>
              </div>

              <Field label="Strain / lineage" htmlFor="strain">
                <TextInput
                  id="strain"
                  value={form.strainName}
                  onChange={(e) => set("strainName", e.target.value)}
                  placeholder="e.g. GMO × Sherb"
                />
              </Field>

              <Field label="Description" htmlFor="description">
                <TextArea
                  id="description"
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="Short product description shown on the verify page."
                />
              </Field>

              <Field label="Ingredients" htmlFor="ingredients">
                <TextArea
                  id="ingredients"
                  rows={3}
                  value={form.ingredients}
                  onChange={(e) => set("ingredients", e.target.value)}
                />
              </Field>

              <Field label="Warning text" htmlFor="warning">
                <TextArea
                  id="warning"
                  rows={3}
                  value={form.warningText}
                  onChange={(e) => set("warningText", e.target.value)}
                  placeholder="Compliance / health warning."
                />
              </Field>
            </div>
          </div>

          {/* Social links */}
          <div className="card p-5 sm:p-6">
            <h3 className="mb-4 font-condensed text-lg tracking-wide text-fg">
              Social links
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {SOCIAL_PLATFORMS.map((p) => (
                <Field key={p.key} label={p.label} htmlFor={p.key}>
                  <TextInput
                    id={p.key}
                    type="url"
                    value={form.social[p.key] ?? ""}
                    onChange={(e) =>
                      set("social", { ...form.social, [p.key]: e.target.value })
                    }
                    placeholder={p.placeholder}
                  />
                </Field>
              ))}
            </div>
          </div>
        </div>

        {/* Side column: media + status */}
        <div className="space-y-5">
          <div className="card p-5 sm:p-6">
            <h3 className="mb-4 font-condensed text-lg tracking-wide text-fg">
              Media
            </h3>
            <div className="space-y-4">
              <Field label="Product image">
                <MediaUploadField
                  kind="image"
                  value={form.productImageUrl}
                  onChange={(url) => set("productImageUrl", url)}
                />
              </Field>
              <Field label="Artwork">
                <MediaUploadField
                  kind="image"
                  value={form.artworkUrl}
                  onChange={(url) => set("artworkUrl", url)}
                  aspect="aspect-video"
                />
              </Field>
              <Field label="Video">
                <MediaUploadField
                  kind="video"
                  value={form.videoUrl}
                  onChange={(url) => set("videoUrl", url)}
                  aspect="aspect-video"
                />
              </Field>
            </div>
          </div>

          <div className="card p-5 sm:p-6">
            <h3 className="mb-4 font-condensed text-lg tracking-wide text-fg">
              Status
            </h3>
            <Toggle
              checked={form.isActive}
              onChange={(v) => set("isActive", v)}
              label="Active"
              description="Visible / verifiable when live"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 border-t border-subtle pt-5">
        <Link
          href="/admin/products"
          className="focus-gold rounded-xl border border-subtle px-4 py-2.5 text-sm font-medium text-muted transition-colors hover:text-fg"
        >
          Cancel
        </Link>
        <button type="submit" disabled={pending} className="btn-gold focus-gold">
          {pending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving…
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              {mode === "create" ? "Create product" : "Save changes"}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
