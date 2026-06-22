"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deleteUpload } from "@/lib/storage";
import { mediaSchema, type MediaInput } from "@/lib/validators";

export type ActionResult = { error: string } | undefined;

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");
}

function toData(d: ReturnType<typeof mediaSchema.parse>) {
  return {
    title: d.title,
    type: d.type,
    category: d.category,
    videoUrl: d.type === "video" ? (d.videoUrl ?? "") : "",
    fileUrl: d.type === "video" ? null : (d.fileUrl ?? null),
    thumbnailUrl: d.thumbnailUrl ?? null,
    publishedAt: d.publishedAt ? new Date(d.publishedAt) : null,
    isNew: d.isNew,
    isActive: d.isActive,
    sortOrder: d.sortOrder,
  };
}

function revalidate() {
  revalidatePath("/admin/media");
  revalidatePath("/media");
}

export async function createMedia(input: MediaInput): Promise<ActionResult> {
  await requireAdmin();
  const parsed = mediaSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  await prisma.mediaItem.create({ data: toData(parsed.data) });
  revalidate();
  redirect("/admin/media");
}

export async function updateMedia(
  id: string,
  input: MediaInput,
): Promise<ActionResult> {
  await requireAdmin();
  const existing = await prisma.mediaItem.findUnique({ where: { id } });
  if (!existing) return { error: "Media not found." };
  const parsed = mediaSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  const data = toData(parsed.data);
  // clean up replaced uploaded media
  if (existing.videoUrl !== data.videoUrl) await deleteUpload(existing.videoUrl);
  if (existing.fileUrl && existing.fileUrl !== data.fileUrl)
    await deleteUpload(existing.fileUrl);
  if (existing.thumbnailUrl && existing.thumbnailUrl !== data.thumbnailUrl)
    await deleteUpload(existing.thumbnailUrl);
  await prisma.mediaItem.update({ where: { id }, data });
  revalidate();
  redirect("/admin/media");
}

export async function deleteMedia(id: string): Promise<ActionResult> {
  await requireAdmin();
  const m = await prisma.mediaItem.findUnique({ where: { id } });
  if (!m) return { error: "Media not found." };
  await prisma.mediaItem.delete({ where: { id } });
  await deleteUpload(m.videoUrl);
  await deleteUpload(m.fileUrl);
  await deleteUpload(m.thumbnailUrl);
  revalidate();
  return undefined;
}
