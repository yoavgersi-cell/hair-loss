import type { Metadata } from "next";
import { getConfig } from "@/lib/config-store";
import { RatingBadge } from "@/components/rating-badge";
import Link from "next/link";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Weight Loss Provider Reviews — In-Depth Expert Analysis",
  description:
    "Read expert reviews of the top weight loss providers offering GLP-1 medications like semaglutide and tirzepatide. Compare pricing, treatment options, pros and cons.",
  alternates: {
    canonical: "https://www.tophairloss.io/reviews",
  },
  openGraph: {
    title: "Weight Loss Provider Reviews — In-Depth Expert Analysis",
    description:
      "Read expert reviews of leading weight loss providers. Compare pricing, treatment options, and customer experience.",
    url: "https://www.tophairloss.io/reviews",
  },
};

export default async function ReviewsPage() {
  const config = await getConfig();
  const { providerOrder, positions } = config.ranking;

  // Every review in the CMS is listed. Providers in the homepage ranking come
  // first (in ranking order, with their score); unranked providers follow.
  const items = (config.reviews ?? [])
    .map((review) => {
      const provider = config.providers.find((p) => p.id === review.providerId);
      if (!provider) return null;
      const rankIndex = providerOrder.indexOf(provider.id);
      const position = rankIndex >= 0 ? positions[rankIndex] || positions[positions.length - 1] : null;
      return {
        review,
        provider,
        rating: position?.score ?? null,
        ratingLabel: position?.label ?? null,
        rank: rankIndex >= 0 ? rankIndex : Number.MAX_SAFE_INTEGER,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .sort((a, b) => a.rank - b.rank);

  // JSON-LD: ItemList schema for reviews listing
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Weight Loss Provider Reviews",
    description: "Expert reviews of top weight loss providers offering GLP-1 medications.",
    numberOfItems: items.length,
    itemListElement: items.map(({ review, provider }, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `${provider.name} Review`,
      url: `https://www.tophairloss.io/reviews/${review.slug}`,
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.tophairloss.io" },
      { "@type": "ListItem", position: 2, name: "Reviews", item: "https://www.tophairloss.io/reviews" },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-[#191919] sm:text-4xl">
            Weight Loss Provider Reviews
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-gray-600">
            In-depth reviews of the top weight loss providers. Read our expert
            analysis of each program to find the best fit for your goals,
            budget, and lifestyle.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ review, provider, rating, ratingLabel }) => (
            <Link
              key={review.slug}
              href={`/reviews/${review.slug}`}
              className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-4 flex h-[50px] w-[130px] items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={provider.logo}
                  alt={`${provider.name} logo`}
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              <h2 className="text-lg font-bold text-[#191919]">
                {provider.name}
              </h2>

              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                {review.shortSummary}
              </p>

              <div className="mt-4 flex items-center justify-between">
                {rating !== null && ratingLabel !== null ? (
                  <RatingBadge rating={rating} label={ratingLabel} />
                ) : (
                  <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-500">
                    Expert Review
                  </span>
                )}
                <span className="text-sm font-semibold text-[#0C4B75] group-hover:underline">
                  Read Review
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
