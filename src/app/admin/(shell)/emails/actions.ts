"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function deleteEmail(id: string): Promise<{ ok: true } | { error: string }> {
  const session = await getServerSession(authOptions);
  if (!session?.user) return { error: "Unauthorized" };
  await prisma.emailCapture.delete({ where: { id } });
  revalidatePath("/admin/emails");
  return { ok: true };
}
