import { HeroSection } from "@/components/hero-section";
import { ComparisonCard } from "@/components/comparison-card";
import { SocialProofBand } from "@/components/social-proof-bubble";
import { Sidebar } from "@/components/sidebar";
import { FaqAccordion } from "@/components/faq-accordion";
import type { SiteConfig } from "@/lib/config";

interface ComparisonLayoutProps {
  config: SiteConfig;
  heroOverrides?: {
    h1?: string;
    h2?: string;
    description?: string;
    updatedLabel?: string;
  };
  children?: React.ReactNode;
}

export function ComparisonLayout({ config, heroOverrides, children }: ComparisonLayoutProps) {
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

  return (
    <>
      <HeroSection
        backgroundImageUrl={config.hero.backgroundImageUrl}
        imageAlt={config.hero.imageAlt}
        updatedLabel={heroOverrides?.updatedLabel ?? config.hero.updatedLabel}
        h1={heroOverrides?.h1 ?? config.hero.h1}
        h2={heroOverrides?.h2 ?? config.hero.h2}
        description={heroOverrides?.description ?? config.hero.description}
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

      {children}

      <FaqAccordion items={config.faqs} />
    </>
  );
}
