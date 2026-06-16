import { prisma } from "@/lib/prisma";
import { CodeStatus } from "@/lib/enums";
import { parseSocialLinks, SOCIAL_PLATFORMS } from "@/lib/social";
import { HollowtipsLogo } from "@/components/brand/HollowtipsLogo";
import { ScanBeacon } from "@/components/verify/ScanBeacon";
import { EmailOptIn } from "@/components/verify/EmailOptIn";

export const dynamic = "force-dynamic";
export const metadata = { title: "Verify — Hollowtips" };

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="grain pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.10),transparent_55%)]" />
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-lg flex-col items-center px-5 py-10">
        {children}
      </div>
    </main>
  );
}

function ResultBanner({
  title,
  subtitle,
  tone,
}: {
  title: string;
  subtitle: string;
  tone: "pass" | "wasted" | "busted" | "caution";
}) {
  const cls =
    tone === "pass"
      ? "text-gold-gradient"
      : tone === "wasted"
        ? "text-red-500"
        : tone === "caution"
          ? "text-amber-400"
          : "text-sky-400";
  return (
    <div className="text-center">
      <h1
        className={`font-gta text-5xl uppercase leading-none tracking-wide drop-shadow-[0_2px_0_rgba(0,0,0,0.6)] sm:text-6xl ${cls}`}
        style={{ WebkitTextStroke: "1px rgba(0,0,0,0.35)" }}
      >
        {title}
      </h1>
      <p className="mt-2 text-sm uppercase tracking-[0.35em] text-white/60">
        {subtitle}
      </p>
    </div>
  );
}

export default async function VerifyPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  const record = await prisma.verificationCode.findUnique({
    where: { code },
    include: { product: true, variant: true },
  });

  // ── Unknown → BUSTED ───────────────────────────────────────
  if (!record) {
    return (
      <Shell>
        <div className="mb-10">
          <HollowtipsLogo variant="full" size={40} />
        </div>
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <ResultBanner title="Busted" subtitle="Code not recognized" tone="busted" />
          <p className="max-w-sm text-center text-sm text-white/60">
            This code isn&apos;t in our system. It may be mistyped or counterfeit.
            Buy only from authorized Hollowtips sources.
          </p>
          <code className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-white/50">
            {code}
          </code>
        </div>
      </Shell>
    );
  }

  const blocked = record.status === CodeStatus.FLAGGED && record.firstScannedAt === null;
  const repeat = record.firstScannedAt !== null && record.scanCount > 1;
  const { product, variant } = record;
  const hero = variant?.artworkUrl || product.artworkUrl || variant?.productImageUrl || product.productImageUrl;
  const type = variant?.productType || product.productType;
  const social = parseSocialLinks(product.socialLinks);
  const firstScannedLabel = record.firstScannedAt?.toLocaleDateString() ?? null;

  // ── Admin-blocked code → WASTED ────────────────────────────
  if (blocked) {
    return (
      <Shell>
        <ScanBeacon code={code} />
        <div className="mb-10">
          <HollowtipsLogo variant="full" size={40} />
        </div>
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <ResultBanner title="Wasted" subtitle="Blocked code" tone="wasted" />
          <p className="max-w-sm text-center text-sm text-white/60">
            This code has been blocked. It may be a duplicate or counterfeit.
            Contact Hollowtips if you bought this from an authorized source.
          </p>
        </div>
      </Shell>
    );
  }

  const reveal = (
    <>
      {/* Stats */}
      <div className="mt-6 grid w-full grid-cols-2 gap-2 text-center">
        <div className="rounded-xl border border-gold/20 bg-white/5 px-3 py-2">
          <p className="text-[10px] uppercase tracking-widest text-white/40">Status</p>
          <p className={`font-gta text-lg ${repeat ? "text-amber-400" : "text-gold"}`}>
            {repeat ? "REPEAT" : record.scanCount <= 1 ? "FIRST SCAN" : "VERIFIED"}
          </p>
        </div>
        <div className="rounded-xl border border-gold/20 bg-white/5 px-3 py-2">
          <p className="text-[10px] uppercase tracking-widest text-white/40">Scans</p>
          <p className="font-gta text-lg text-gold">{record.scanCount}</p>
        </div>
      </div>

      {/* Product reveal */}
      <div className="mt-6 w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c0c]">
        {hero && (
          <div className="relative aspect-video w-full bg-black">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={hero} alt={product.name} className="h-full w-full object-contain" />
          </div>
        )}
        <div className="space-y-4 p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-gta text-2xl uppercase tracking-wide text-white">
                {product.name}
              </h2>
              {variant && <p className="text-xs text-white/50">{variant.name}</p>}
            </div>
            {type && (
              <span className="shrink-0 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-gold">
                {type}
              </span>
            )}
          </div>
          {product.description && (
            <p className="text-sm text-white/70">{product.description}</p>
          )}
          {product.videoUrl && (
            <video src={product.videoUrl} controls playsInline className="w-full rounded-xl border border-white/10" />
          )}
          {product.ingredients && (
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/40">Ingredients</p>
              <p className="text-sm text-white/70">{product.ingredients}</p>
            </div>
          )}
          {product.warningText && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3">
              <p className="text-[10px] uppercase tracking-widest text-red-300/80">Warning</p>
              <p className="text-xs text-red-200/90">{product.warningText}</p>
            </div>
          )}
          {Object.keys(social).length > 0 && (
            <div className="flex flex-wrap gap-2">
              {SOCIAL_PLATFORMS.filter((p) => social[p.key]).map((p) => (
                <a
                  key={p.key}
                  href={social[p.key]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/70 transition-colors hover:border-gold/50 hover:text-gold"
                >
                  {p.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 w-full">
        <EmailOptIn productId={product.id} />
      </div>

      <a
        href="/verify"
        className="mt-6 text-xs text-white/40 underline-offset-4 transition-colors hover:text-gold hover:underline"
      >
        ← Enter a different code
      </a>
      <p className="mt-6 text-center text-[11px] text-white/30">
        Scratch &amp; scan · © {new Date().getFullYear()} Hollowtips
      </p>
    </>
  );

  return (
    <Shell>
      <ScanBeacon code={code} />
      <div className="mb-8">
        <HollowtipsLogo variant="full" size={40} />
      </div>

      {repeat ? (
        <ResultBanner title="Already Activated" subtitle="Caution" tone="caution" />
      ) : (
        <ResultBanner title="Mission Passed" subtitle="Authentic" tone="pass" />
      )}

      {repeat && (
        <div className="mt-5 w-full rounded-xl border border-amber-400/30 bg-amber-400/10 p-4 text-center text-sm text-amber-200">
          This code was first activated{firstScannedLabel ? ` on ${firstScannedLabel}` : ""} and
          has been scanned {record.scanCount}×. If you <strong>just</strong> scratched
          this panel, your product may be counterfeit — contact Hollowtips.
        </div>
      )}

      {reveal}
    </Shell>
  );
}
