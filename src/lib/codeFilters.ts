import type { Prisma } from "@prisma/client";
import { CodeStatus } from "@/lib/enums";

export interface CodeFilters {
  product?: string;
  variant?: string;
  status?: CodeStatus;
  q?: string;
  page: number;
  perPage: number;
}

export const PER_PAGE_DEFAULT = 50;

type SearchParams = Record<string, string | string[] | undefined>;

function first(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export function parseCodeFilters(params: SearchParams): CodeFilters {
  const product = first(params.product)?.trim() || undefined;
  const variant = first(params.variant)?.trim() || undefined;
  const statusRaw = first(params.status)?.trim().toUpperCase();
  const status =
    statusRaw && statusRaw in CodeStatus
      ? (statusRaw as CodeStatus)
      : undefined;
  const q = first(params.q)?.trim() || undefined;

  const pageNum = Number.parseInt(first(params.page) ?? "1", 10);
  const perRaw = Number.parseInt(first(params.perPage) ?? "", 10);
  const perPage = [25, 50, 100, 200].includes(perRaw)
    ? perRaw
    : PER_PAGE_DEFAULT;

  return {
    product,
    variant,
    status,
    q,
    page: Number.isFinite(pageNum) && pageNum > 0 ? pageNum : 1,
    perPage,
  };
}

export function buildCodeWhere(
  filters: CodeFilters,
): Prisma.VerificationCodeWhereInput {
  const where: Prisma.VerificationCodeWhereInput = {};
  if (filters.product) where.productId = filters.product;
  if (filters.variant) where.variantId = filters.variant;
  if (filters.status) where.status = filters.status;
  if (filters.q) where.code = { contains: filters.q };
  return where;
}

/** Build a querystring for the current filters (optionally overriding fields). */
export function codeQuery(
  filters: Partial<CodeFilters>,
): string {
  const sp = new URLSearchParams();
  if (filters.product) sp.set("product", filters.product);
  if (filters.variant) sp.set("variant", filters.variant);
  if (filters.status) sp.set("status", filters.status);
  if (filters.q) sp.set("q", filters.q);
  if (filters.page && filters.page > 1) sp.set("page", String(filters.page));
  if (filters.perPage && filters.perPage !== PER_PAGE_DEFAULT)
    sp.set("perPage", String(filters.perPage));
  const s = sp.toString();
  return s ? `?${s}` : "";
}
