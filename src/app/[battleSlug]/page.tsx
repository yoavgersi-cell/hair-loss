import type { Metadata } from "next";
import { Fragment } from "react";
import Link from "next/link";
import { getConfig } from "@/lib/config-store";
import { CONTENT_LAST_UPDATED } from "@/lib/config";
import { ComparisonLayout } from "@/components/comparison-layout";
import { EditorialContent } from "@/components/editorial-content";
import { LandingEditorial } from "@/components/landing-editorial";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { notFound, permanentRedirect } from "next/navigation";
import { ArrowRight, Check, Minus, ShieldCheck, Sparkles } from "lucide-react";
import { LastUpdated } from "@/components/last-updated";
import { ProviderCta } from "@/components/provider-cta";
import { TrustpilotCarousel } from "@/components/trustpilot-carousel";
import { TrustpilotRating } from "@/components/trustpilot-rating";
import { ExpertByline } from "@/components/expert-byline";

export const revalidate = 60;

const RESERVED_SLUGS = [
  "about",
  "admin",
  "api",
  "articles",
  "disclaimer",
  "find-your-match",
  "reviews",
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ battleSlug: string }>;
}): Promise<Metadata> {
  const { battleSlug } = await params;
  if (RESERVED_SLUGS.includes(battleSlug)) return {};

  const config = await getConfig();

  // Check landing pages first
  const landing = (config.landingPages ?? []).find((lp) => lp.slug === battleSlug);
  if (landing) {
    return {
      title: landing.seoTitle,
      description: landing.seoDescription,
      alternates: { canonical: `https://www.tophairloss.io/${landing.slug}` },
      openGraph: {
        title: landing.seoTitle,
        description: landing.seoDescription,
        url: `https://www.tophairloss.io/${landing.slug}`,
      },
    };
  }

  const battle = (config.battles ?? []).find((b) => b.slug === battleSlug);
  if (!battle) return { title: "Not Found" };

  // Reverse-pair canonicalization: if another battle compares the same two
  // providers in the opposite order (e.g. altrx-vs-noom and noom-vs-altrx),
  // both target the same query intent and split ranking signals. Point every
  // page for a given provider pair at one deterministic canonical — the
  // alphabetically-first slug — so Google consolidates them into one result.
  const samePairSlugs = (config.battles ?? [])
    .filter(
      (b) =>
        (b.provider1Id === battle.provider1Id && b.provider2Id === battle.provider2Id) ||
        (b.provider1Id === battle.provider2Id && b.provider2Id === battle.provider1Id)
    )
    .map((b) => b.slug)
    .sort();
  const canonicalSlug = samePairSlugs[0] ?? battle.slug;
  const canonicalUrl = `https://www.tophairloss.io/${canonicalSlug}`;

  return {
    title: battle.title,
    description: battle.description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: battle.title,
      description: battle.description,
      url: canonicalUrl,
      type: "article",
    },
  };
}

export default async function BattlePage({
  params,
}: {
  params: Promise<{ battleSlug: string }>;
}) {
  const { battleSlug } = await params;
  if (RESERVED_SLUGS.includes(battleSlug)) return notFound();

  const config = await getConfig();

  // ───── LANDING PAGE ─────
  const landing = (config.landingPages ?? []).find((lp) => lp.slug === battleSlug);
  if (landing) {
    // Build a config override with custom provider order + positions
    const customConfig = {
      ...config,
      ranking: {
        ...config.ranking,
        providerOrder: landing.providerOrder.length > 0 ? landing.providerOrder : config.ranking.providerOrder,
      },
    };

    const providerOrder = landing.providerOrder.length > 0 ? landing.providerOrder : config.ranking.providerOrder;

    const schemaData = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: landing.seoTitle,
      description: landing.seoDescription,
      url: `https://www.tophairloss.io/${landing.slug}`,
      dateModified: landing.updatedAt || CONTENT_LAST_UPDATED,
      publisher: { "@type": "Organization", name: "tophairloss.io", url: "https://www.tophairloss.io" },
    };

    const itemListSchema = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: landing.h1,
      numberOfItems: providerOrder.length,
      itemListElement: providerOrder.map((id, i) => {
        const p = config.providers.find((pr) => pr.id === id);
        return { "@type": "ListItem", position: i + 1, name: p?.name ?? id };
      }),
    };

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://www.tophairloss.io" },
        { "@type": "ListItem", position: 2, name: landing.h1, item: `https://www.tophairloss.io/${landing.slug}` },
      ],
    };

    // FAQ schema from editorial sections
    const landingFaqSchema = landing.editorialSections && landing.editorialSections.length > 0 ? {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: landing.editorialSections.map((s) => ({
        "@type": "Question",
        name: s.heading,
        acceptedAnswer: { "@type": "Answer", text: s.body.replace(/<[^>]*>/g, "") },
      })),
    } : null;

    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        {landingFaqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(landingFaqSchema) }} />}
        <ComparisonLayout
          config={customConfig}
          heroOverrides={{
            h1: landing.h1,
            h2: landing.h2,
            description: landing.heroDescription,
          }}
        >
          {landing.editorialSections && landing.editorialSections.length > 0 ? (
            <LandingEditorial sections={landing.editorialSections} />
          ) : (
            <EditorialContent />
          )}
        </ComparisonLayout>
      </>
    );
  }

  // ───── BATTLE PAGE ─────
  const battle = (config.battles ?? []).find((b) => b.slug === battleSlug);
  if (!battle) return notFound();

  // Collapse reverse-pair duplicates (e.g. embody-vs-altrx ↔ altrx-vs-embody):
  // both slugs render the same matchup and compete in search. 308-redirect any
  // non-canonical slug to the single canonical (alphabetically-first) slug for
  // this provider pair so only one URL is indexed and its authority is pooled.
  const samePairSlugs = (config.battles ?? [])
    .filter(
      (b) =>
        (b.provider1Id === battle.provider1Id && b.provider2Id === battle.provider2Id) ||
        (b.provider1Id === battle.provider2Id && b.provider2Id === battle.provider1Id)
    )
    .map((b) => b.slug)
    .sort();
  const canonicalPairSlug = samePairSlugs[0] ?? battle.slug;
  if (canonicalPairSlug !== battleSlug) {
    permanentRedirect(`/${canonicalPairSlug}`);
  }

  const p1 = config.providers.find((p) => p.id === battle.provider1Id);
  const p2 = config.providers.find((p) => p.id === battle.provider2Id);
  if (!p1 || !p2) return notFound();

  // Display label for the "X vs Y" matchup (breadcrumb, FAQ, schema). A battle
  // can lead the label with a high-demand brand via matchupLabel without
  // reordering provider1/provider2 (which drives winner logic).
  const matchupLabel = battle.matchupLabel || `${p1.name} vs ${p2.name}`;

  // Objective framing: no declared "winner". Map the per-side verdict points to
  // each provider (the CMS stores them as winner/loser points) so both columns
  // read as an even "go with X if… / go with Y if…" recommendation.
  const p1IsBattleWinner = battle.winnerId === p1.id;
  const p1VerdictPoints = p1IsBattleWinner ? (battle.verdictWinnerPoints ?? []) : (battle.verdictLoserPoints ?? []);
  const p2VerdictPoints = p1IsBattleWinner ? (battle.verdictLoserPoints ?? []) : (battle.verdictWinnerPoints ?? []);

  // Per-provider deep dives. Each provider gets its own rich, full section
  // (intro, what-you-get, pricing, pros/cons, its own Trustpilot reviews, CTA)
  // pulled from that provider's review data — so the page reads as two honest,
  // standalone write-ups rather than a "who wins" head-to-head. `bestForFallback`
  // covers providers that don't have a review entry yet.
  const p1Review = (config.reviews ?? []).find((r) => r.providerId === p1.id);
  const p2Review = (config.reviews ?? []).find((r) => r.providerId === p2.id);
  const deepDives = [
    { provider: p1, review: p1Review, bestForFallback: p1VerdictPoints },
    { provider: p2, review: p2Review, bestForFallback: p2VerdictPoints },
  ];

  // Related comparisons — other battles featuring either provider (internal links).
  // Ordered by relevance: comparisons involving this matchup's winner surface
  // first (a reader is most likely to keep evaluating the winner against other
  // options), then the rest in config order — the stable sort preserves that
  // order within each tier.
  const relatedBattles = (config.battles ?? [])
    .filter(
      (b) =>
        b.slug !== battle.slug &&
        [b.provider1Id, b.provider2Id].some((id) => id === p1.id || id === p2.id)
    )
    .map((b) => {
      const bp1 = config.providers.find((p) => p.id === b.provider1Id);
      const bp2 = config.providers.find((p) => p.id === b.provider2Id);
      if (!bp1 || !bp2) return null;
      const featuresWinner =
        b.provider1Id === battle.winnerId || b.provider2Id === battle.winnerId;
      return { slug: b.slug, bp1, bp2, featuresWinner };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null)
    .sort((a, b) => Number(b.featuresWinner) - Number(a.featuresWinner))
    .slice(0, 6);

  // FAQ — real, query-shaped questions answered from grounded battle content.
  // Expands the queries the page can rank for (long-tail + People Also Ask) and
  // powers both the visible FAQ section and the FAQPage schema.
  const catToQuestion = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("pric") || n.includes("value")) return `Is ${p1.name} cheaper than ${p2.name}?`;
    if (n.includes("ship") || n.includes("speed")) return `Which is faster, ${p1.name} or ${p2.name}?`;
    if (n.includes("medication")) return `Which has more medication options, ${p1.name} or ${p2.name}?`;
    if (n.includes("medical") || n.includes("care") || n.includes("support") || n.includes("monitor")) return `Which has better medical support, ${p1.name} or ${p2.name}?`;
    if (n.includes("customer") || n.includes("experience") || n.includes("service") || n.includes("personal")) return `Which has better customer reviews, ${p1.name} or ${p2.name}?`;
    if (n.includes("flexib")) return `Which offers more flexible plans, ${p1.name} or ${p2.name}?`;
    if (n.includes("focus") || n.includes("simplic")) return `Which is more focused on hair loss, ${p1.name} or ${p2.name}?`;
    if (n.includes("range") || n.includes("beyond")) return `Does ${p2.name} offer more than hair loss compared to ${p1.name}?`;
    if (n.includes("brand") || n.includes("track") || n.includes("pharmacy")) return `Which is the more established brand, ${p1.name} or ${p2.name}?`;
    if (n.includes("transparen") || n.includes("certif")) return `Which is more transparent about pricing, ${p1.name} or ${p2.name}?`;
    return `${name}: ${p1.name} or ${p2.name}?`;
  };

  const battleFaqs = [
    { question: `Which is better, ${matchupLabel}?`, answer: battle.verdict },
    ...battle.categories.map((cat) => ({ question: catToQuestion(cat.name), answer: cat.explanation })),
  ].filter((f, i, arr) => !!f.answer && arr.findIndex((x) => x.question === f.question) === i);

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: battle.title,
    description: battle.description,
    datePublished: "2026-06-01",
    dateModified: battle.updatedAt || CONTENT_LAST_UPDATED,
    author: { "@type": "Organization", name: "TopHairLoss Team", url: "https://www.tophairloss.io" },
    publisher: { "@type": "Organization", name: "tophairloss.io", url: "https://www.tophairloss.io" },
    mainEntityOfPage: `https://www.tophairloss.io/${battle.slug}`,
  };

  const battleBreadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.tophairloss.io" },
      { "@type": "ListItem", position: 2, name: matchupLabel, item: `https://www.tophairloss.io/${battle.slug}` },
    ],
  };

  const battleFaqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: battleFaqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(battleBreadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(battleFaqSchema) }} />

      <div className="min-h-screen bg-[#FAFAFA]">
        {/* ───── HERO ───── */}
        <section className="relative overflow-hidden border-b border-gray-200 bg-white">
          {/* Subtle gradient accent */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#0C4B75] via-[#1a8cd8] to-[#0C4B75]" />
          <div className="mx-auto max-w-[1100px] px-4 pb-10 pt-10 sm:px-6 sm:pb-14 sm:pt-12">
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: matchupLabel },
              ]}
            />

            <h1 className="text-[26px] font-extrabold leading-[1.15] text-[#191919] sm:text-[38px]">
              {battle.title}
            </h1>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-gray-500">
              {battle.subtitle || battle.description}
            </p>
            <LastUpdated date={battle.updatedAt || CONTENT_LAST_UPDATED} className="mt-4" />
          </div>
        </section>

        <div className="mx-auto max-w-[1100px] px-4 py-10 sm:px-6">
          {/* ───── EXPERT INTRO ───── */}
          <div className="mb-12 max-w-[760px]">
            <p className="mb-2.5 text-[12px] font-bold uppercase tracking-[0.07em] text-[#0C4B75]">
              Here&rsquo;s the short version
            </p>
            <p className="text-[16px] leading-[1.85] text-gray-600">
              {battle.intro}
            </p>
            {config.experts && config.experts.length > 0 && (
              <div className="mt-5">
                <ExpertByline expert={config.experts[0]} label="Written by" />
              </div>
            )}
          </div>

          {/* ───── PROVIDER CARDS (enriched) ───── */}
          <div className="relative mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* VS badge — desktop: absolute-centered between the two columns */}
            <div className="absolute left-1/2 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 sm:flex">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#0C4B75]/20 bg-white text-[13px] font-extrabold text-[#0C4B75] shadow-sm">
                VS
              </div>
            </div>

            {[p1, p2].map((provider, idx) => {
              return (
              <Fragment key={provider.id}>
                {/* VS badge — mobile: sits in the gap BETWEEN the two stacked cards */}
                {idx === 1 && (
                  <div className="flex items-center justify-center sm:hidden -my-1">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#0C4B75]/20 bg-white text-[12px] font-extrabold text-[#0C4B75]">
                      VS
                    </div>
                  </div>
                )}
              <div className="relative flex h-full flex-col rounded-2xl border border-gray-200 bg-white px-6 pb-6 pt-7 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex h-[40px] w-[110px] items-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={provider.logo} alt={`${provider.name} logo`} className="max-h-full max-w-full object-contain" />
                  </div>
                </div>

                {provider.trustpilotRating && (
                  <div className="mb-3 border-b border-gray-100 pb-3">
                    <TrustpilotRating
                      rating={provider.trustpilotRating}
                      reviewCount={provider.trustpilotReviewCount}
                      starSize={16}
                    />
                  </div>
                )}

                <p className="mb-4 text-[14px] leading-relaxed text-gray-500">
                  {provider.tagline}
                </p>

                <ul className="mb-5 space-y-2">
                  {provider.highlights.slice(0, 3).map((h, hi) => (
                    <li key={hi} className="flex items-start gap-2 text-[13px] text-gray-700">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" strokeWidth={2} />
                      {h}
                    </li>
                  ))}
                </ul>

                <ProviderCta
                  href={provider.affiliateUrl}
                  providerName={provider.name}
                  providerSlug={provider.id}
                  pageType="battle"
                  sourceFlow="battle_page"
                  className="mt-auto flex h-[44px] w-full items-center justify-center gap-1.5 rounded-xl bg-[#0C4B75] text-[14px] font-bold text-white transition-colors hover:bg-[#093d61]"
                >
                  Visit {provider.name}
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
                </ProviderCta>
              </div>
              </Fragment>
              );
            })}
          </div>

          {/* ───── FEATURE COMPARISON TABLE ───── */}
          {battle.features && battle.features.length > 0 && (() => {
            const getIcon = (row: typeof battle.features[0], which: "p1" | "p2") => {
              const h = row.highlight ?? "both";
              const isHighlighted = h === "both" || (which === "p1" && h === "provider1") || (which === "p2" && h === "provider2");
              const isDimmed = h !== "both" && h !== "none" && !isHighlighted;
              return { isHighlighted, isDimmed };
            };

            return (
            <div className="mb-14">
              <h2 className="mb-6 text-[22px] font-bold text-[#191919]">
                Side-by-Side Comparison
              </h2>

              {/* Desktop table */}
              <div className="hidden sm:block overflow-hidden rounded-2xl border border-gray-200 bg-white">
                <table className="w-full text-left text-[14px]">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="bg-gray-50 px-6 py-4 text-[12px] font-bold uppercase tracking-wider text-gray-400 w-[200px]">
                        Feature
                      </th>
                      <th className="px-6 py-4 text-[12px] font-bold uppercase tracking-wider text-[#191919]">
                        {p1.name}
                      </th>
                      <th className="px-6 py-4 text-[12px] font-bold uppercase tracking-wider text-[#191919]">
                        {p2.name}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {battle.features.map((row, i) => {
                      const p1s = getIcon(row, "p1");
                      const p2s = getIcon(row, "p2");
                      return (
                        <tr
                          key={i}
                          className={`${i < battle.features.length - 1 ? "border-b border-gray-100" : ""} ${i % 2 === 0 ? "bg-white" : "bg-gray-50/40"}`}
                        >
                          <td className="px-6 py-4 font-semibold text-[#191919] bg-gray-50/70">
                            {row.feature}
                          </td>
                          <td className={`px-6 py-4 ${p1s.isDimmed ? "text-gray-400" : "text-gray-700"}`}>
                            <div className="flex items-start gap-2">
                              {p1s.isHighlighted ? (
                                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" strokeWidth={2.5} />
                              ) : p1s.isDimmed ? (
                                <Minus className="mt-0.5 h-4 w-4 shrink-0 text-gray-300" strokeWidth={2} />
                              ) : null}
                              {row.provider1Value}
                            </div>
                          </td>
                          <td className={`px-6 py-4 ${p2s.isDimmed ? "text-gray-400" : "text-gray-700"}`}>
                            <div className="flex items-start gap-2">
                              {p2s.isHighlighted ? (
                                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" strokeWidth={2.5} />
                              ) : p2s.isDimmed ? (
                                <Minus className="mt-0.5 h-4 w-4 shrink-0 text-gray-300" strokeWidth={2} />
                              ) : null}
                              {row.provider2Value}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile stacked */}
              <div className="space-y-3 sm:hidden">
                {battle.features.map((row, i) => {
                  const p1s = getIcon(row, "p1");
                  const p2s = getIcon(row, "p2");
                  return (
                    <div
                      key={i}
                      className="rounded-xl border border-gray-200 bg-white p-4"
                    >
                      <p className="mb-3 text-[13px] font-bold text-[#191919]">
                        {row.feature}
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <div className={`rounded-lg p-2.5 ${p1s.isHighlighted ? "bg-emerald-50" : "bg-gray-50"}`}>
                          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                            {p1.name}
                          </p>
                          <div className={`flex items-start gap-1.5 text-[13px] ${p1s.isDimmed ? "text-gray-400" : "text-gray-700"}`}>
                            {p1s.isHighlighted && <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" strokeWidth={2.5} />}
                            {p1s.isDimmed && <Minus className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-300" strokeWidth={2} />}
                            {row.provider1Value}
                          </div>
                        </div>
                        <div className={`rounded-lg p-2.5 ${p2s.isHighlighted ? "bg-emerald-50" : "bg-gray-50"}`}>
                          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                            {p2.name}
                          </p>
                          <div className={`flex items-start gap-1.5 text-[13px] ${p2s.isDimmed ? "text-gray-400" : "text-gray-700"}`}>
                            {p2s.isHighlighted && <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" strokeWidth={2.5} />}
                            {p2s.isDimmed && <Minus className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-300" strokeWidth={2} />}
                            {row.provider2Value}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            );
          })()}

          {/* ───── PER-PROVIDER DEEP DIVES ───── */}
          <div className="mb-14">
            <div className="mb-8 max-w-[760px]">
              <p className="mb-2.5 text-[12px] font-bold uppercase tracking-[0.07em] text-[#0C4B75]">
                The full breakdown
              </p>
              <h2 className="text-[24px] font-bold text-[#191919]">
                {p1.name} vs {p2.name}: a closer look at each
              </h2>
              <p className="mt-3 text-[15px] leading-[1.8] text-gray-600">
                Both are solid hair loss providers, and honestly you can&rsquo;t go
                too wrong either way. So instead of crowning a &ldquo;winner,&rdquo; here&rsquo;s the
                real rundown on each &mdash; what you get, what it actually costs, and what
                real customers are saying &mdash; so you can pick the one that fits <em>you</em>.
              </p>
            </div>

            <div className="space-y-10">
              {deepDives.map(({ provider, review, bestForFallback }) => {
                const features = review?.keyFeatures?.length ? review.keyFeatures : provider.highlights;
                const bestFor = review?.bestFor?.length ? review.bestFor : bestForFallback;
                const plans = review?.pricingPlans ?? [];
                const pros = review?.pros ?? [];
                const cons = review?.cons ?? [];
                const badges = review?.trustBadges ?? [];
                const lead = review?.reviewIntro || provider.tagline;
                const reviewCount = provider.trustpilotReviews?.length ?? 0;

                return (
                  <section
                    key={provider.id}
                    className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
                  >
                    {/* Accent bar */}
                    <div className="h-1 bg-gradient-to-r from-[#0C4B75] via-[#1a8cd8] to-[#0C4B75]" />

                    <div className="p-6 sm:p-8">
                      {/* Header: logo + Trustpilot rating + quick CTA */}
                      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-6">
                        <div className="flex flex-wrap items-center gap-4">
                          <div className="flex h-[44px] w-[130px] items-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={provider.logo} alt={`${provider.name} logo`} className="max-h-full max-w-full object-contain" />
                          </div>
                          {provider.trustpilotRating && (
                            <div className="border-l border-gray-200 pl-4">
                              <TrustpilotRating
                                rating={provider.trustpilotRating}
                                reviewCount={provider.trustpilotReviewCount}
                                starSize={15}
                              />
                            </div>
                          )}
                        </div>
                        <ProviderCta
                          href={provider.affiliateUrl}
                          providerName={provider.name}
                          providerSlug={provider.id}
                          pageType="battle"
                          sourceFlow="battle_page"
                          className="inline-flex h-[42px] items-center justify-center gap-1.5 rounded-xl bg-[#0C4B75] px-5 text-[14px] font-bold text-white transition-colors hover:bg-[#093d61]"
                        >
                          Visit {provider.name}
                          <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
                        </ProviderCta>
                      </div>

                      {/* Intro */}
                      <h3 className="mb-2.5 text-[20px] font-bold text-[#191919]">
                        What is {provider.name}?
                      </h3>
                      <p className="mb-6 max-w-[820px] text-[15px] leading-[1.85] text-gray-600">
                        {lead}
                      </p>

                      {/* Trust badges */}
                      {badges.length > 0 && (
                        <div className="mb-8 flex flex-wrap gap-2">
                          {badges.map((b, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-[12px] font-semibold text-gray-600"
                            >
                              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" strokeWidth={2} />
                              {b}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* What you get + Who it's best for */}
                      <div className="mb-8 grid gap-6 sm:grid-cols-2">
                        <div>
                          <h4 className="mb-3 flex items-center gap-2 text-[15px] font-bold text-[#191919]">
                            <Check className="h-4 w-4 text-emerald-500" strokeWidth={2.5} />
                            What you get with {provider.name}
                          </h4>
                          <ul className="space-y-2">
                            {features.map((f, i) => (
                              <li key={i} className="flex items-start gap-2 text-[14px] leading-[1.6] text-gray-600">
                                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" strokeWidth={2} />
                                {f}
                              </li>
                            ))}
                          </ul>
                        </div>
                        {bestFor.length > 0 && (
                          <div>
                            <h4 className="mb-3 flex items-center gap-2 text-[15px] font-bold text-[#191919]">
                              <Sparkles className="h-4 w-4 text-[#0C4B75]" strokeWidth={2} />
                              Who {provider.name} is best for
                            </h4>
                            <ul className="space-y-2">
                              {bestFor.map((f, i) => (
                                <li key={i} className="flex items-start gap-2 text-[14px] leading-[1.6] text-gray-600">
                                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#0C4B75]" strokeWidth={2} />
                                  {f}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Pricing */}
                      {plans.length > 0 ? (
                        <div className="mb-8">
                          <h4 className="mb-1.5 text-[17px] font-bold text-[#191919]">
                            How much does {provider.name} cost?
                          </h4>
                          {review?.pricingSummary && (
                            <p className="mb-4 max-w-[820px] text-[14px] leading-[1.7] text-gray-500">
                              {review.pricingSummary}
                            </p>
                          )}
                          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {plans.map((plan, i) => (
                              <div key={i} className="rounded-xl border border-gray-200 bg-gray-50/60 p-4">
                                <p className="text-[13px] font-bold text-[#191919]">{plan.name}</p>
                                <p className="mb-2 text-[12px] text-gray-500">{plan.medication}</p>
                                <div className="flex items-baseline gap-1.5">
                                  <span className="text-[22px] font-extrabold text-[#0C4B75]">{plan.price}</span>
                                  {plan.regularPrice && (
                                    <span className="text-[13px] text-gray-400 line-through">{plan.regularPrice}</span>
                                  )}
                                  {plan.unit && <span className="text-[12px] text-gray-400">{plan.unit}</span>}
                                </div>
                                {plan.cadence && (
                                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                                    {plan.cadence}
                                  </p>
                                )}
                                {plan.highlights && plan.highlights.length > 0 && (
                                  <ul className="mt-3 space-y-1.5 border-t border-gray-200 pt-3">
                                    {plan.highlights.map((h, hi) => (
                                      <li key={hi} className="flex items-start gap-1.5 text-[12px] leading-[1.5] text-gray-500">
                                        <Check className="mt-0.5 h-3 w-3 shrink-0 text-emerald-500" strokeWidth={2} />
                                        {h}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : review?.pricingSummary ? (
                        <div className="mb-8">
                          <h4 className="mb-1.5 text-[17px] font-bold text-[#191919]">
                            How much does {provider.name} cost?
                          </h4>
                          <p className="max-w-[820px] text-[14px] leading-[1.7] text-gray-500">
                            {review.pricingSummary}
                          </p>
                        </div>
                      ) : null}

                      {/* Pros / cons */}
                      {(pros.length > 0 || cons.length > 0) && (
                        <div className="mb-8 grid gap-4 sm:grid-cols-2">
                          {pros.length > 0 && (
                            <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-5">
                              <p className="mb-3 text-[14px] font-bold text-emerald-800">
                                What we like about {provider.name}
                              </p>
                              <ul className="space-y-2">
                                {pros.map((pt, i) => (
                                  <li key={i} className="flex items-start gap-2 text-[13.5px] leading-[1.55] text-gray-700">
                                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" strokeWidth={2.5} />
                                    {pt}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {cons.length > 0 && (
                            <div className="rounded-xl border border-gray-200 bg-gray-50/60 p-5">
                              <p className="mb-3 text-[14px] font-bold text-gray-700">
                                Worth keeping in mind
                              </p>
                              <ul className="space-y-2">
                                {cons.map((c, i) => (
                                  <li key={i} className="flex items-start gap-2 text-[13.5px] leading-[1.55] text-gray-600">
                                    <Minus className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-400" strokeWidth={2} />
                                    {c}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}

                      {/* This provider's Trustpilot reviews */}
                      {reviewCount > 0 && (
                        <div className="mb-8">
                          <h4 className="mb-4 text-[17px] font-bold text-[#191919]">
                            What real {provider.name} customers are saying
                          </h4>
                          <TrustpilotCarousel
                            providerName={provider.name}
                            providerLogo={provider.logo}
                            reviews={provider.trustpilotReviews!}
                            rating={provider.trustpilotRating}
                            reviewCount={provider.trustpilotReviewCount}
                          />
                        </div>
                      )}

                      {/* Bottom CTA */}
                      <ProviderCta
                        href={provider.affiliateUrl}
                        providerName={provider.name}
                        providerSlug={provider.id}
                        pageType="battle"
                        sourceFlow="battle_page"
                        className="flex h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[#0C4B75] text-[15px] font-bold text-white transition-colors hover:bg-[#093d61]"
                      >
                        Get started with {provider.name}
                        <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                      </ProviderCta>
                    </div>
                  </section>
                );
              })}
            </div>
          </div>

          {/* ───── BOTTOM CTAs ───── */}
          <div className="mb-6 grid grid-cols-2 gap-4">
            {[
              { provider: p1, color: "from-gray-50 to-gray-50/50", hoverColor: "hover:border-[#0C4B75]/30", textColor: "text-[#191919]" },
              { provider: p2, color: "from-gray-50 to-gray-50/50", hoverColor: "hover:border-[#0C4B75]/30", textColor: "text-[#191919]" },
            ].map(({ provider, color, hoverColor, textColor }) => (
              <ProviderCta
                key={provider.id}
                href={provider.affiliateUrl}
                providerName={provider.name}
                providerSlug={provider.id}
                pageType="battle"
                sourceFlow="battle_page"
                className={`group flex flex-col items-center gap-3 rounded-2xl border border-gray-200 bg-gradient-to-b ${color} px-4 py-6 transition-all ${hoverColor} hover:shadow-md`}
              >
                <div className="flex h-[36px] w-[100px] items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={provider.logo}
                    alt={`${provider.name} logo`}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <span className={`flex items-center gap-1 text-[13px] font-bold ${textColor} group-hover:underline`}>
                  Visit Site
                  <ArrowRight className="h-3 w-3" strokeWidth={2.5} />
                </span>
              </ProviderCta>
            ))}
          </div>

          {/* ───── FAQ ───── */}
          {battleFaqs.length > 0 && (
            <div className="mb-14">
              <h2 className="mb-6 text-[24px] font-bold text-[#191919]">
                {matchupLabel}: Frequently Asked Questions
              </h2>
              <div className="divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-200 bg-white">
                {battleFaqs.map((f, i) => (
                  <div key={i} className="p-6">
                    <h3 className="mb-2 text-[16px] font-bold text-[#191919]">{f.question}</h3>
                    <p className="text-[14px] leading-[1.7] text-gray-600">{f.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ───── RELATED COMPARISONS ───── */}
          {relatedBattles.length > 0 && (
            <div className="mb-10">
              <h2 className="mb-5 text-[20px] font-bold text-[#191919]">Related Comparisons</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {relatedBattles.map(({ slug, bp1, bp2 }) => (
                  <Link
                    key={slug}
                    href={`/${slug}`}
                    className="group flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3.5 transition-colors hover:border-[#0C4B75]/30 hover:bg-[#0C4B75]/[0.02]"
                  >
                    <div className="flex items-center gap-2 text-[13px] font-bold text-[#191919]">
                      <span>{bp1.name}</span>
                      <span className="text-[11px] font-extrabold text-gray-300">VS</span>
                      <span>{bp2.name}</span>
                    </div>
                    <span className="ml-auto inline-flex items-center gap-1 text-[13px] font-semibold text-[#0C4B75] group-hover:underline">
                      Compare
                      <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Related links */}
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 py-4 text-[13px]">
            <Link href={`/reviews/${p1.id}`} className="font-semibold text-[#0C4B75] hover:underline">
              {p1.name} Review
            </Link>
            <span className="text-gray-300">|</span>
            <Link href={`/reviews/${p2.id}`} className="font-semibold text-[#0C4B75] hover:underline">
              {p2.name} Review
            </Link>
            <span className="text-gray-300">|</span>
            <Link href="/" className="font-semibold text-[#0C4B75] hover:underline">
              Compare All Providers
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
