"use client";

import { useEffect, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Loader2, Plus, X, Sparkles, AlertCircle } from "lucide-react";
import { generateCodes } from "@/app/admin/(shell)/codes/actions";
import { Field, TextInput } from "@/components/admin/ui/form";

interface VariantOption {
  id: string;
  name: string;
}
interface ProductOption {
  id: string;
  name: string;
  variants: VariantOption[];
}

export function GenerateCodesDialog({
  products,
  defaultProductId,
}: {
  products: ProductOption[];
  defaultProductId?: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [productId, setProductId] = useState(defaultProductId ?? "");
  const [variantId, setVariantId] = useState("");
  // Stored as a string so the field can be cleared/edited freely (no stuck
  // leading zero). Digits only; leading zeros stripped. Parsed on submit.
  const [quantity, setQuantity] = useState("50");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const qty = parseInt(quantity || "0", 10) || 0;
  const selectedProduct = products.find((p) => p.id === productId);
  const variants = selectedProduct?.variants ?? [];
  const variantRequired = variants.length > 0;

  function onProductChange(id: string) {
    setProductId(id);
    setVariantId(""); // reset variant when product changes
  }

  function onQuantityChange(value: string) {
    const cleaned = value.replace(/[^0-9]/g, "").replace(/^0+(?=\d)/, "");
    setQuantity(cleaned);
  }

  function submit() {
    setError(null);
    startTransition(async () => {
      const res = await generateCodes(productId, variantId || null, qty);
      if ("error" in res) {
        setError(res.error);
        return;
      }
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="btn-gold focus-gold"
        disabled={products.length === 0}
        title={products.length === 0 ? "Create a product first" : undefined}
      >
        <Plus className="h-4 w-4" />
        Generate codes
      </button>

      {open && mounted && createPortal(
        <div className="fixed inset-0 z-[60] grid place-items-center p-4">
          <div
            onClick={() => !pending && setOpen(false)}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Generate codes"
            className="relative z-10 w-full max-w-md rounded-2xl border border-subtle bg-panel p-6 shadow-panel"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-gold-gradient text-black shadow-gold-glow">
                  <Sparkles className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-display text-lg tracking-wide text-fg">
                    Generate codes
                  </h3>
                  <p className="text-xs text-muted">
                    Unique verification codes for a product.
                  </p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={() => !pending && setOpen(false)}
                className="focus-gold grid h-8 w-8 place-items-center rounded-lg text-muted hover:text-fg"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {error && (
              <div
                role="alert"
                className="mb-4 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-300"
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-4">
              <Field label="Product" htmlFor="gen-product" required>
                <select
                  id="gen-product"
                  value={productId}
                  onChange={(e) => onProductChange(e.target.value)}
                  className="focus-gold w-full rounded-xl border border-subtle bg-bg/60 px-3 py-2.5 text-fg"
                >
                  <option value="">Select a product…</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </Field>

              {variantRequired && (
                <Field label="Variant" htmlFor="gen-variant" required>
                  <select
                    id="gen-variant"
                    value={variantId}
                    onChange={(e) => setVariantId(e.target.value)}
                    className="focus-gold w-full rounded-xl border border-subtle bg-bg/60 px-3 py-2.5 text-fg"
                  >
                    <option value="">Select a variant…</option>
                    {variants.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                </Field>
              )}

              <Field
                label="Quantity"
                htmlFor="gen-qty"
                required
                hint="1–1000 codes per batch"
              >
                <TextInput
                  id="gen-qty"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={quantity}
                  onChange={(e) => onQuantityChange(e.target.value)}
                  placeholder="50"
                />
              </Field>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={pending}
                className="focus-gold rounded-xl border border-subtle px-4 py-2.5 text-sm font-medium text-muted transition-colors hover:text-fg disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submit}
                disabled={
                  pending ||
                  !productId ||
                  qty < 1 ||
                  (variantRequired && !variantId)
                }
                className="btn-gold focus-gold"
              >
                {pending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating…
                  </>
                ) : (
                  `Generate ${qty > 0 ? qty : ""}`.trim()
                )}
              </button>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
