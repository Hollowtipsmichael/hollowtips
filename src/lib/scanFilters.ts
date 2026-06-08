import type { Prisma } from "@prisma/client";
import { DeviceType } from "@/lib/enums";

export interface ScanFilters {
  product?: string;
  device?: DeviceType;
  page: number;
  perPage: number;
}

export const PER_PAGE_DEFAULT = 50;

type SearchParams = Record<string, string | string[] | undefined>;

function first(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export function parseScanFilters(params: SearchParams): ScanFilters {
  const product = first(params.product)?.trim() || undefined;
  const deviceRaw = first(params.device)?.trim().toUpperCase();
  const device =
    deviceRaw && deviceRaw in DeviceType
      ? (deviceRaw as DeviceType)
      : undefined;
  const pageNum = Number.parseInt(first(params.page) ?? "1", 10);
  return {
    product,
    device,
    page: Number.isFinite(pageNum) && pageNum > 0 ? pageNum : 1,
    perPage: PER_PAGE_DEFAULT,
  };
}

export function buildScanWhere(f: ScanFilters): Prisma.ScanEventWhereInput {
  const where: Prisma.ScanEventWhereInput = {};
  if (f.product) where.productId = f.product;
  if (f.device) where.deviceType = f.device;
  return where;
}

export function scanQuery(f: Partial<ScanFilters>): string {
  const sp = new URLSearchParams();
  if (f.product) sp.set("product", f.product);
  if (f.device) sp.set("device", f.device);
  if (f.page && f.page > 1) sp.set("page", String(f.page));
  const s = sp.toString();
  return s ? `?${s}` : "";
}
