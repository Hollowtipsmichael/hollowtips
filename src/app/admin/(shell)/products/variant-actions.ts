"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deleteUpload } from "@/lib/storage";
import { variantSchema, type VariantInput } from "@/lib/validators";

export type ActionResult = { error: string } | { ok: true };

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");
}

function revalidate(productId: string) {
  revalidatePath(`/admin/products/${productId}/edit`);
  revalidatePath("/admin/products");
  revalidatePath("/admin/codes");
}

export async function createVariant(
  productId: string,
  input: VariantInput,
): Promise<ActionResult> {
  await requireAdmin();
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true },
  });
  if (!product) return { error: "Product not found." };

  const parsed = variantSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  const d = parsed.data;
  await prisma.productVariant.create({
    data: {
      productId,
      name: d.name,
      strainName: d.strainName ?? null,
      productType: d.productType ?? null,
      artworkUrl: d.artworkUrl ?? null,
      productImageUrl: d.productImageUrl ?? null,
      isActive: d.isActive,
    },
  });
  revalidate(productId);
  return { ok: true };
}

export async function updateVariant(
  id: string,
  input: VariantInput,
): Promise<ActionResult> {
  await requireAdmin();
  const existing = await prisma.productVariant.findUnique({ where: { id } });
  if (!existing) return { error: "Variant not found." };

  const parsed = variantSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  const d = parsed.data;

  // Clean up replaced media
  if (existing.artworkUrl && existing.artworkUrl !== d.artworkUrl)
    await deleteUpload(existing.artworkUrl);
  if (existing.productImageUrl && existing.productImageUrl !== d.productImageUrl)
    await deleteUpload(existing.productImageUrl);

  await prisma.productVariant.update({
    where: { id },
    data: {
      name: d.name,
      strainName: d.strainName ?? null,
      productType: d.productType ?? null,
      artworkUrl: d.artworkUrl ?? null,
      productImageUrl: d.productImageUrl ?? null,
      isActive: d.isActive,
    },
  });
  revalidate(existing.productId);
  return { ok: true };
}

export async function deleteVariant(id: string): Promise<ActionResult> {
  await requireAdmin();
  const variant = await prisma.productVariant.findUnique({ where: { id } });
  if (!variant) return { error: "Variant not found." };

  await prisma.productVariant.delete({ where: { id } });
  await deleteUpload(variant.artworkUrl);
  await deleteUpload(variant.productImageUrl);
  revalidate(variant.productId);
  return { ok: true };
}
