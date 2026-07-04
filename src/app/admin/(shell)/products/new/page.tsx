import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProductForm } from "@/components/admin/ProductForm";

export const metadata = { title: "New Product — Hollowtips Verify" };

export default function NewProductPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-3">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-gold"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to products
        </Link>
        <h2 className="font-condensed text-3xl tracking-wide text-fg">
          New Product
        </h2>
      </div>

      <div className="rule-gold" />

      <ProductForm mode="create" />
    </div>
  );
}
