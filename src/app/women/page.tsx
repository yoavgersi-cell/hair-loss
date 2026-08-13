import type { Metadata } from "next";
import { HeroSection } from "@/components/hero-section";
import { ComparisonCard } from "@/components/comparison-card";
import { SocialProofBand } from "@/components/social-proof-bubble";
import { Sidebar } from "@/components/sidebar";
import { FaqAccordion } from "@/components/faq-accordion";
import { getConfig } from "@/lib/config-store";
import type { FaqItem, Provider } from "@/lib/config";

export const revalidate = 60;

const CANONICAL = "https://www.tophairloss.io/women";

export const metadata: Metadata = {
  title: {
    absolute: "Best Hair Loss Treatments for Women 2026 — Compare Top Providers",
  },
  description:
    "Compare the best hair loss treatments for women in 2026. Top women's hair loss providers ranked by treatments, medical support, pricing, and results — find your best fit.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Best Hair Loss Treatments for Women 2026 — Compare Top Providers",
    description:
      "Compare the best women's hair loss treatments of 2026 — top providers ranked by treatments, support, and value.",
    url: CANONICAL,
    type: "website",
  },
};

// Curated women's hub lineup. Each entry references an existing provider by id
// and overrides the display copy so the card speaks to women (the underlying
// provider data is written men-first). "hims" surfaces as its women's brand,
// Hers. Order here is the women's ranking order.
const WOMEN_LINEUP: {
  id: string;
  name: string;
  logo: string;
  smallLogo: string;
  tagline: string;
  highlights: string[];
}[] = [
  {
    id: "hims",
    name: "Hers",
    logo: "/logos/hers.svg",
    smallLogo: "/logos/hers-icon.svg",
    tagline: "Big-brand women's hair care — Rx minoxidil, oral options & more, from ~$25/mo",
    highlights: [
      "Prescription minoxidil (topical & oral) for women",
      "100% online — doctor consult, discreet home delivery",
      "Also hair-strengthening supplements & shampoos",
    ],
  },
  {
    id: "nutrafol",
    name: "Nutrafol",
    logo: "/logos/nutrafol.svg",
    smallLogo: "/logos/nutrafol-icon.svg",
    tagline: "Drug-free, physician-formulated hair growth supplement for women",
    highlights: [
      "Drug-free nutraceutical — no minoxidil or Rx needed",
      "Formulas for women's life stages (postpartum, menopause)",
      "Clinically tested to improve hair growth & thickness",
    ],
  },
  {
    id: "happyhead",
    name: "Happy Head",
    logo: "/logos/happyhead.svg",
    smallLogo: "/logos/happyhead-icon.svg",
    tagline: "Dermatologist-formulated custom hair loss Rx for women — topical & oral",
    highlights: [
      "Personalized topical formulas (minoxidil & more)",
      "Dermatologist-founded; prescription strength",
      "Custom treatment tailored to women's hair loss",
    ],
  },
];

const WOMEN_FAQS: FaqItem[] = [
  {
    question: "What is the best hair loss treatment for women?",
    answer:
      "For most women, topical or oral minoxidil is the first-line, FDA-supported option and has the strongest evidence for regrowing hair. Some women are also prescribed spironolactone, and drug-free supplements like Nutrafol can support results. The right choice depends on your pattern of loss, medical history, and whether you prefer a prescription or a supplement — comparing providers side by side is the fastest way to narrow it down.",
  },
  {
    question: "Does minoxidil work for women?",
    answer:
      "Yes. Minoxidil is the most widely used and best-studied hair loss treatment for women, available as a topical solution/foam or as low-dose oral minoxidil prescribed off-label. Most women who respond see reduced shedding within a few months and visible regrowth by 6–12 months. Consistency matters — results fade if you stop.",
  },
  {
    question: "Can women take finasteride for hair loss?",
    answer:
      "Finasteride is mainly a men's treatment and is generally avoided in women who are pregnant or may become pregnant because of birth-defect risk. Some post-menopausal women are prescribed it off-label under close medical supervision, but minoxidil and spironolactone are the more common options for women. Always follow a licensed provider's guidance.",
  },
  {
    question: "How long until women see results from hair loss treatment?",
    answer:
      "Expect to give any treatment at least 3–6 months before judging it, with fuller results around 12 months. Early on you may notice less shedding before you see regrowth. Because hair grows slowly, patience and consistency are the biggest factors in success.",
  },
  {
    question: "Are hair growth supplements like Nutrafol worth it for women?",
    answer:
      "For women who prefer a drug-free option — or want to complement minoxidil — physician-formulated supplements like Nutrafol have clinical studies supporting improved hair growth and thickness, with formulas targeted to life stages such as postpartum and menopause. They work best as a consistent, long-term routine rather than a quick fix.",
  },
];

export default async function WomenPage() {
  const config = await getConfig();
  const { positions } = config.ranking;

  const providerById = new Map(config.providers.map((p) => [p.id, p]));

  const displayList = WOMEN_LINEUP.map((entry, index) => {
    const base = providerById.get(entry.id);
    const position = positions[index] || positions[positions.length - 1];
    return {
      id: entry.id,
      name: entry.name,
      tagline: entry.tagline,
      logo: entry.logo,
      smallLogo: entry.smallLogo,
      highlights: entry.highlights,
      affiliateUrl: base?.affiliateUrl || "#",
      ctaText: base?.ctaText || "View Plans",
      rank: index + 1,
      rating: position.score,
      ratingLabel: position.label,
      starRating: position.starRating,
      badge: index === 0 ? "Our Most Popular" : undefined,
    };
  });

  // Sidebar providers: same women lineup, shaped as Provider so the sidebar's
  // Editorial Reviews block renders the women brand names/logos.
  const sidebarProviders: Provider[] = WOMEN_LINEUP.map((entry) => {
    const base = providerById.get(entry.id);
    return {
      id: entry.id,
      name: entry.name,
      tagline: entry.tagline,
      logo: entry.logo,
      smallLogo: entry.smallLogo,
      highlights: entry.highlights,
      affiliateUrl: base?.affiliateUrl || "#",
      ctaText: base?.ctaText || "View Plans",
    };
  });

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: WOMEN_FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Best Hair Loss Treatments for Women 2026 — Compare Top Providers",
    description:
      "Compare pricing, treatments, and medical support across the top hair loss providers for women in 2026.",
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
        backgroundImageUrl=""
        imageAlt="Woman with thick, healthy hair"
        updatedLabel={config.hero.updatedLabel}
        h1="Best Hair Loss Treatments for Women in 2026"
        h2="Compare the top women's hair loss treatments, side by side"
        description="Compare women's hair loss providers on treatments, medical support, pricing, and real results — and find the one that's right for you."
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

      <WomenEditorial />
      <FaqAccordion items={WOMEN_FAQS} />
    </>
  );
}

function WomenEditorial() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-10">
      <div className="prose-none max-w-[820px] space-y-6 text-[15px] leading-[1.7] text-gray-700">
        <div>
          <h2 className="mb-3 text-[24px] font-bold text-[#191919]">
            Hair Loss Treatments for Women: What Actually Works
          </h2>
          <p>
            Hair loss affects a huge number of women — from gradual thinning along the part line to
            shedding triggered by postpartum changes, menopause, stress, or thyroid issues. The good
            news: several treatments have real clinical evidence behind them, and most are available
            online through licensed providers. The key is matching the treatment to your type of hair
            loss and staying consistent.
          </p>
        </div>

        <div>
          <h3 className="mb-2 text-[19px] font-semibold text-[#191919]">Minoxidil — the first-line option</h3>
          <p>
            Minoxidil is the most studied and most widely recommended hair loss treatment for women.
            It comes as a topical solution or foam, or as low-dose <em>oral</em> minoxidil prescribed
            off-label. It works by extending the hair&apos;s growth phase, and most women who respond
            see less shedding within a few months and visible regrowth by 6–12 months. Providers like
            Hers and Happy Head make it easy to start topical or oral minoxidil online.
          </p>
        </div>

        <div>
          <h3 className="mb-2 text-[19px] font-semibold text-[#191919]">Spironolactone &amp; prescription options</h3>
          <p>
            For hormonally-driven thinning, some women are prescribed spironolactone, which reduces the
            effect of androgens on the hair follicle. Because it requires a prescription and medical
            oversight, it&apos;s offered through telehealth providers after an online consult.
            Finasteride — a mainstay for men — is generally avoided in women of childbearing age due to
            pregnancy risks, so it&apos;s only used in select cases under a doctor&apos;s guidance.
          </p>
        </div>

        <div>
          <h3 className="mb-2 text-[19px] font-semibold text-[#191919]">Drug-free supplements</h3>
          <p>
            If you&apos;d rather avoid a prescription — or want to complement minoxidil — physician-
            formulated supplements like Nutrafol have clinical studies showing improved hair growth and
            thickness. Nutrafol offers women&apos;s formulas tailored to life stages such as postpartum
            and menopause. Supplements work best as a steady, long-term routine.
          </p>
        </div>

        <div>
          <h3 className="mb-2 text-[19px] font-semibold text-[#191919]">How long until you see results?</h3>
          <p>
            Give any treatment at least 3–6 months before judging it, with fuller results around 12
            months. Hair grows slowly, so patience and consistency matter more than any single product.
            Compare the providers above to find the treatment and price that fit your goals.
          </p>
        </div>
      </div>
    </section>
  );
}
