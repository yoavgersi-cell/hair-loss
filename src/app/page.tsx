import type { Metadata } from "next";
import { HeroSection } from "@/components/hero-section";
import { ComparisonCard } from "@/components/comparison-card";
import { SocialProofBand } from "@/components/social-proof-bubble";
import { Sidebar } from "@/components/sidebar";
import { EditorialContent } from "@/components/editorial-content";
import { FaqAccordion } from "@/components/faq-accordion";
import { getConfig } from "@/lib/config-store";

export const revalidate = 60;

// Homepage-specific metadata targeting the high-intent "best hair loss"
// commercial queries (best hair loss injections / programs / providers).
export const metadata: Metadata = {
  title: {
    absolute: "Best Hair Loss Treatments & Providers 2026 — Compare Top Providers",
  },
  description:
    "Compare the best hair loss treatments and providers of 2026. Top hair loss providers ranked by pricing, medications, medical support, and value — find your best fit.",
  alternates: { canonical: "https://www.tophairloss.io" },
  openGraph: {
    title: "Best Hair Loss Treatments & Providers 2026 — Compare Top Providers",
    description:
      "Compare the best hair loss treatments and providers of 2026 — top hair loss providers ranked by price, support, and value.",
    url: "https://www.tophairloss.io",
    type: "website",
  },
};

export default async function HomePage() {
  const config = await getConfig();
  const { providerOrder, positions } = config.ranking;

  // Build display list by merging provider data with ranking position data
  const displayList = providerOrder
    .map((id, index) => {
      const provider = config.providers.find((p) => p.id === id);
      if (!provider) return null;
      const position = positions[index] || positions[positions.length - 1];
      return {
        id: provider.id,
        name: provider.name,
        tagline: provider.tagline,
        logo: provider.logo,
        smallLogo: provider.smallLogo,
        highlights: provider.highlights,
        affiliateUrl: provider.affiliateUrl,
        ctaText: provider.ctaText,
        rank: index + 1,
        rating: position.score,
        ratingLabel: position.label,
        starRating: position.starRating,
        badge: position.badge,
      };
    })
    .filter(Boolean) as Array<{
      id: string;
      name: string;
      tagline: string;
      logo: string;
      smallLogo: string;
      highlights: string[];
      affiliateUrl: string;
      ctaText: string;
      rank: number;
      rating: number;
      ratingLabel: string;
      badge?: string;
    }>;

  // Build sidebar providers in ranking order
  const sidebarProviders = providerOrder
    .map((id) => config.providers.find((p) => p.id === id))
    .filter(Boolean) as typeof config.providers;

  // JSON-LD: FAQPage schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: config.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  // JSON-LD: WebPage + ItemList for comparison
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Top Hair Loss Providers 2026 — Compare Trusted Providers Side by Side",
    description:
      "Compare pricing, medications, medical support, and overall value across the top hair loss providers of 2026.",
    url: "https://www.tophairloss.io",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: displayList.map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: product.name,
        url: `https://www.tophairloss.io/reviews/${product.id}`,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <HeroSection
        backgroundImageUrl={config.hero.backgroundImageUrl}
        imageAlt={config.hero.imageAlt}
        updatedLabel={config.hero.updatedLabel}
        h1={config.hero.h1}
        h2={config.hero.h2}
        description={config.hero.description}
      />

      <section className="mx-auto max-w-[1200px] px-4 pt-6 pb-6">
        <div className="flex gap-6 items-start">
          <div className="min-w-0 flex-1 space-y-4">
            {displayList.map((product, idx) => (
              <div key={product.id}>
                <ComparisonCard product={product} socialProof={config.cardSocialProof} />
                {idx === 0 && config.cardSocialProof && (
                  <SocialProofBand number={config.cardSocialProof.number} text={config.cardSocialProof.text} />
                )}
              </div>
            ))}
          </div>
          <Sidebar config={config.sidebar} providers={sidebarProviders} />
        </div>
      </section>

      <EditorialContent />
      <FaqAccordion items={config.faqs} />
    </>
  );
}
