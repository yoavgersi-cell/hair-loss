import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/hero-section";
import { ComparisonCard } from "@/components/comparison-card";
import { SocialProofBand } from "@/components/social-proof-bubble";
import { Sidebar } from "@/components/sidebar";
import { FaqAccordion } from "@/components/faq-accordion";
import { AudiencePopup } from "@/components/audience-popup";
import { getConfig } from "@/lib/config-store";

export const revalidate = 60;

// Generic main hub. Targets the broad "best hair loss treatments" query and
// acts as the brand entry point + segmenter into the men's and women's hubs.
export const metadata: Metadata = {
  title: {
    absolute: "Best Hair Loss Treatments & Providers 2026 — Compare Top Providers",
  },
  description:
    "Compare the best hair loss treatments and providers of 2026 for men and women. Top providers ranked by pricing, medications, medical support, and value — find your best fit.",
  alternates: { canonical: "https://www.tophairloss.io" },
  openGraph: {
    title: "Best Hair Loss Treatments & Providers 2026 — Compare Top Providers",
    description:
      "Compare the best hair loss treatments and providers of 2026 for men and women — ranked by price, support, and value.",
    url: "https://www.tophairloss.io",
    type: "website",
  },
};

export default async function HomePage() {
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
    name: "Top Hair Loss Providers 2026 — Compare Trusted Providers Side by Side",
    description:
      "Compare pricing, medications, medical support, and overall value across the top hair loss providers of 2026 for men and women.",
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
      <AudiencePopup />
      <HeroSection
        backgroundImageUrl="/hero.png"
        imageAlt="Healthy, thick hair"
        updatedLabel={config.hero.updatedLabel}
        h1="Best Hair Loss Treatments in 2026"
        h2="Compare the top hair loss treatments for men & women"
        description="Compare trusted hair loss providers on pricing, treatments, and medical support — and find the right option, whether you're a man or a woman."
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

      <GeneralEditorial />
      <FaqAccordion items={config.faqs} />
    </>
  );
}

function GeneralEditorial() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-10">
      <div className="max-w-[820px] space-y-6 text-[15px] leading-[1.7] text-gray-700">
        <div>
          <h2 className="mb-3 text-[24px] font-bold text-[#191919]">
            How to Choose a Hair Loss Treatment in 2026
          </h2>
          <p>
            Hair loss is one of the most common concerns for both men and women — and today there are
            more effective, science-backed treatments available online than ever before. The best
            option for you depends on the cause of your hair loss, your gender, how far it&apos;s
            progressed, and whether you prefer a prescription or a drug-free approach. Below we break
            down the essentials, then compare the top providers side by side.
          </p>
        </div>

        <div>
          <h3 className="mb-2 text-[19px] font-semibold text-[#191919]">Men&apos;s vs women&apos;s hair loss — different paths</h3>
          <p>
            The single most important factor is who the treatment is for. Men&apos;s hair loss is
            usually driven by DHT and treated with finasteride plus minoxidil. Women generally
            can&apos;t use finasteride the same way and lean on minoxidil, spironolactone, and drug-free
            supplements. That&apos;s why we split our recommendations into dedicated hubs —{" "}
            <Link href="/men" className="font-semibold text-[#0B5E9E] hover:underline">treatments for men</Link>{" "}
            and{" "}
            <Link href="/women" className="font-semibold text-[#0B5E9E] hover:underline">treatments for women</Link>{" "}
            — so you only see the options built for you.
          </p>
        </div>

        <div>
          <h3 className="mb-2 text-[19px] font-semibold text-[#191919]">Prescription vs drug-free</h3>
          <p>
            Prescription treatments like finasteride, minoxidil, and spironolactone have the strongest
            clinical evidence and are prescribed online after a quick consult. Drug-free options —
            physician-formulated supplements like Nutrafol — appeal to people who want to avoid a
            prescription or complement one. Many of the top providers offer both.
          </p>
        </div>

        <div>
          <h3 className="mb-2 text-[19px] font-semibold text-[#191919]">Oral vs topical</h3>
          <p>
            Most treatments come as a topical (applied to the scalp) or an oral (a pill). Topicals act
            locally with fewer systemic effects; orals are more convenient and, for some, more
            effective. The right format is a personal choice you can make with the provider&apos;s
            medical team.
          </p>
        </div>

        <div>
          <h3 className="mb-2 text-[19px] font-semibold text-[#191919]">How long until it works?</h3>
          <p>
            Whatever you choose, give it at least 3–6 months before judging results, with fuller
            regrowth around 12 months. Hair grows slowly, so consistency matters more than any single
            product. Use the comparison above — or jump to the{" "}
            <Link href="/men" className="font-semibold text-[#0B5E9E] hover:underline">men&apos;s</Link>{" "}
            or{" "}
            <Link href="/women" className="font-semibold text-[#0B5E9E] hover:underline">women&apos;s</Link>{" "}
            hub — to find the treatment and price that fit your goals.
          </p>
        </div>
      </div>
    </section>
  );
}
