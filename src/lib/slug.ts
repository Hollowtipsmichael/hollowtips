import type { PrismaClient } from "@prisma/client";

/** Convert a name into a URL-safe slug. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // strip combining accent marks
    .replace(/[^a-z0-9]+/g, "-") // non-alphanumerics → dashes
    .replace(/^-+|-+$/g, "") // trim leading/trailing dashes
    .replace(/-{2,}/g, "-"); // collapse repeats
}

/**
 * Produce a slug for `name` that is unique among Products. If a base slug is
 * taken, append `-2`, `-3`, … `excludeId` lets an edited product keep its slug.
 */
export async function uniqueSlug(
  name: string,
  prisma: PrismaClient,
  excludeId?: string,
): Promise<string> {
  const base = slugify(name) || "product";
  let candidate = base;
  let n = 1;

  // Loop until we find a slug not used by a different product.
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await prisma.product.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });
    if (!existing || existing.id === excludeId) return candidate;
    n += 1;
    candidate = `${base}-${n}`;
  }
}
