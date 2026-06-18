"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uniqueSlug } from "@/lib/slug";
import { serializeSocialLinks } from "@/lib/social";
import { deleteUpload } from "@/lib/storage";
import { productSchema, type ProductInput } from "@/lib/validators";

export type ActionResult = { error: string } | undefined;

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");
}

export async function createProduct(input: ProductInput): Promise<ActionResult> {
  await requireAdmin();

  const parsed = productSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  const data = parsed.data;
  const slug = await uniqueSlug(data.slug || data.name, prisma);

  await prisma.product.create({
    data: {
      name: data.name,
      slug,
      sku: data.sku ?? null,
      size: data.size ?? null,
      strainName: data.strainName ?? null,
      productType: data.productType ?? null,
      description: data.description ?? null,
      ingredients: data.ingredients ?? null,
      warningText: data.warningText ?? null,
      productImageUrl: data.productImageUrl ?? null,
      artworkUrl: data.artworkUrl ?? null,
      videoUrl: data.videoUrl ?? null,
      socialLinks: serializeSocialLinks(data.socialLinks ?? {}),
      isActive: data.isActive,
    },
  });

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function updateProduct(
  id: string,
  input: ProductInput,
): Promise<ActionResult> {
  await requireAdmin();

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) return { error: "Product not found." };

  const parsed = productSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  const data = parsed.data;
  const slug = await uniqueSlug(data.slug || data.name, prisma, id);

  // Clean up any media files that were replaced/removed.
  const removed = [
    [existing.productImageUrl, data.productImageUrl],
    [existing.artworkUrl, data.artworkUrl],
    [existing.videoUrl, data.videoUrl],
  ];
  for (const [oldUrl, newUrl] of removed) {
    if (oldUrl && oldUrl !== newUrl) await deleteUpload(oldUrl);
  }

  await prisma.product.update({
    where: { id },
    data: {
      name: data.name,
      slug,
      sku: data.sku ?? null,
      size: data.size ?? null,
      strainName: data.strainName ?? null,
      productType: data.productType ?? null,
      description: data.description ?? null,
      ingredients: data.ingredients ?? null,
      warningText: data.warningText ?? null,
      productImageUrl: data.productImageUrl ?? null,
      artworkUrl: data.artworkUrl ?? null,
      videoUrl: data.videoUrl ?? null,
      socialLinks: serializeSocialLinks(data.socialLinks ?? {}),
      isActive: data.isActive,
    },
  });

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}/edit`);
  redirect("/admin/products");
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  await requireAdmin();

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return { error: "Product not found." };

  // Codes/scans cascade via FK onDelete. Best-effort cleanup of media files.
  await prisma.product.delete({ where: { id } });
  await deleteUpload(product.productImageUrl);
  await deleteUpload(product.artworkUrl);
  await deleteUpload(product.videoUrl);

  revalidatePath("/admin/products");
  return;
}

export async function toggleProductActive(
  id: string,
  isActive: boolean,
): Promise<ActionResult> {
  await requireAdmin();
  await prisma.product.update({ where: { id }, data: { isActive } });
  revalidatePath("/admin/products");
  return;
}
