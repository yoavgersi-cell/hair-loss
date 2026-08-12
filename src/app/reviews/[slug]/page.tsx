import type { Metadata } from "next";
import Link from "next/link";
import { Check, X, ArrowRight, Users, Clock, Shield } from "lucide-react";
import { getConfig } from "@/lib/config-store";
import { CONTENT_LAST_UPDATED } from "@/lib/config";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ProviderCta } from "@/components/provider-cta";
import { TrustpilotCarousel } from "@/components/trustpilot-carousel";
import { ExpertByline } from "@/components/expert-byline";
import { LastUpdated } from "@/components/last-updated";
import { notFound } from "next/navigation";

export const revalidate = 60;

// Per-provider SEO overrides for reviews with distinctive search demand.
// Code-controlled (not CMS-merged) so they reliably target trending queries —
// e.g. surging "embody reviews" and "embody glp1".
const REVIEW_SEO_OVERRIDES: Record<string, { title: string; description: string }> = {
  hims: {
    title: "Hims Hair Loss Review 2026: Cost, Treatments & Is It Legit?",
    description:
      "Hims hair loss reviews: Rx finasteride & minoxidil, a 2-in-1 spray, and supporting products from ~$20/mo. Is Hims legit and worth it? Real cost, pros & cons, and verdict.",
  },
  keeps: {
    title: "Keeps Reviews 2026: Cost, Hair Loss Treatments & Is It Legit?",
    description:
      "Keeps reviews: affordable, hair-loss-focused finasteride & minoxidil from ~$25/mo with online doctor consults. Is Keeps legit and worth it? Real cost, pros & cons, and verdict.",
  },
  roman: {
    title: "Roman Hair Loss Review 2026: Cost, Treatments & Is It Legit?",
    description:
      "Roman (from Ro) hair loss reviews: clinician-guided finasteride & minoxidil with discreet delivery. Is Roman legit and worth it? Real cost, pros & cons, and verdict.",
  },
  happyhead: {
    title: "Happy Head Reviews 2026: Custom Hair Loss Rx, Cost & Is It Legit?",
    description:
      "Happy Head reviews: dermatologist-formulated custom finasteride & minoxidil for men and women, from ~$35/mo. Is Happy Head legit and worth it? Real cost, pros & cons, and verdict.",
  },
  nutrafol: {
    title: "Nutrafol Reviews 2026: Does It Work? Cost & Is It Legit?",
    description:
      "Nutrafol reviews: drug-free, physician-formulated hair growth supplements for men & women, ~$79–$88/mo. Does it work, is it legit, and is it worth it? Real cost, pros & cons, and verdict.",
  },
  maximus: {
    title: "Maximus Hair Review 2026: Does the Protocol Work & Is It Legit?",
    description:
      "Maximus (Maximus Tribe) hair reviews: a prescription oral protocol combining minoxidil with finasteride or dutasteride for men. Does it work, is it legit, cost, pros & cons, and verdict.",
  },
};

// "Is [brand] legit?" trust block — targets the high-intent "is X legit" query
// cluster inside the existing review page. Grounded in each provider's real
// credentials/practices; only defined for providers with verifiable signals.
const REVIEW_LEGIT: Record<string, { verdict: string; signals: string[] }> = {
  hims: {
    verdict:
      "Yes — Hims is a legitimate, publicly traded telehealth company. Hair loss prescriptions like finasteride and minoxidil are written by licensed providers after an online consultation and filled by licensed pharmacies, then shipped discreetly to your door.",
    signals: [
      "Licensed providers prescribe after an online consult",
      "Prescriptions filled by licensed pharmacies",
      "Large, publicly traded telehealth company (NYSE: HIMS)",
      "FDA-approved medications (finasteride, minoxidil)",
      "Discreet packaging and flexible subscription",
    ],
  },
  keeps: {
    verdict:
      "Yes — Keeps is a legitimate men's hair loss service (part of Thirty Madison). Treatment is prescribed by licensed physicians after an online consultation and shipped discreetly, with a focus on affordable, evidence-based care.",
    signals: [
      "Licensed physicians review every treatment plan",
      "Established brand (part of Thirty Madison)",
      "FDA-approved finasteride & minoxidil",
      "Hair-loss-focused, transparent pricing",
      "Discreet home delivery",
    ],
  },
  roman: {
    verdict:
      "Yes — Roman is a legitimate men's-health brand from Ro, an established telehealth company. Hair loss treatment is clinician-guided, with licensed providers reviewing every plan before prescribing, and shipped discreetly.",
    signals: [
      "Licensed providers review every plan",
      "Backed by the established Ro telehealth platform",
      "FDA-approved finasteride & minoxidil",
      "Discreet packaging with free shipping",
      "Ongoing provider support",
    ],
  },
  happyhead: {
    verdict:
      "Yes — Happy Head is a legitimate, dermatologist-founded telehealth service. Its custom hair loss formulas are prescribed by licensed providers and made by licensed compounding pharmacies, for both men and women.",
    signals: [
      "Founded and formulated by board-certified dermatologists",
      "Licensed providers prescribe after review",
      "Custom formulas from licensed compounding pharmacies",
      "Treats both men and women",
      "Personalized to your hair loss pattern",
    ],
  },
  nutrafol: {
    verdict:
      "Yes — Nutrafol is a legitimate, widely sold hair growth supplement brand. Its formulas are physician-formulated, its ingredients are clinically tested, and it's sold directly and through dermatologists and licensed professionals. Note that it's a nutraceutical (supplement), not an FDA-approved drug.",
    signals: [
      "Physician-formulated formulas",
      "Clinically tested ingredients (published studies)",
      "Sold through dermatologists and licensed professionals",
      "Drug-free — no prescription required",
      "Established, widely available brand",
    ],
  },
  maximus: {
    verdict:
      "Yes — Maximus (Maximus Tribe) is a legitimate men's-health telehealth company. Its hair-growth protocol is prescribed by licensed providers after an online medical review and filled by licensed pharmacies, combining evidence-backed actives into one oral formulation.",
    signals: [
      "Licensed providers review every plan",
      "Prescriptions filled by licensed pharmacies",
      "Established men's-health telehealth brand",
      "Uses evidence-backed actives (minoxidil, finasteride/dutasteride)",
      "Online medical intake before prescribing",
    ],
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const config = await getConfig();
  const review = (config.reviews ?? []).find((r) => r.slug === slug);
  if (!review) return { title: "Review Not Found" };

  const provider = config.providers.find((p) => p.id === review.providerId);
  if (!provider) return { title: "Review Not Found" };

  const override = REVIEW_SEO_OVERRIDES[slug];
  const pageTitle = override?.title ?? `${provider.name} Review 2026: Cost, Results & Is It Worth It?`;
  const pageDescription = override?.description ?? review.shortSummary;

  return {
    title: pageTitle,
    description: pageDescription,
    alternates: {
      canonical: `https://www.tophairloss.io/reviews/${slug}`,
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: `https://www.tophairloss.io/reviews/${slug}`,
      type: "article",
    },
  };
}

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const config = await getConfig();
  const review = (config.reviews ?? []).find((r) => r.slug === slug);
  if (!review) return notFound();

  const provider = config.providers.find((p) => p.id === review.providerId);
  if (!provider) return notFound();

  const legit = REVIEW_LEGIT[slug];
  const reviewer = config.experts?.[0];

  // JSON-LD
  const reviewSchema = {
    "@context": "https://schema.org",
    "@type": "Review",
    name: `${provider.name} Review`,
    headline: `${provider.name} Review 2026: Cost, Results & Is It Worth It?`,
    reviewBody: review.reviewIntro,
    datePublished: "2026-06-01",
    dateModified: review.updatedAt || CONTENT_LAST_UPDATED,
    author: { "@type": "Organization", name: "TopHairLoss Team", url: "https://www.tophairloss.io" },
    ...(reviewer && {
      reviewedBy: {
        "@type": "Person",
        name: reviewer.credentials ? `${reviewer.name}, ${reviewer.credentials}` : reviewer.name,
        jobTitle: reviewer.role,
        worksFor: { "@type": "Organization", name: "tophairloss.io" },
      },
    }),
    publisher: { "@type": "Organization", name: "tophairloss.io", url: "https://www.tophairloss.io" },
    itemReviewed: { "@type": "Product", name: provider.name, description: review.shortSummary },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.tophairloss.io" },
      { "@type": "ListItem", position: 2, name: "Reviews", item: "https://www.tophairloss.io/reviews" },
      { "@type": "ListItem", position: 3, name: `${provider.name} Review`, item: `https://www.tophairloss.io/reviews/${slug}` },
    ],
  };

  // FAQ — real, query-shaped questions answered entirely from this review's
  // own researched content (pricing, treatments, best-for, verdict). Powers
  // both the visible FAQ section and the FAQPage schema (rich results / PAA).
  const reviewFaqs = [
    { question: `Is ${provider.name} legit?`, answer: legit?.verdict ?? review.reviewIntro },
    { question: `How much does ${provider.name} cost?`, answer: review.pricingSummary },
    review.treatmentOptions?.length
      ? { question: `What treatments does ${provider.name} offer?`, answer: `${provider.name} offers ${review.treatmentOptions.join(", ")}.` }
      : null,
    review.bestFor?.length
      ? { question: `Who is ${provider.name} best for?`, answer: `${provider.name} is best for ${review.bestFor.join("; ")}.` }
      : null,
    { question: `Is ${provider.name} worth it?`, answer: review.finalVerdict },
  ].filter((f): f is { question: string; answer: string } => !!f && !!f.answer);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: reviewFaqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  const relatedBattles = (config.battles ?? []).filter(
    (b) => b.provider1Id === provider.id || b.provider2Id === provider.id
  );
  const relatedArticles = (config.articles ?? []).slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Hero header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-[1000px] px-4 pb-8 pt-8 sm:px-6 sm:pt-10">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Reviews", href: "/reviews" },
              { label: `${provider.name} Review` },
            ]}
          />

          <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-5">
              <div className="flex h-[50px] w-[130px] shrink-0 items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={provider.logo} alt={`${provider.name} logo`} className="max-h-full max-w-full object-contain" />
              </div>
              <div>
                <h1 className="text-[24px] font-bold text-[#191919] sm:text-[28px]">
                  {provider.name} Reviews
                </h1>
                <p className="mt-0.5 text-[14px] text-gray-500">
                  {provider.tagline}
                </p>
                <LastUpdated date={review.updatedAt || CONTENT_LAST_UPDATED} className="mt-1" />
              </div>
            </div>
            <ProviderCta
              href={provider.affiliateUrl}
              providerName={provider.name}
              providerSlug={provider.id}
              pageType="review"
              sourceFlow="provider_review"
              className="flex h-[44px] items-center justify-center gap-2 rounded-lg bg-[#0C4B75] px-6 text-[14px] font-bold text-white transition-colors hover:bg-[#093d61] sm:shrink-0"
            >
              Visit {provider.name}
              <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
            </ProviderCta>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1000px] px-4 py-8 sm:px-6">
        {/* Quick summary strip */}
        <div className="mb-8 flex flex-wrap items-center gap-4 rounded-xl border border-gray-200 bg-white px-5 py-4 sm:gap-6">
          <div className="flex items-center gap-2 text-[13px] text-gray-600">
            <Shield className="h-4 w-4 text-[#0C4B75]" strokeWidth={1.5} />
            Licensed Providers
          </div>
          <div className="flex items-center gap-2 text-[13px] text-gray-600">
            <Clock className="h-4 w-4 text-[#0C4B75]" strokeWidth={1.5} />
            Fast Home Delivery
          </div>
          <div className="flex items-center gap-2 text-[13px] text-gray-600">
            <Users className="h-4 w-4 text-[#0C4B75]" strokeWidth={1.5} />
            Ongoing Support
          </div>
        </div>

        {/* Intro */}
        <div className="mb-8">
          <p className="text-[16px] leading-[1.8] text-gray-600">
            {review.reviewIntro}
          </p>
          {config.experts && config.experts.length > 0 && (
            <div className="mt-5">
              <ExpertByline expert={config.experts[0]} label="Reviewed by" />
            </div>
          )}
        </div>

        {/* Is [brand] legit? — trust block for the "is X legit" query cluster */}
        {legit && (
          <div className="mb-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b border-gray-100 bg-emerald-50/50 px-6 py-4">
              <Shield className="h-5 w-5 text-emerald-600" strokeWidth={2} />
              <h2 className="text-[18px] font-bold text-[#191919]">
                Is {provider.name} legit?
              </h2>
            </div>
            <div className="p-6">
              <p className="mb-4 text-[15px] leading-[1.75] text-gray-600">
                {legit.verdict}
              </p>
              <ul className="grid gap-2.5 sm:grid-cols-2">
                {legit.signals.map((signal) => (
                  <li key={signal} className="flex items-start gap-2.5 text-[14px] text-gray-700">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" strokeWidth={2} />
                    {signal}
                  </li>
                ))}
                {provider.trustpilotRating && provider.trustpilotReviewCount && (
                  <li className="flex items-start gap-2.5 text-[14px] text-gray-700">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" strokeWidth={2} />
                    Rated {provider.trustpilotRating}/5 across {provider.trustpilotReviewCount} Trustpilot reviews
                  </li>
                )}
              </ul>
              <p className="mt-4 text-[12px] leading-relaxed text-gray-400">
                &ldquo;Legitimate&rdquo; here means a real, licensed telehealth operation — not a
                guarantee of results. Compounded medications are not FDA-approved brand drugs. Always
                confirm current details and eligibility with the provider.
              </p>
            </div>
          </div>
        )}

        {/* Key Features + Pricing side by side on desktop */}
        <div className="mb-6 grid gap-6 sm:grid-cols-2">
          <Section title="Key Features">
            <ul className="space-y-2.5">
              {review.keyFeatures.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-[14px] text-gray-700">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" strokeWidth={2} />
                  {feature}
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Treatment Options">
            <ul className="space-y-2.5">
              {review.treatmentOptions.map((option) => (
                <li key={option} className="flex items-start gap-2.5 text-[14px] text-gray-700">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0C4B75]" />
                  {option}
                </li>
              ))}
            </ul>
          </Section>
        </div>

        {/* Pricing */}
        <Section title="Pricing">
          <p className="text-[15px] leading-[1.75] text-gray-600">
            {review.pricingSummary}
          </p>
        </Section>

        {/* Pros & Cons */}
        <div className="mb-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="grid sm:grid-cols-2">
            <div className="p-6 sm:border-r sm:border-gray-100">
              <h3 className="mb-4 flex items-center gap-2 text-[15px] font-bold text-emerald-700">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100">
                  <Check className="h-3.5 w-3.5 text-emerald-600" strokeWidth={2.5} />
                </div>
                Pros
              </h3>
              <ul className="space-y-2.5">
                {review.pros.map((pro) => (
                  <li key={pro} className="flex items-start gap-2.5 text-[14px] text-gray-700">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" strokeWidth={2} />
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-t border-gray-100 p-6 sm:border-t-0">
              <h3 className="mb-4 flex items-center gap-2 text-[15px] font-bold text-red-600">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100">
                  <X className="h-3.5 w-3.5 text-red-500" strokeWidth={2.5} />
                </div>
                Cons
              </h3>
              <ul className="space-y-2.5">
                {review.cons.map((con) => (
                  <li key={con} className="flex items-start gap-2.5 text-[14px] text-gray-700">
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-red-400" strokeWidth={2} />
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Mid-page CTA */}
        <div className="mb-6 rounded-xl border border-[#0C4B75]/10 bg-[#0C4B75]/[0.03] p-5 text-center sm:p-6">
          <p className="mb-3 text-[16px] font-bold text-[#191919]">
            Interested in {provider.name}?
          </p>
          <p className="mb-4 text-[13px] text-gray-500">
            Visit their site to check eligibility and current pricing.
          </p>
          <ProviderCta
            href={provider.affiliateUrl}
            providerName={provider.name}
            providerSlug={provider.id}
            pageType="review"
            sourceFlow="provider_review"
            className="inline-flex h-[44px] items-center justify-center gap-2 rounded-lg bg-[#0C4B75] px-8 text-[14px] font-bold text-white transition-colors hover:bg-[#093d61]"
          >
            Visit {provider.name}
            <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
          </ProviderCta>
        </div>

        {/* Best For */}
        <Section title="Who It's Best For">
          <ul className="space-y-2.5">
            {review.bestFor.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-[14px] text-gray-700">
                <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-[#0C4B75]" strokeWidth={2} />
                {item}
              </li>
            ))}
          </ul>
        </Section>

        {/* Trustpilot Reviews */}
        {(provider.trustpilotReviews?.length ?? 0) > 0 && (
          <div className="mb-6">
            <TrustpilotCarousel
              providerName={provider.name}
              providerLogo={provider.logo}
              reviews={provider.trustpilotReviews!}
              rating={provider.trustpilotRating}
              reviewCount={provider.trustpilotReviewCount}
            />
          </div>
        )}

        {/* Final Verdict */}
        <div className="mb-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 bg-gray-50/70 px-6 py-4">
            <h3 className="text-[18px] font-bold text-[#191919]">Final Verdict</h3>
          </div>
          <div className="p-6">
            <p className="text-[15px] leading-[1.75] text-gray-600">
              {review.finalVerdict}
            </p>
            <ProviderCta
              href={provider.affiliateUrl}
              providerName={provider.name}
              providerSlug={provider.id}
              pageType="review"
              sourceFlow="provider_review"
              className="mt-5 flex h-[48px] w-full items-center justify-center gap-2 rounded-lg bg-[#0C4B75] text-[15px] font-bold text-white transition-colors hover:bg-[#093d61] sm:w-auto sm:px-8"
            >
              Visit {provider.name}
              <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
            </ProviderCta>
          </div>
        </div>

        {/* FAQ */}
        {reviewFaqs.length > 0 && (
          <div className="mb-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 bg-gray-50/70 px-6 py-4">
              <h2 className="text-[18px] font-bold text-[#191919]">
                {provider.name} Review: Frequently Asked Questions
              </h2>
            </div>
            <div className="divide-y divide-gray-100">
              {reviewFaqs.map((f, i) => (
                <div key={i} className="p-6">
                  <h3 className="mb-2 text-[15px] font-bold text-[#191919]">{f.question}</h3>
                  <p className="text-[14px] leading-[1.7] text-gray-600">{f.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Not sure? Quiz CTA */}
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-5 text-center shadow-sm">
          <p className="mb-1 text-[15px] font-bold text-[#191919]">Not sure if {provider.name} is right for you?</p>
          <p className="mb-4 text-[13px] text-gray-500">Take our free quiz and get a personalized provider recommendation.</p>
          <Link
            href="/find-your-match"
            className="inline-flex h-[42px] items-center justify-center gap-2 rounded-lg border border-[#0C4B75] px-6 text-[14px] font-bold text-[#0C4B75] transition-colors hover:bg-[#0C4B75]/5"
          >
            Find Your Match
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
          </Link>
        </div>

        {/* Related content */}
        {(relatedBattles.length > 0 || relatedArticles.length > 0) && (
          <div className="mb-6">
            <h3 className="mb-4 text-[18px] font-bold text-[#191919]">Related</h3>
            <div className="space-y-2">
              {relatedBattles.map((battle) => {
                const otherProvider = config.providers.find(
                  (p) => p.id === (battle.provider1Id === provider.id ? battle.provider2Id : battle.provider1Id)
                );
                return (
                  <Link
                    key={battle.slug}
                    href={`/${battle.slug}`}
                    className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-[14px] font-medium text-[#191919] transition-colors hover:border-[#0C4B75]/30 hover:bg-[#0C4B75]/[0.02]"
                  >
                    <span className="text-[#0C4B75]">{provider.name} vs {otherProvider?.name}</span>
                    <span className="ml-auto text-[12px] text-gray-400">Compare</span>
                  </Link>
                );
              })}
              {relatedArticles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/articles/${article.slug}`}
                  className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-[14px] font-medium text-[#191919] transition-colors hover:border-[#0C4B75]/30 hover:bg-[#0C4B75]/[0.02]"
                >
                  <span className="truncate">{article.title}</span>
                  <span className="ml-auto shrink-0 text-[12px] text-gray-400">{article.readTime}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-[17px] font-bold text-[#191919]">{title}</h3>
      {children}
    </div>
  );
}
