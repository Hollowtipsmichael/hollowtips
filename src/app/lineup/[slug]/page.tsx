import Link from "next/link";
import { notFound } from "next/navigation";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { parseVideo } from "@/lib/video";
import { HollowtipsLogo } from "@/components/brand/HollowtipsLogo";
import { PublicFooter } from "@/components/public/PublicFooter";

export const dynamic = "force-dynamic";

const title = (s: string) => s.charAt(0) + s.slice(1).toLowerCase();

const TYPE_BADGE: Record<string, string> = {
  INDICA: "border-strain-indica/50 text-strain-indica",
  SATIVA: "border-strain-sativa/50 text-strain-sativa",
  HYBRID: "border-strain-hybrid/50 text-strain-hybrid",
};

const TYPE_TINT: Record<string, string> = {
  INDICA: "from-strain-indica/30",
  SATIVA: "from-strain-sativa/30",
  HYBRID: "from-strain-hybrid/30",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  return { title: product ? `${product.name} — Hollowtips` : "Hollowtips" };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { variants: { where: { isActive: true } } },
  });
  if (!product || !product.isActive) notFound();

  const art = product.artworkUrl || product.productImageUrl;
  const tint = (product.productType && TYPE_TINT[product.productType]) || "from-gold/20";
  const video = product.videoUrl ? parseVideo(product.videoUrl) : null;

  const meta = [
    product.sku,
    product.productType ? title(product.productType) : null,
    product.size ?? "2G",
    "Live Resin · Liquid Diamonds",
  ].filter(Boolean);

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="grain pointer-events-none fixed inset-0 opacity-50" />

      {/* Header */}
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-5 py-6">
        <Link href="/">
          <HollowtipsLogo variant="full" size={32} />
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/media"
            className="text-sm font-semibold uppercase tracking-wide text-white/70 transition-colors hover:text-gold"
          >
            Media
          </Link>
          <Link href="/verify" className="btn-gold focus-gold text-sm">
            <ShieldCheck className="h-4 w-4" />
            Verify
          </Link>
        </div>
      </header>

      <section className="relative z-10 mx-auto max-w-6xl px-5 pb-12 pt-2">
        <Link
          href="/lineup"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-white/50 transition-colors hover:text-gold"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to the lineup
        </Link>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Big media */}
          <div className={`relative aspect-square w-full overflow-hidden rounded-3xl border border-gold/20 bg-gradient-to-b ${tint} to-black`}>
            {art ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={art} alt={product.name} className="h-full w-full object-cover" />
            ) : (
              <div className="grid h-full w-full place-items-center">
                <span className="px-4 text-center font-gta text-3xl uppercase tracking-wide text-white/80">
                  {product.name}
                </span>
              </div>
            )}
            {product.productType && (
              <span
                className={`absolute left-4 top-4 rounded-full border bg-black/70 px-3 py-1 text-xs font-bold uppercase tracking-wide backdrop-blur ${
                  TYPE_BADGE[product.productType] || "border-gold/40 text-gold"
                }`}
              >
                {product.productType}
              </span>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <h1 className="font-gta text-4xl uppercase leading-[0.95] tracking-wide text-gold-shine sm:text-5xl">
              {product.name}
            </h1>
            <p className="mt-3 text-sm uppercase tracking-[0.2em] text-white/55">
              {meta.join(" · ")}
            </p>

            {product.strainName && (
              <p className="mt-4 text-sm text-white/70">
                <span className="text-white/40">Strain:</span> {product.strainName}
              </p>
            )}

            {product.description && (
              <p className="mt-5 whitespace-pre-line text-[15px] leading-relaxed text-white/75">
                {product.description}
              </p>
            )}

            {product.ingredients && (
              <div className="mt-6">
                <h3 className="font-condensed text-xs font-bold uppercase tracking-[0.2em] text-gold">
                  Ingredients
                </h3>
                <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-white/65">
                  {product.ingredients}
                </p>
              </div>
            )}

            {product.variants.length > 0 && (
              <div className="mt-6">
                <h3 className="font-condensed text-xs font-bold uppercase tracking-[0.2em] text-gold">
                  Available
                </h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <span
                      key={v.id}
                      className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/70"
                    >
                      {v.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-auto pt-7">
              <Link href="/verify" className="btn-gold focus-gold">
                <ShieldCheck className="h-4 w-4" />
                Verify your product
              </Link>
            </div>
          </div>
        </div>

        {/* Big video the client uploaded for this product */}
        {video && (
          <div className="mt-10">
            <h2 className="mb-4 font-gta text-2xl uppercase tracking-wide text-white sm:text-3xl">
              Watch
            </h2>
            {video.kind === "file" ? (
              // adapts to the video's own format: landscape = full width,
              // portrait/vertical (reels) = tall + centered, never cropped
              <div className="mx-auto w-fit max-w-full overflow-hidden rounded-3xl border border-gold/25 bg-black shadow-gold-glow">
                <video
                  src={video.embedUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  poster={art || undefined}
                  disablePictureInPicture
                  className="max-h-[78vh] w-auto max-w-full bg-black"
                />
              </div>
            ) : (
              <div className="aspect-video w-full overflow-hidden rounded-3xl border border-gold/25 bg-black shadow-gold-glow">
                <iframe
                  src={video.embedUrl}
                  title={product.name}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full"
                />
              </div>
            )}
          </div>
        )}

        {product.warningText && (
          <p className="mt-8 rounded-2xl border border-white/10 bg-[#0c0c0c] p-5 text-xs leading-relaxed text-white/45">
            {product.warningText}
          </p>
        )}
      </section>

      <PublicFooter />
    </main>
  );
}
