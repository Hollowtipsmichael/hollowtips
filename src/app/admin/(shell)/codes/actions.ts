"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateCodeString } from "@/lib/code";
import { CodeStatus } from "@/lib/enums";

export type ActionResult = { error: string } | { ok: true; created?: number };

const MAX_BATCH = 1000;

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");
}

export async function generateCodes(
  productId: string,
  quantity: number,
): Promise<ActionResult> {
  await requireAdmin();

  const qty = Math.floor(Number(quantity));
  if (!productId) return { error: "Choose a product." };
  if (!Number.isFinite(qty) || qty < 1) return { error: "Quantity must be at least 1." };
  if (qty > MAX_BATCH) return { error: `Max ${MAX_BATCH} codes per batch.` };

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true },
  });
  if (!product) return { error: "Product not found." };

  // SQLite's createMany doesn't support skipDuplicates, so we generate candidate
  // codes, filter out any that already exist, insert the rest, and top up across
  // a few rounds until we've created exactly `qty` (collisions are astronomically
  // rare in a 30^10 space, but this guarantees the count).
  let created = 0;
  let attempts = 0;
  while (created < qty && attempts < 10) {
    const need = qty - created;
    const candidates = new Set<string>();
    while (candidates.size < need) candidates.add(generateCodeString());
    const list = [...candidates];

    const existing = await prisma.verificationCode.findMany({
      where: { code: { in: list } },
      select: { code: true },
    });
    const taken = new Set(existing.map((e) => e.code));
    const fresh = list.filter((c) => !taken.has(c));

    if (fresh.length > 0) {
      const res = await prisma.verificationCode.createMany({
        data: fresh.map((code) => ({
          code,
          productId,
          status: CodeStatus.UNUSED,
        })),
      });
      created += res.count;
    }
    attempts += 1;
  }

  revalidatePath("/admin/codes");
  revalidatePath("/admin");
  return { ok: true, created };
}

export async function setCodeStatus(
  id: string,
  status: CodeStatus,
): Promise<ActionResult> {
  await requireAdmin();
  if (!(status in CodeStatus)) return { error: "Invalid status." };
  await prisma.verificationCode.update({ where: { id }, data: { status } });
  revalidatePath("/admin/codes");
  revalidatePath("/admin");
  return { ok: true };
}

export async function deleteCode(id: string): Promise<ActionResult> {
  await requireAdmin();
  await prisma.verificationCode.delete({ where: { id } });
  revalidatePath("/admin/codes");
  revalidatePath("/admin");
  return { ok: true };
}
