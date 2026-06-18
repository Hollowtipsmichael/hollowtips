import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { parseSocialLinks } from "@/lib/social";
import { ProductForm } from "@/components/admin/ProductForm";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";
import { VariantsManager } from "@/components/admin/VariantsManager";

export const metadata = { title: "Edit Product — Hollowtips Verify" };
export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { variants: { orderBy: { createdAt: "asc" } } },
  });
  if (!product) notFound();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-3">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to products
          </Link>
          <h2 className="font-display text-3xl tracking-wide text-fg">
            {product.name}
          </h2>
        </div>
        <DeleteProductButton id={product.id} name={product.name} variant="button" />
      </div>

      <div className="rule-gold" />

      <ProductForm
        mode="edit"
        initial={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          sku: product.sku ?? "",
          size: product.size ?? "2G",
          strainName: product.strainName ?? "",
          productType: product.productType ?? "",
          description: product.description ?? "",
          ingredients: product.ingredients ?? "",
          warningText: product.warningText ?? "",
          productImageUrl: product.productImageUrl ?? undefined,
          artworkUrl: product.artworkUrl ?? undefined,
          videoUrl: product.videoUrl ?? undefined,
          social: parseSocialLinks(product.socialLinks),
          isActive: product.isActive,
        }}
      />

      <VariantsManager
        productId={product.id}
        variants={product.variants.map((v) => ({
          id: v.id,
          name: v.name,
          strainName: v.strainName,
          productType: v.productType,
          artworkUrl: v.artworkUrl,
          productImageUrl: v.productImageUrl,
          isActive: v.isActive,
        }))}
      />
    </div>
  );
}
