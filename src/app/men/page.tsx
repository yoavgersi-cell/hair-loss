import type { Metadata } from "next";
import { HeroSection } from "@/components/hero-section";
import { ComparisonCard } from "@/components/comparison-card";
import { SocialProofBand } from "@/components/social-proof-bubble";
import { Sidebar } from "@/components/sidebar";
import { EditorialContent } from "@/components/editorial-content";
import { FaqAccordion } from "@/components/faq-accordion";
import { getConfig } from "@/lib/config-store";

export const revalidate = 60;

const CANONICAL = "https://www.tophairloss.io/men";

// Men's hub — the dedicated men's hair loss page. Targets the high-intent
// "hair loss treatment for men" commercial queries. Reads the CMS-editable
// hero (config.hero holds the men's copy).
export const metadata: Metadata = {
  title: {
    absolute: "Best Hair Loss Treatments for Men 2026 — Compare Top Providers",
  },
  description:
    "Compare the best hair loss treatments for men in 2026. Top men's hair loss providers ranked by pricing, medications, medical support, and value — find your best fit.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Best Hair Loss Treatments for Men 2026 — Compare Top Providers",
    description:
      "Compare the best men's hair loss treatments of 2026 — top providers ranked by price, support, and value.",
    url: CANONICAL,
    type: "website",
  },
};

export default async function MenPage() {
  const config = await getConfig();
  const { providerOrder, positions } = config.ranking;

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

  const sidebarProviders = providerOrder
    .map((id) => config.providers.find((p) => p.id === id))
    .filter(Boolean) as typeof config.providers;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: config.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Best Hair Loss Treatments for Men 2026 — Compare Top Providers",
    description:
      "Compare pricing, medications, medical support, and overall value across the top hair loss providers for men in 2026.",
    url: CANONICAL,
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
