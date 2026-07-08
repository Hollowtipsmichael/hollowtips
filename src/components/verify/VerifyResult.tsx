import Link from "next/link";
import { ResultIcon } from "./ResultIcon";
import { SocialRow } from "./SocialRow";
import { TheChamberForm } from "./TheChamberForm";
import { GiveawaySection } from "./GiveawaySection";

type ProductLike = {
  name: string;
  productType: string | null;
  artworkUrl: string | null;
  productImageUrl: string | null;
};

const TYPE_BADGE: Record<string, string> = {
  INDICA: "border-strain-indica text-strain-indica",
  SATIVA: "border-strain-sativa text-strain-sativa",
  HYBRID: "border-strain-hybrid text-strain-hybrid",
};

const title = (s: string) => s.charAt(0) + s.slice(1).toLowerCase();

/** The Chamber capture block + giveaway — shared tail on both result screens. */
function ResultTail({
  source,
}: {
  source: "verify-legit" | "verify-busted";
}) {
  return (
    <>
      <div className="mt-9 w-full">
        <SocialRow />
      </div>
      <div className="mt-8 w-full">
        <p className="mb-1 text-center font-condensed text-[22px] font-black uppercase tracking-[1px] text-gold">
          The Chamber
        </p>
        <p className="mb-4 text-center text-[13px] text-[#999]">
          Lock in for the drops, the giveaway, and the perks.
        </p>
        <TheChamberForm source={source} />
      </div>
      <div className="mt-6 w-full">
        <GiveawaySection note="Signing up above enters you automatically." />
      </div>
    </>
  );
}

export function VerifyResult({
  variant,
  code,
  product,
}: {
  variant: "legit" | "busted";
  code: string;
  product?: ProductLike | null;
}) {
  if (variant === "legit" && product) {
    const art = product.artworkUrl || product.productImageUrl;
    return (
      <div className="flex w-full flex-col items-center">
        <div className="flex w-full justify-center pb-4 pt-6">
          <ResultIcon variant="legit" />
        </div>
        <h1 className="text-center font-condensed text-[46px] font-black uppercase leading-[0.95] tracking-[1px] text-legit sm:text-[54px]">
          This Piece Is Real.
        </h1>
        <p className="mt-3 max-w-[320px] text-center text-[15px] leading-relaxed text-[#bbb]">
          You&apos;re holding the real thing. Welcome to the circle.
        </p>

        {/* Strain artwork reveal — let the art speak (no SKU / scan / size) */}
        {art && (
          <div className="mt-7 w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={art}
              alt={product.name}
              className="mx-auto max-h-[320px] w-auto max-w-full animate-fade-in object-contain drop-shadow-[0_10px_40px_rgba(0,0,0,0.6)]"
            />
          </div>
        )}
        <h2 className="mt-5 text-center font-condensed text-3xl font-black uppercase tracking-[1px] text-white">
          {product.name}
        </h2>
        {product.productType && (
          <span
            className={`mt-3 rounded-full border bg-black/50 px-3.5 py-1 font-condensed text-xs font-bold uppercase tracking-[2px] ${
              TYPE_BADGE[product.productType] || "border-gold text-gold"
            }`}
          >
            {title(product.productType)}
          </span>
        )}

        <ResultTail source="verify-legit" />
      </div>
    );
  }

  // BUSTED — unknown or admin-flagged code
  return (
    <div className="flex w-full flex-col items-center">
      <div className="flex w-full justify-center pb-4 pt-6">
        <ResultIcon variant="busted" />
      </div>
      <h1 className="text-center font-condensed text-[46px] font-black uppercase leading-[0.95] tracking-[1px] text-busted sm:text-[54px]">
        This Piece Isn&apos;t Real.
      </h1>
      <p className="mt-3 max-w-[320px] text-center text-[15px] leading-relaxed text-[#bbb]">
        This unit didn&apos;t pass our check. You may have a counterfeit.
      </p>
      <p className="mt-3 max-w-[320px] text-center text-[14px] leading-relaxed text-[#888]">
        Don&apos;t stress — counterfeits happen. Here&apos;s how to get the real
        thing.
      </p>
      {code && (
        <div className="mt-4 rounded-md border border-[#222] bg-[#1a1a1a] px-4 py-2 font-condensed text-[13px] tracking-[3px] text-[#888]">
          {code}
        </div>
      )}

      <div className="mt-7 flex w-full flex-col gap-3">
        <Link
          href="/verify"
          className="flex w-full items-center justify-center rounded-[10px] border border-white/60 px-5 py-4 font-condensed text-base font-bold uppercase tracking-[1.5px] text-white transition active:scale-[0.98] hover:bg-white/5"
        >
          Try Again
        </Link>
        <a
          href="https://hollowtips.com"
          className="flex w-full items-center justify-center rounded-[10px] border border-gold px-5 py-4 font-condensed text-base font-bold uppercase tracking-[1.5px] text-gold transition active:scale-[0.98] hover:bg-gold/10"
        >
          Back to Home
        </a>
      </div>

      <ResultTail source="verify-busted" />
    </div>
  );
}
