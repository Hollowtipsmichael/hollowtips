import Link from "next/link";
import Image from "next/image";
import QRCode from "qrcode";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { verifyUrl } from "@/lib/code";
import {
  parseCodeFilters,
  buildCodeWhere,
  codeQuery,
} from "@/lib/codeFilters";
import { PrintButton } from "@/components/admin/codes/PrintButton";

export const metadata = { title: "Print Labels — Hollowtips Verify" };
export const dynamic = "force-dynamic";

const MAX = 500;

export default async function PrintCodesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const filters = parseCodeFilters(params);
  const where = buildCodeWhere(filters);
  const base = process.env.NEXTAUTH_URL || "";

  const codes = await prisma.verificationCode.findMany({
    where,
    include: {
      product: { select: { name: true, productType: true } },
      variant: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
    take: MAX,
  });

  const labels = await Promise.all(
    codes.map(async (c) => ({
      code: c.code,
      product: c.product.name,
      strain: c.variant?.name ?? c.product.productType ?? null,
      qr: await QRCode.toDataURL(verifyUrl(c.code, base), {
        errorCorrectionLevel: "H",
        width: 240,
        margin: 1,
        color: { dark: "#0A0A0A", light: "#FFFFFF" },
      }),
    })),
  );

  const backQs = codeQuery({
    product: filters.product,
    status: filters.status,
    q: filters.q,
  });

  return (
    <div className="print:bg-white">
      {/* Toolbar (screen only) */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link
          href={`/admin/codes${backQs}`}
          className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-gold"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to codes
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted">
            {labels.length} label{labels.length === 1 ? "" : "s"}
            {codes.length === MAX ? " (max)" : ""}
          </span>
          <PrintButton />
        </div>
      </div>

      {labels.length === 0 ? (
        <p className="text-sm text-muted print:hidden">
          No codes match the current filter.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 print:grid-cols-3 print:gap-2">
          {labels.map((l) => (
            <div
              key={l.code}
              className="flex break-inside-avoid flex-col items-center gap-2 rounded-xl border border-[#D4AF37]/50 bg-white p-3 text-center"
            >
              <span className="font-condensed text-sm tracking-[0.18em] text-[#A67C00]">
                HOLLOWTIPS
              </span>
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={l.qr} alt={l.code} className="h-32 w-32" />
                {/* Centered bullet logo overlay (QR is level H → still scans) */}
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-0.5">
                  <Image
                    src="/brand/hollowtips-bullet.png"
                    alt=""
                    width={20}
                    height={20}
                    className="h-6 w-6 object-contain"
                  />
                </span>
              </div>
              <span className="font-mono text-xs font-semibold text-[#0A0A0A]">
                {l.code}
              </span>
              <span className="text-[10px] leading-tight text-neutral-600">
                {l.product}
                {l.strain ? ` · ${l.strain}` : ""}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
