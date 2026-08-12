import { Check, Truck } from "lucide-react";
import { RatingBadge } from "./rating-badge";
import { ProviderCta } from "./provider-cta";
import { SocialProofBubble } from "./social-proof-bubble";

interface ComparisonCardProduct {
  id: string;
  name: string;
  tagline: string;
  logo: string;
  highlights: string[];
  affiliateUrl: string;
  ctaText: string;
  rank: number;
  rating: number;
  ratingLabel: string;
  starRating?: number;
  badge?: string;
}

interface ComparisonCardProps {
  product: ComparisonCardProduct;
  hideRank?: boolean;
  pageType?: "listing" | "review" | "battle" | "quiz_results";
  sourceFlow?: "main_comparison" | "provider_review" | "battle_page" | "matching_flow";
  socialProof?: { number: string; text: string };
}

const arrowSvg = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>;

export function ComparisonCard({ product, hideRank, pageType = "listing", sourceFlow = "main_comparison", socialProof }: ComparisonCardProps) {
  const showBubble = product.rank === 1 && !!socialProof;
  return (
    <article className="relative rounded-md border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md overflow-hidden">
      {/* Rank badge — top-left, only bottom-right rounded */}
      {!hideRank && (
        <div className="absolute left-0 top-0 z-10 flex h-[28px] w-[28px] items-center justify-center rounded-br-lg bg-[#191919] text-[15px] font-bold text-white">
          {product.rank}
        </div>
      )}

      {/* Badge (e.g. "Our Most Popular") */}
      {!hideRank && product.badge && (
        <div className="absolute left-[34px] top-0 z-10 flex h-[28px] items-center rounded-br-lg bg-[#EBA51E] px-3 text-[11px] font-bold tracking-wide text-[#3A2A06] uppercase">
          {product.badge}
        </div>
      )}

      {/* ===== DESKTOP LAYOUT ===== */}
      <div className="hidden sm:flex sm:flex-row sm:h-[188px]">
        {/* Column 1: Logo */}
        <div className="flex items-center justify-center px-6 sm:w-[220px] sm:shrink-0">
          <div className="flex h-[50px] w-[130px] items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.logo}
              alt={`${product.name} logo`}
              className="max-h-full max-w-full object-contain"
            />
          </div>
        </div>

        {/* Column 2: Content */}
        <div className="flex-1 px-6 py-5">
          <h3 className="text-[12px] font-semibold text-[#1A1A1A]">{product.name}</h3>
          <a
            href={`/reviews/${product.id}`}
            className="text-[12px] font-semibold text-[#0B5E9E] hover:underline"
          >
            Read Review
          </a>
          <p className="mt-2 text-[12px] font-semibold text-[#1A1A1A]">{product.tagline}</p>
          <ul className="mt-1 space-y-0.5">
            {product.highlights.slice(0, 3).map((highlight) => (
              <li key={highlight} className="flex items-center gap-2 text-[12px] leading-[1.35] text-gray-800">
                <Check className="h-3.5 w-3.5 shrink-0 text-[#0B5E9E]" strokeWidth={2} />
                {highlight}
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Rating + CTA */}
        <div className="relative flex flex-col items-center justify-center gap-4 px-6 py-5 sm:w-[200px] sm:shrink-0">
          <RatingBadge rating={product.rating} label={product.ratingLabel} starRating={product.starRating} />
          <div className="relative w-full">
            {showBubble && <SocialProofBubble number={socialProof!.number} text={socialProof!.text} />}
            <ProviderCta
              href={product.affiliateUrl}
              providerName={product.name}
              providerSlug={product.id}
              position={product.rank}
              pageType={pageType}
              sourceFlow={sourceFlow}
              className="flex h-[42px] w-full items-center justify-center gap-2 rounded-lg bg-[#0C4B75] text-[15px] font-bold text-white transition-colors hover:bg-[#093d61]"
            >
              Visit Site
              {arrowSvg}
            </ProviderCta>
          </div>
          {product.rank === 1 && (
            <div className="absolute bottom-4.5 left-0 right-0 hidden sm:flex items-center justify-center">
              <ShippingBadge />
            </div>
          )}
        </div>
      </div>

      {/* ===== MOBILE LAYOUT ===== */}
      <div className="flex flex-col sm:hidden p-5 pt-12">
        {/* Row 1: Logo left, Rating right */}
        <div className="flex items-start justify-between">
          <div className="flex h-[40px] w-[120px] items-center justify-start">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.logo}
              alt={`${product.name} logo`}
              className="max-h-full max-w-full object-contain"
            />
          </div>
          <RatingBadge rating={product.rating} label={product.ratingLabel} starRating={product.starRating} />
        </div>

        {/* Tagline */}
        <p className="mt-3 text-[14px] font-semibold text-[#1A1A1A]">{product.tagline}</p>

        {/* Bullets */}
        <ul className="mt-1.5 space-y-1">
          {product.highlights.slice(0, 3).map((highlight) => (
            <li key={highlight} className="flex items-start gap-2 text-[14px] leading-[1.4] text-gray-800">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#0B5E9E]" strokeWidth={2} />
              {highlight}
            </li>
          ))}
        </ul>

        {product.rank === 1 && (
          <div className="sm:hidden"><ShippingBadge /></div>
        )}

        {/* CTA */}
        <ProviderCta
          href={product.affiliateUrl}
          providerName={product.name}
          providerSlug={product.id}
          position={product.rank}
          pageType={pageType}
          sourceFlow={sourceFlow}
          className="mt-5 flex h-[48px] w-full items-center justify-center gap-2 rounded-lg bg-[#0C4B75] text-[16px] font-bold text-white transition-colors hover:bg-[#093d61]"
        >
          Visit Site
          {arrowSvg}
        </ProviderCta>
      </div>
    </article>
  );
}

function ShippingBadge() {
  return (
    <p className="mt-2.5 flex items-center gap-1.5 whitespace-nowrap text-[12px] font-semibold text-[#0B9E6A]">
      <Truck className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
      Free &amp; Discreet Shipping
    </p>
  );
}
