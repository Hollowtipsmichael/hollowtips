import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseCsv } from "@/lib/csv";
import { CodeStatus } from "@/lib/enums";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HEADER_CODE = ["code", "codes", "qr", "serial"];
const HEADER_PRODUCT = ["product", "flavor", "flavour", "strain"];
const HEADER_VARIANT = ["variant", "sku"];

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Expected a file upload." }, { status: 400 });
  }
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No CSV file provided." }, { status: 400 });
  }

  const text = await file.text();
  const rows = parseCsv(text);
  if (rows.length === 0) {
    return NextResponse.json({ error: "CSV is empty." }, { status: 400 });
  }

  // Detect header row + column positions (tolerant; defaults to col0=code, col1=product).
  let codeCol = 0;
  let productCol = 1;
  let variantCol = -1;
  const firstLower = rows[0].map((c) => c.trim().toLowerCase());
  const looksLikeHeader = firstLower.some(
    (h) => HEADER_CODE.includes(h) || HEADER_PRODUCT.includes(h),
  );
  let dataRows = rows;
  if (looksLikeHeader) {
    codeCol = firstLower.findIndex((h) => HEADER_CODE.includes(h));
    productCol = firstLower.findIndex((h) => HEADER_PRODUCT.includes(h));
    variantCol = firstLower.findIndex((h) => HEADER_VARIANT.includes(h));
    if (codeCol < 0) codeCol = 0;
    if (productCol < 0) productCol = 1;
    dataRows = rows.slice(1);
  }

  // Product/variant lookup maps
  const products = await prisma.product.findMany({
    select: { id: true, name: true, slug: true, variants: { select: { id: true, name: true } } },
  });
  const byName = new Map(products.map((p) => [p.name.trim().toLowerCase(), p]));
  const bySlug = new Map(products.map((p) => [p.slug.toLowerCase(), p]));

  const toInsert: { code: string; productId: string; variantId: string | null }[] = [];
  const seen = new Set<string>();
  const unmatched: string[] = [];
  let blank = 0;

  for (const r of dataRows) {
    const code = (r[codeCol] ?? "").trim().toUpperCase();
    if (!code) {
      blank++;
      continue;
    }
    if (seen.has(code)) continue;
    seen.add(code);

    const prodKey = (r[productCol] ?? "").trim().toLowerCase();
    const product = byName.get(prodKey) || bySlug.get(prodKey);
    if (!product) {
      unmatched.push(`${code} (product: "${r[productCol] ?? ""}")`);
      continue;
    }
    let variantId: string | null = null;
    if (variantCol >= 0 && r[variantCol]?.trim()) {
      const vname = r[variantCol].trim().toLowerCase();
      variantId = product.variants.find((v) => v.name.toLowerCase() === vname)?.id ?? null;
    }
    toInsert.push({ code, productId: product.id, variantId });
  }

  // Filter codes that already exist in DB
  let imported = 0;
  if (toInsert.length > 0) {
    const existing = await prisma.verificationCode.findMany({
      where: { code: { in: toInsert.map((t) => t.code) } },
      select: { code: true },
    });
    const taken = new Set(existing.map((e) => e.code));
    const fresh = toInsert.filter((t) => !taken.has(t.code));
    if (fresh.length > 0) {
      const res = await prisma.verificationCode.createMany({
        data: fresh.map((t) => ({ ...t, status: CodeStatus.UNUSED })),
      });
      imported = res.count;
    }
  }

  const skipped = dataRows.length - imported - unmatched.length;
  return NextResponse.json({
    imported,
    skipped: Math.max(0, skipped),
    unmatched: unmatched.slice(0, 25),
    unmatchedCount: unmatched.length,
    blank,
  });
}
