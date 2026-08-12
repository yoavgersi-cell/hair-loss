import { put, list } from "@vercel/blob";
import { type SiteConfig, type ReviewData, type ArticleData, type BattleData, type LandingPageData, type TrustpilotReview, type Expert, defaultConfig } from "./config";
import productsJson from "@/data/products.json";
import faqsJson from "@/data/faqs.json";
import { articles as defaultArticlesData } from "@/data/articles";

const BLOB_KEY = "site-config.json";


// Default Trustpilot reviews per provider id. Empty until real reviews are
// added from screenshots; the admin CMS then takes precedence.
const seedTrustpilot: Record<string, { rating?: string; reviewCount?: string; reviews: TrustpilotReview[] }> = {};

const defaultReviews: ReviewData[] = [
  {
    slug: "hims",
    providerId: "hims",
    shortSummary: "Big-brand telehealth offering the full men's hair loss toolkit — Rx finasteride and minoxidil, a 2-in-1 topical spray, DHT-blocking shampoo, and supplements.",
    reviewIntro: "Hims is one of the most recognized names in men's telehealth, and its hair loss line covers the full range of proven and supporting treatments. After a quick online consultation, a licensed provider can prescribe oral finasteride, topical or oral minoxidil, or a combined finasteride + minoxidil spray — all delivered discreetly to your door. Hims rounds this out with a DHT-blocking shampoo, biotin gummies, and thickening products.",
    keyFeatures: [
      "Rx finasteride (1mg) and minoxidil",
      "2-in-1 finasteride + minoxidil topical spray",
      "DHT-blocking shampoo, biotin gummies & thickening products",
      "100% online consult with a licensed provider",
      "Discreet, subscription-based home delivery",
    ],
    pricingSummary: "Hims uses subscription pricing that varies by treatment — generic finasteride starts around $20/month and minoxidil around $15/month, with bundles and multi-month plans lowering the effective cost. No insurance is required; you pay a flat monthly rate that includes the medication and provider oversight.",
    treatmentOptions: [
      "Oral finasteride (1mg)",
      "Topical & oral minoxidil",
      "Finasteride + minoxidil topical spray",
      "DHT-blocking shampoo and supplements",
    ],
    pros: [
      "Widest range of hair loss options in one place",
      "Well-established, trusted consumer brand",
      "Combined spray simplifies a two-drug routine",
      "Discreet packaging and easy subscription",
      "Frequent intro offers and bundles",
    ],
    cons: [
      "Subscriptions can add up across multiple products",
      "Upsells for adjacent products",
      "Finasteride is men-only (not for women)",
    ],
    bestFor: [
      "Men who want everything from one recognizable brand",
      "Anyone who prefers a combined spray over separate products",
      "People who value a polished, well-known platform",
    ],
    finalVerdict: "Hims is a strong all-rounder for men's hair loss — it offers the proven medications (finasteride and minoxidil) plus the widest set of supporting products, all through a slick, trusted platform. If you want one recognizable brand to handle your whole routine, Hims is hard to beat; the main watch-out is stacking multiple subscriptions.",
  },
  {
    slug: "keeps",
    providerId: "keeps",
    shortSummary: "Affordable, hair-loss-focused telehealth for men — generic finasteride and minoxidil with online doctor consults and a simple subscription.",
    reviewIntro: "Keeps is built specifically around men's hair loss, which keeps its lineup focused and its prices low. After an online consultation with a licensed physician, Keeps prescribes generic finasteride, minoxidil, or both — plus a ketoconazole shampoo — shipped to your door on a subscription. Its single-minded focus on hair loss makes it one of the most straightforward, budget-friendly options.",
    keyFeatures: [
      "Generic finasteride and minoxidil",
      "Ketoconazole (DHT-targeting) shampoo",
      "Online consultation with a licensed physician",
      "Hair-loss-focused — no unrelated products",
      "Discreet home delivery on a subscription",
    ],
    pricingSummary: "Keeps is priced for affordability — generic finasteride starts around $25/month and minoxidil around $15/month, with lower effective pricing on longer plans. No insurance is required; the flat monthly cost includes medication and provider oversight.",
    treatmentOptions: [
      "Generic oral finasteride (1mg)",
      "Topical minoxidil (2% / 5%)",
      "Combined finasteride + minoxidil",
      "Ketoconazole shampoo",
    ],
    pros: [
      "Among the most affordable options",
      "Single-minded focus on men's hair loss",
      "Simple, no-frills subscription",
      "Licensed physician oversight",
      "Discreet packaging",
    ],
    cons: [
      "Men-only — not intended for women",
      "Fewer supporting products than bigger brands",
      "Telehealth only — no in-person care",
    ],
    bestFor: [
      "Budget-conscious men focused purely on hair loss",
      "Those who want a simple finasteride + minoxidil routine",
      "Anyone who prefers a focused platform over a broad one",
    ],
    finalVerdict: "Keeps does one thing and does it well: affordable, no-nonsense men's hair loss treatment. With generic finasteride and minoxidil, physician oversight, and low subscription pricing, it's an excellent starting point for men who want the proven basics without paying for extras.",
  },
  {
    slug: "roman",
    providerId: "roman",
    shortSummary: "Clinician-guided men's-health telehealth (from Ro) offering finasteride, minoxidil, and combined hair loss treatment with discreet delivery.",
    reviewIntro: "Roman — the men's-health brand from Ro — brings an established, clinician-guided telehealth experience to hair loss. A licensed provider reviews your online visit before prescribing finasteride, minoxidil, or a combined regimen, which ships discreetly to your door. As part of the larger Ro platform, Roman pairs a polished process with the credibility of a well-known telehealth company.",
    keyFeatures: [
      "Finasteride, minoxidil & combined treatment",
      "Licensed providers review every plan",
      "Part of the established Ro telehealth platform",
      "Discreet packaging with free shipping",
      "Ongoing provider support and adjustments",
    ],
    pricingSummary: "Roman uses transparent subscription pricing that varies by treatment, with finasteride and minoxidil in line with other major telehealth brands and discounts on longer plans. No insurance is required; medication and provider oversight are included in the monthly cost.",
    treatmentOptions: [
      "Oral finasteride (1mg)",
      "Topical minoxidil",
      "Combined finasteride + minoxidil",
      "Provider-guided plan adjustments",
    ],
    pros: [
      "Backed by the established Ro platform",
      "Clinician-guided from start to finish",
      "Clean, streamlined online experience",
      "Discreet packaging and free shipping",
      "Strong brand trust",
    ],
    cons: [
      "Men-focused men's-health brand",
      "Fewer hair-specific extras than niche brands",
      "Pricing can run higher than budget options",
    ],
    bestFor: [
      "Men who value an established, trusted telehealth brand",
      "Those who want clinician-guided, streamlined care",
      "Anyone already using Ro for other men's-health needs",
    ],
    finalVerdict: "Roman is a dependable, well-run choice for men's hair loss, pairing the proven medications with the credibility and polish of the Ro platform. It may not have the niche extras of hair-only brands, but for clinician-guided care from a trusted name, it's a solid pick.",
  },
  {
    slug: "happyhead",
    providerId: "happyhead",
    shortSummary: "Dermatologist-founded telehealth offering custom-compounded hair loss formulas — personalized topical and oral treatments for men and women.",
    reviewIntro: "Happy Head takes a more personalized, dermatologist-led approach to hair loss. Founded by board-certified dermatologists, it formulates custom prescription treatments — topical solutions that can combine minoxidil, finasteride, and other actives, plus oral options — tailored to your specific pattern of loss. Unlike the men-only focus of many competitors, Happy Head treats both men and women.",
    keyFeatures: [
      "Custom-compounded topical formulas (minoxidil, finasteride & more)",
      "Oral treatment options available",
      "Dermatologist-founded and formulated",
      "Personalized to your hair loss pattern",
      "Treats both men and women",
    ],
    pricingSummary: "Happy Head sits at the premium end — its custom-compounded prescription formulas typically start around $35-$79/month depending on the topical or oral plan, reflecting the personalized, multi-ingredient approach. No insurance is required; the monthly cost includes the compounded medication and provider oversight.",
    treatmentOptions: [
      "Custom topical (minoxidil + finasteride + additional actives)",
      "Oral minoxidil",
      "Oral finasteride / dutasteride options",
      "Personalized formulas for men and women",
    ],
    pros: [
      "Dermatologist-founded, prescription-strength formulas",
      "Personalized, multi-ingredient topicals",
      "Treats both men and women",
      "Goes beyond the standard two-drug routine",
      "Custom oral options available",
    ],
    cons: [
      "Premium pricing versus generic-only options",
      "Custom formulas take longer to prepare and ship",
      "More than most beginners need to start",
    ],
    bestFor: [
      "People who want a dermatologist-designed, custom formula",
      "Women seeking prescription hair loss treatment",
      "Anyone who hasn't responded to standard finasteride/minoxidil",
    ],
    finalVerdict: "Happy Head is the pick for a personalized, dermatologist-led approach — its custom-compounded topicals and oral options go beyond the one-size-fits-all routine, and it's one of the few that treats women as well as men. You'll pay more than for generics, but for tailored, prescription-strength care it stands out.",
  },
];

// ───── Brand casing normalization ─────
// Canonical provider names (keyed by provider id or normalized name).
const CANONICAL_NAMES: Record<string, string> = {
  hims: "Hims",
  keeps: "Keeps",
  roman: "Roman",
  happyhead: "Happy Head",
};

// Wrong-cased brand mentions inside display text. "Shed"/"Embody" only match
// the capitalized form (lowercase are common English verbs); "Found" is not
// text-replaced at all for the same reason — only the provider name field.
const BRAND_TEXT_FIXES: [RegExp, string][] = [];

function fixBrandText(s: string): string {
  // Skip all-lowercase single-token matches (likely slugs/URLs in HTML bodies)
  return BRAND_TEXT_FIXES.reduce(
    (acc, [re, to]) => acc.replace(re, (m) => (m === m.toLowerCase() && !/\s/.test(m) ? m : to)),
    s
  );
}
const fixBrandArr = (a?: string[]) => a?.map(fixBrandText) ?? [];

function normalizeBrandCasing(config: SiteConfig): SiteConfig {
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
  return {
    ...config,
    providers: config.providers.map((p) => ({
      ...p,
      name: CANONICAL_NAMES[p.id] ?? CANONICAL_NAMES[norm(p.name)] ?? p.name,
      tagline: fixBrandText(p.tagline),
    })),
    faqs: config.faqs.map((f) => ({ ...f, question: fixBrandText(f.question), answer: fixBrandText(f.answer) })),
    reviews: config.reviews.map((r) => ({
      ...r,
      shortSummary: fixBrandText(r.shortSummary),
      reviewIntro: fixBrandText(r.reviewIntro),
      keyFeatures: fixBrandArr(r.keyFeatures),
      pricingSummary: fixBrandText(r.pricingSummary),
      treatmentOptions: fixBrandArr(r.treatmentOptions),
      pros: fixBrandArr(r.pros),
      cons: fixBrandArr(r.cons),
      bestFor: fixBrandArr(r.bestFor),
      finalVerdict: fixBrandText(r.finalVerdict),
    })),
    battles: config.battles.map((b) => ({
      ...b,
      title: fixBrandText(b.title),
      subtitle: fixBrandText(b.subtitle ?? ""),
      description: fixBrandText(b.description),
      intro: fixBrandText(b.intro),
      verdict: fixBrandText(b.verdict),
      verdictWinnerPoints: fixBrandArr(b.verdictWinnerPoints),
      verdictLoserPoints: fixBrandArr(b.verdictLoserPoints),
      categories: b.categories.map((c) => ({
        ...c,
        name: fixBrandText(c.name),
        explanation: fixBrandText(c.explanation),
        supportingPoints: fixBrandArr(c.supportingPoints),
      })),
      features: (b.features ?? []).map((f) => ({
        ...f,
        feature: fixBrandText(f.feature),
        provider1Value: fixBrandText(f.provider1Value),
        provider2Value: fixBrandText(f.provider2Value),
      })),
    })),
    articles: config.articles.map((a) => ({
      ...a,
      title: fixBrandText(a.title),
      description: fixBrandText(a.description),
      sections: a.sections.map((s) => ({ ...s, heading: fixBrandText(s.heading), body: fixBrandText(s.body) })),
    })),
    landingPages: (config.landingPages ?? []).map((lp) => ({
      ...lp,
      seoTitle: fixBrandText(lp.seoTitle),
      seoDescription: fixBrandText(lp.seoDescription),
      h1: fixBrandText(lp.h1),
      h2: fixBrandText(lp.h2),
      heroDescription: fixBrandText(lp.heroDescription),
      editorialSections: lp.editorialSections?.map((s) => ({
        ...s,
        heading: fixBrandText(s.heading),
        body: fixBrandText(s.body),
        bullets: s.bullets ? fixBrandArr(s.bullets) : undefined,
      })),
    })),
  };
}

// Placeholder editorial team — REPLACE with real team members in the admin.
// Uses initials avatars and editorial/research roles (no fabricated medical
// licenses). Add real credentials only for people who actually hold them.
const defaultExperts: Expert[] = [
  {
    id: "research-team",
    name: "The TopHairLoss Research Team",
    role: "Editorial & Research",
    bio: "Our independent research team compares weight-loss providers across pricing, medications, medical oversight, and real customer experience. We update our analysis regularly and rank providers on the evidence — not on who pays us.",
    specialties: ["Provider comparison", "GLP-1 treatment", "Pricing analysis"],
  },
  {
    id: "content-reviewer",
    name: "Editorial Review Desk",
    role: "Clinical Content Reviewer",
    bio: "Every provider review and comparison is checked for accuracy and clarity before it publishes, and revisited as programs, pricing, and medications change.",
    specialties: ["Accuracy review", "Editorial standards"],
  },
];

// ───── Hair-loss comparison battles ─────
// Winners reflect genuine merits for a typical searcher; easy to flip per
// affiliate economics by changing winnerId + the verdict framing.

const himsKeepsBattle: BattleData = {
  slug: "hims-vs-keeps",
  provider1Id: "hims",
  provider2Id: "keeps",
  title: "Hims vs Keeps: Which Hair Loss Treatment Wins in 2026?",
  subtitle: "Hims vs Keeps, compared on price, treatments, and overall value — to see which men's hair loss service comes out ahead.",
  description: "Hims vs Keeps compared on price, finasteride & minoxidil options, and value. Keeps is cheaper and hair-loss-focused; Hims offers more products and a 2-in-1 spray. See which wins in 2026.",
  intro: "Hims and Keeps are two of the most popular telehealth services for men's hair loss, and both are built on the same proven medications — finasteride and minoxidil — prescribed after an online doctor consult. Keeps is laser-focused on hair loss and priced to be affordable, while Hims offers a broader range including a combined finasteride + minoxidil spray, a DHT-blocking shampoo, and supplements. Here's how they compare.",
  verdict: "Both are legitimate, well-run services built on the same core medications — but Hims takes this one for most people on range and convenience. It offers the widest set of treatments, a 2-in-1 spray that simplifies your routine, and a polished, trusted platform. Keeps is the better pick if your priority is the lowest price on a focused finasteride + minoxidil routine.",
  verdictWinnerPoints: [
    "Widest range — 2-in-1 spray, shampoo, supplements & more",
    "Combined finasteride + minoxidil topical spray",
    "Polished, well-known consumer brand",
  ],
  verdictLoserPoints: [
    "Among the most affordable options",
    "Single-minded focus on men's hair loss",
    "Simple, no-frills subscription",
  ],
  winnerId: "hims",
  categories: [
    {
      name: "Pricing & Value",
      winner: "provider2",
      explanation: "Keeps is built around affordability — generic finasteride starts around $25/month and minoxidil around $15/month. Hims is competitively priced with bundles and intro offers, but Keeps generally comes in a little lower for the core routine.",
      supportingPoints: [
        "Generic finasteride from ~$25/mo (Keeps)",
        "Minoxidil from ~$15/mo (Keeps)",
        "Bundles and intro offers (Hims)",
        "No insurance required (both)",
      ],
    },
    {
      name: "Treatment Range",
      winner: "provider1",
      explanation: "Hims offers the broader lineup — oral finasteride, topical and oral minoxidil, a combined spray, a DHT-blocking shampoo, biotin gummies, and thickening products. Keeps keeps it focused on finasteride, minoxidil, and a ketoconazole shampoo.",
      supportingPoints: [
        "Finasteride, minoxidil, spray, shampoo, supplements (Hims)",
        "Combined 2-in-1 topical spray (Hims)",
        "Finasteride, minoxidil, ketoconazole shampoo (Keeps)",
        "Rx after an online consult (both)",
      ],
    },
    {
      name: "Convenience & Routine",
      winner: "provider1",
      explanation: "Hims's 2-in-1 finasteride + minoxidil spray combines two treatments into one daily step, which many users find easier to stick with. Keeps uses separate finasteride and minoxidil products.",
      supportingPoints: [
        "2-in-1 spray = one daily step (Hims)",
        "Broad product ecosystem (Hims)",
        "Separate finasteride + minoxidil (Keeps)",
        "Discreet home delivery (both)",
      ],
    },
    {
      name: "Focus",
      winner: "provider2",
      explanation: "Keeps does one thing — men's hair loss — with no unrelated products or upsells, which keeps the experience simple. Hims spans many categories beyond hair, which adds range but also cross-sells.",
      supportingPoints: [
        "Hair-loss-only, no unrelated upsells (Keeps)",
        "Simple, focused experience (Keeps)",
        "Broad multi-category platform (Hims)",
        "Licensed provider oversight (both)",
      ],
    },
    {
      name: "Brand & Platform",
      winner: "provider1",
      explanation: "Hims is a large, publicly traded consumer brand with a highly polished app and site. Keeps is a well-regarded hair-loss specialist (part of Thirty Madison) but a smaller name overall.",
      supportingPoints: [
        "Large, well-known consumer brand (Hims)",
        "Polished app and experience (Hims)",
        "Respected hair-loss specialist (Keeps)",
        "Established telehealth operations (both)",
      ],
    },
  ],
  features: [
    { feature: "Starting Price", provider1Value: "Competitive, bundles & intro offers", provider2Value: "From ~$25/mo finasteride", highlight: "provider2" },
    { feature: "Core Medications", provider1Value: "Finasteride & minoxidil", provider2Value: "Finasteride & minoxidil", highlight: "both" },
    { feature: "Combined Spray", provider1Value: "2-in-1 finasteride + minoxidil", provider2Value: "Separate products", highlight: "provider1" },
    { feature: "Extras", provider1Value: "Shampoo, gummies, thickeners", provider2Value: "Ketoconazole shampoo", highlight: "provider1" },
    { feature: "Focus", provider1Value: "Broad men's health", provider2Value: "Hair loss only", highlight: "provider2" },
    { feature: "Consultation", provider1Value: "100% online", provider2Value: "100% online", highlight: "both" },
  ],
};

const himsRomanBattle: BattleData = {
  slug: "hims-vs-roman",
  provider1Id: "hims",
  provider2Id: "roman",
  title: "Hims vs Roman: Which Hair Loss Service Wins in 2026?",
  subtitle: "Hims vs Roman, compared on treatments, medical model, and value — to see which men's hair loss service comes out ahead.",
  description: "Hims vs Roman compared on hair loss treatments, clinician support, and value. Hims has the wider product range; Roman offers clinician-guided care from the Ro platform. See which wins in 2026.",
  intro: "Hims and Roman are two big names in men's telehealth, and both prescribe the proven hair loss medications — finasteride and minoxidil — after an online visit. Hims leans into a broad product range and a combined spray, while Roman (the men's-health brand from Ro) emphasizes clinician-guided care on an established platform. Here's how they compare.",
  verdict: "Both are credible, well-run services — but Hims edges ahead for most people on range and convenience. It offers more treatment options, a 2-in-1 spray, and a polished experience. Roman is the better pick if you value clinician-guided care and the credibility of the Ro platform, especially if you already use Ro for other men's-health needs.",
  verdictWinnerPoints: [
    "Broader treatment range and add-ons",
    "2-in-1 finasteride + minoxidil spray",
    "Polished, well-known consumer brand",
  ],
  verdictLoserPoints: [
    "Clinician-guided care from the Ro platform",
    "Streamlined, trusted telehealth experience",
    "Strong brand credibility",
  ],
  winnerId: "hims",
  categories: [
    {
      name: "Treatment Range",
      winner: "provider1",
      explanation: "Hims offers a wider lineup — finasteride, minoxidil, a combined spray, DHT-blocking shampoo, and supplements. Roman focuses on the core finasteride and minoxidil options with a clean, guided process.",
      supportingPoints: [
        "Spray, shampoo, supplements & more (Hims)",
        "2-in-1 combined spray (Hims)",
        "Finasteride & minoxidil, guided (Roman)",
        "Rx after online consult (both)",
      ],
    },
    {
      name: "Convenience & Routine",
      winner: "provider1",
      explanation: "Hims's 2-in-1 spray combines two treatments into a single daily step. Both ship discreetly to your door, but Hims's product ecosystem makes it easy to add supporting products.",
      supportingPoints: [
        "2-in-1 spray = one step (Hims)",
        "Easy to add supporting products (Hims)",
        "Clean, streamlined flow (Roman)",
        "Discreet delivery (both)",
      ],
    },
    {
      name: "Medical Model",
      winner: "provider2",
      explanation: "Roman emphasizes clinician-guided care with licensed providers reviewing every plan on the established Ro platform. Hims also uses licensed providers, but Roman leans harder into the guided, medical experience.",
      supportingPoints: [
        "Clinician-guided from the Ro platform (Roman)",
        "Licensed providers review every plan (Roman)",
        "Licensed provider oversight (Hims)",
        "Ongoing adjustments (both)",
      ],
    },
    {
      name: "Pricing & Value",
      winner: "tie",
      explanation: "Both use subscription pricing that's broadly in line for finasteride and minoxidil, with discounts on longer plans. Neither is a clear budget leader; the value difference comes down to which extras you actually want.",
      supportingPoints: [
        "Comparable subscription pricing (both)",
        "Discounts on longer plans (both)",
        "No insurance required (both)",
        "Value depends on chosen extras",
      ],
    },
    {
      name: "Brand & Platform",
      winner: "provider1",
      explanation: "Hims is a large, publicly traded consumer brand with a highly polished experience. Roman is well-established too, backed by Ro, but Hims has the broader consumer footprint.",
      supportingPoints: [
        "Large publicly traded brand (Hims)",
        "Highly polished app & site (Hims)",
        "Backed by the Ro platform (Roman)",
        "Established operations (both)",
      ],
    },
  ],
  features: [
    { feature: "Core Medications", provider1Value: "Finasteride & minoxidil", provider2Value: "Finasteride & minoxidil", highlight: "both" },
    { feature: "Combined Spray", provider1Value: "2-in-1 finasteride + minoxidil", provider2Value: "Separate products", highlight: "provider1" },
    { feature: "Extras", provider1Value: "Shampoo, gummies, thickeners", provider2Value: "Focused core lineup", highlight: "provider1" },
    { feature: "Medical Model", provider1Value: "Licensed provider oversight", provider2Value: "Clinician-guided (Ro platform)", highlight: "provider2" },
    { feature: "Shipping", provider1Value: "Discreet home delivery", provider2Value: "Discreet, free shipping", highlight: "both" },
    { feature: "Consultation", provider1Value: "100% online", provider2Value: "100% online", highlight: "both" },
  ],
};

const keepsRomanBattle: BattleData = {
  slug: "keeps-vs-roman",
  provider1Id: "keeps",
  provider2Id: "roman",
  title: "Keeps vs Roman: Which Men's Hair Loss Service Wins in 2026?",
  subtitle: "Keeps vs Roman, compared on price, focus, and platform — to see which men's hair loss service comes out ahead.",
  description: "Keeps vs Roman compared on price, hair loss focus, and platform. Keeps is cheaper and hair-loss-focused; Roman offers clinician-guided care from the Ro platform. See which wins in 2026.",
  intro: "Keeps and Roman both prescribe the proven hair loss medications — finasteride and minoxidil — to men after an online consult, but they take different approaches. Keeps is a hair-loss specialist built around affordability, while Roman brings clinician-guided care and the credibility of the established Ro platform. Here's how they compare.",
  verdict: "Both are legitimate men's hair loss services — but Keeps takes this one on price and focus. It's built specifically around affordable men's hair loss, with generic finasteride and minoxidil and a simple subscription. Roman is the better pick if you value clinician-guided care and a broader, established men's-health platform.",
  verdictWinnerPoints: [
    "Among the most affordable options",
    "Single-minded focus on men's hair loss",
    "Simple, no-frills subscription",
  ],
  verdictLoserPoints: [
    "Clinician-guided care from the Ro platform",
    "Broader, established men's-health brand",
    "Streamlined, polished experience",
  ],
  winnerId: "keeps",
  categories: [
    {
      name: "Pricing & Value",
      winner: "provider1",
      explanation: "Keeps is priced for affordability — generic finasteride from around $25/month and minoxidil from around $15/month. Roman's pricing is transparent but generally runs a bit higher for the core routine.",
      supportingPoints: [
        "Generic finasteride from ~$25/mo (Keeps)",
        "Minoxidil from ~$15/mo (Keeps)",
        "Transparent but higher pricing (Roman)",
        "No insurance required (both)",
      ],
    },
    {
      name: "Focus",
      winner: "provider1",
      explanation: "Keeps is a dedicated hair-loss service with no unrelated products. Roman covers a broad range of men's-health needs, which adds range but less single-minded focus on hair.",
      supportingPoints: [
        "Hair-loss-only specialist (Keeps)",
        "No unrelated upsells (Keeps)",
        "Broad men's-health platform (Roman)",
        "Licensed provider oversight (both)",
      ],
    },
    {
      name: "Medical Model",
      winner: "provider2",
      explanation: "Roman emphasizes clinician-guided care with licensed providers reviewing every plan on the established Ro platform. Keeps also uses licensed physicians, but Roman leans harder into the guided experience.",
      supportingPoints: [
        "Clinician-guided from the Ro platform (Roman)",
        "Licensed providers review every plan (Roman)",
        "Licensed physician oversight (Keeps)",
        "Ongoing support (both)",
      ],
    },
    {
      name: "Medications",
      winner: "tie",
      explanation: "Both offer the core proven treatments — finasteride and minoxidil — prescribed after an online consult. Neither is limited to a single option for men's hair loss.",
      supportingPoints: [
        "Oral finasteride (both)",
        "Topical minoxidil (both)",
        "Combined routines available (both)",
        "Rx after online review (both)",
      ],
    },
    {
      name: "Simplicity",
      winner: "provider1",
      explanation: "Keeps offers a simple, focused signup and subscription centered on hair. Roman's broader platform is polished but covers more than hair, which can be more than a hair-only shopper needs.",
      supportingPoints: [
        "Simple, hair-focused signup (Keeps)",
        "No-frills subscription (Keeps)",
        "Polished but broader platform (Roman)",
        "Discreet delivery (both)",
      ],
    },
  ],
  features: [
    { feature: "Starting Price", provider1Value: "From ~$25/mo finasteride", provider2Value: "Transparent, generally higher", highlight: "provider1" },
    { feature: "Focus", provider1Value: "Hair loss only", provider2Value: "Broad men's health", highlight: "provider1" },
    { feature: "Core Medications", provider1Value: "Finasteride & minoxidil", provider2Value: "Finasteride & minoxidil", highlight: "both" },
    { feature: "Medical Model", provider1Value: "Licensed physician oversight", provider2Value: "Clinician-guided (Ro platform)", highlight: "provider2" },
    { feature: "Shipping", provider1Value: "Discreet home delivery", provider2Value: "Discreet, free shipping", highlight: "both" },
    { feature: "Consultation", provider1Value: "100% online", provider2Value: "100% online", highlight: "both" },
  ],
};

const himsHappyheadBattle: BattleData = {
  slug: "hims-vs-happy-head",
  provider1Id: "hims",
  provider2Id: "happyhead",
  matchupLabel: "Hims vs Happy Head",
  title: "Hims vs Happy Head: Which Hair Loss Treatment Wins in 2026?",
  subtitle: "Hims vs Happy Head, compared on price, personalization, and who they treat — to see which hair loss service comes out ahead.",
  description: "Hims vs Happy Head compared on price, custom formulas, and value. Hims is broad and affordable; Happy Head offers dermatologist-formulated custom Rx for men and women. See which wins in 2026.",
  intro: "Hims and Happy Head take different approaches to hair loss. Hims is a broad, affordable men's platform built on standard finasteride and minoxidil plus supporting products. Happy Head is dermatologist-founded and formulates custom-compounded prescriptions — topical blends and oral options — tailored to your pattern of loss, for both men and women. Here's how they compare.",
  verdict: "Both are legitimate, effective options — but Hims takes this one for most people on price and convenience. It's more affordable, widely available, and easy to start. Happy Head is the better pick if you want a dermatologist-designed custom formula, haven't responded to standard treatments, or are a woman seeking prescription hair loss care.",
  verdictWinnerPoints: [
    "More affordable, easy-to-start plans",
    "Broad product range plus a 2-in-1 spray",
    "Large, well-known consumer brand",
  ],
  verdictLoserPoints: [
    "Dermatologist-formulated custom compounds",
    "Personalized topical + oral formulas",
    "Treats both men and women",
  ],
  winnerId: "hims",
  categories: [
    {
      name: "Pricing & Value",
      winner: "provider1",
      explanation: "Hims is more affordable — standard finasteride and minoxidil start low, with bundles and intro offers. Happy Head's custom-compounded formulas sit at the premium end (roughly $35-$79/month), reflecting the personalized approach.",
      supportingPoints: [
        "Standard finasteride/minoxidil, low entry (Hims)",
        "Bundles and intro offers (Hims)",
        "Premium custom formulas ~$35-$79/mo (Happy Head)",
        "No insurance required (both)",
      ],
    },
    {
      name: "Personalization",
      winner: "provider2",
      explanation: "Happy Head formulates custom-compounded topicals that can combine minoxidil, finasteride, and additional actives tuned to your hair loss pattern — plus oral options. Hims offers proven standard treatments rather than bespoke compounds.",
      supportingPoints: [
        "Custom multi-ingredient topicals (Happy Head)",
        "Dermatologist-designed formulas (Happy Head)",
        "Standard proven treatments (Hims)",
        "Rx after online review (both)",
      ],
    },
    {
      name: "Who They Treat",
      winner: "provider2",
      explanation: "Happy Head treats both men and women, and offers options for people who haven't responded to standard finasteride/minoxidil. Hims's hair line (including finasteride) is men-only.",
      supportingPoints: [
        "Treats men and women (Happy Head)",
        "Options beyond standard routines (Happy Head)",
        "Men-only hair line (Hims)",
        "Licensed provider oversight (both)",
      ],
    },
    {
      name: "Convenience & Brand",
      winner: "provider1",
      explanation: "Hims is a large, polished, widely recognized brand with a fast signup and a broad product ecosystem. Happy Head's custom formulas take longer to prepare and ship, reflecting the compounding step.",
      supportingPoints: [
        "Large, recognized brand (Hims)",
        "Fast signup, broad ecosystem (Hims)",
        "Custom compounding takes longer (Happy Head)",
        "Discreet delivery (both)",
      ],
    },
    {
      name: "Proven Medications",
      winner: "tie",
      explanation: "Both are built on the evidence-backed actives — finasteride and minoxidil. Hims delivers them in standard forms; Happy Head blends them (and more) into custom formulas.",
      supportingPoints: [
        "Finasteride & minoxidil (both)",
        "Standard forms (Hims)",
        "Custom blends with extra actives (Happy Head)",
        "Prescription after review (both)",
      ],
    },
  ],
  features: [
    { feature: "Starting Price", provider1Value: "Low entry, bundles & offers", provider2Value: "Premium custom (~$35-$79/mo)", highlight: "provider1" },
    { feature: "Formulas", provider1Value: "Standard finasteride & minoxidil", provider2Value: "Custom-compounded topical + oral", highlight: "provider2" },
    { feature: "Treats Women", provider1Value: "Men-only hair line", provider2Value: "Men and women", highlight: "provider2" },
    { feature: "Personalization", provider1Value: "Proven standard options", provider2Value: "Dermatologist-designed, tailored", highlight: "provider2" },
    { feature: "Brand & Speed", provider1Value: "Large brand, fast start", provider2Value: "Custom formulas ship slower", highlight: "provider1" },
    { feature: "Consultation", provider1Value: "100% online", provider2Value: "100% online", highlight: "both" },
  ],
};

function buildInitialConfig(): SiteConfig {
  return {
    ...defaultConfig,
    experts: defaultExperts,
    providers: productsJson.map((p) => ({
      id: p.id,
      name: p.name,
      tagline: p.tagline,
      logo: p.logo,
      smallLogo: `/logos/${p.id}-icon.svg`,
      highlights: p.highlights,
      affiliateUrl: p.affiliateUrl,
      ctaText: p.ctaText,
      trustpilotRating: seedTrustpilot[p.id]?.rating,
      trustpilotReviewCount: seedTrustpilot[p.id]?.reviewCount,
      trustpilotReviews: seedTrustpilot[p.id]?.reviews,
    })),
    ranking: {
      providerOrder: ["hims", "keeps", "roman", "happyhead"],
      positions: [
        { score: 9.8, starRating: 5, label: "Exceptional", badge: "Our Most Popular" },
        { score: 9.6, starRating: 4.5, label: "Excellent" },
        { score: 9.5, starRating: 4.5, label: "Excellent" },
        { score: 9.4, starRating: 4, label: "Excellent" },
        { score: 9.3, starRating: 4, label: "Excellent" },
        { score: 9.1, starRating: 3.5, label: "Excellent" },
        { score: 8.9, starRating: 3.5, label: "Very Good" },
        { score: 8.7, starRating: 3, label: "Very Good" },
        { score: 8.5, starRating: 3, label: "Very Good" },
        { score: 8.4, starRating: 3, label: "Very Good" },
        { score: 8.2, starRating: 3, label: "Very Good" },
        { score: 8.0, starRating: 3, label: "Very Good" },
      ],
    },
    faqs: faqsJson,
    reviews: defaultReviews,
    articles: defaultArticlesData,
    battles: [himsKeepsBattle, himsRomanBattle, keepsRomanBattle, himsHappyheadBattle],
    sidebars: [
      {
        id: "articles-default",
        name: "Articles Sidebar",
        area: "articles" as const,
        active: true,
        blocks: [
          { type: "providers" as const, enabled: true },
          { type: "quizCta" as const, enabled: true },
          { type: "relatedArticles" as const, enabled: true },
        ],
        providerIds: ["hims", "keeps", "roman"],
        quizCta: {
          headline: "Not sure which provider is right?",
          description: "Take our free quiz and get a personalized recommendation.",
          ctaText: "Find My Match",
          ctaUrl: "/find-your-match",
        },
        articleSlugs: [],
      },
    ],
    landingPages: [],
    quiz: {
      welcomeTitle: "Find Your Best Weight Loss Provider",
      welcomeSubtitle: "Answer 4 quick questions and we'll match you with the provider that best fits your goals.",
      welcomeTrustPoints: ["Takes less than 1 minute", "Personalized provider recommendations", "Completely free"],
      welcomeCta: "Find My Match",
      midFlowMessage: "Great! Almost done — just a few more.",
      pageTitle: "Find Your Best Weight Loss Provider",
      pageSubtitle: "Answer 4 quick questions and we'll match you with the provider that best fits your goals.",
      resultsTitle: "Your Best Match",
      resultsSubtitle: "Based on your answers, this provider is the strongest fit for your goals and preferences.",
      resultsOthersTitle: "Other Providers You May Want to Consider",
      trustStrip: ["Updated Monthly", "Editorially Reviewed", "Independent Provider Comparison"],
      testimonials: [
        { text: "I finally found a provider that fit my budget and the whole process was much easier than I expected.", name: "Sarah M.", state: "Texas" },
        { text: "The matching quiz saved me hours of research. I was approved and had my medication within a week.", name: "Jessica R.", state: "Florida" },
        { text: "I was skeptical at first but the process was simple and my provider has been incredibly supportive.", name: "Amanda K.", state: "California" },
        { text: "Everything was handled online and my prescription arrived faster than I thought possible.", name: "Rachel T.", state: "New York" },
        { text: "I compared several options and this made it so easy to find the right fit for my goals and budget.", name: "Michelle D.", state: "Ohio" },
        { text: "The whole experience felt professional and trustworthy. I'm glad I took the quiz.", name: "Lauren P.", state: "Georgia" },
      ],
      loadingMessages: ["Comparing providers for you...", "Checking treatment options...", "Finding your best match...", "Almost there..."],
      loadingScreen: {
        headline: "Finding your best match",
        supportingTexts: [
          "Matching your preferences...",
          "Reviewing treatment options...",
          "Comparing pricing...",
          "Checking provider quality...",
          "Finalizing your recommendation...",
        ],
        providerLogos: ["hims", "keeps", "roman", "happyhead"],
        durationMs: 4400,
      },
      questions: [
        {
          id: "goal",
          title: "What's your main weight loss goal?",
          subtitle: "This helps us recommend providers that best match your goals.",
          type: "cards" as const,
          options: [
            { label: "Lose up to <strong>20 lbs</strong>", value: "light" },
            { label: "Lose <strong>20–50 lbs</strong>", value: "moderate" },
            { label: "Lose <strong>50+ lbs</strong>", value: "significant" },
            { label: "<strong>I'm not sure yet</strong>", value: "exploring" },
          ],
        },
        {
          id: "experience",
          title: "Have you tried weight loss meds before?",
          subtitle: "No wrong answer — this just helps us personalize.",
          type: "cards" as const,
          options: [
            { label: "Yes, I have", value: "yes" },
            { label: "No, it's my first time", value: "no" },
            { label: "I'm not sure", value: "unsure" },
          ],
        },
        {
          id: "priority",
          title: "What's most important to you?",
          subtitle: "Pick the one that feels most important right now.",
          type: "cards" as const,
          options: [
            { label: "Lowest monthly cost", value: "cost" },
            { label: "Doctor-guided care", value: "medical" },
            { label: "Fast online treatment", value: "online" },
            { label: "Personalized care", value: "personalized" },
          ],
        },
        {
          id: "timing",
          title: "When would you like to get started?",
          subtitle: "No pressure — just helps us prioritize.",
          type: "cards" as const,
          options: [
            { label: "Today", value: "today" },
            { label: "This week", value: "this_week" },
            { label: "Just exploring", value: "exploring" },
          ],
        },
        {
          id: "state",
          title: "One last step — which state are you in?",
          subtitle: "Some providers aren't available in every state.",
          type: "dropdown" as const,
          options: [
            { label: "Alabama", value: "AL" }, { label: "Alaska", value: "AK" }, { label: "Arizona", value: "AZ" },
            { label: "Arkansas", value: "AR" }, { label: "California", value: "CA" }, { label: "Colorado", value: "CO" },
            { label: "Connecticut", value: "CT" }, { label: "Delaware", value: "DE" }, { label: "Florida", value: "FL" },
            { label: "Georgia", value: "GA" }, { label: "Hawaii", value: "HI" }, { label: "Idaho", value: "ID" },
            { label: "Illinois", value: "IL" }, { label: "Indiana", value: "IN" }, { label: "Iowa", value: "IA" },
            { label: "Kansas", value: "KS" }, { label: "Kentucky", value: "KY" }, { label: "Louisiana", value: "LA" },
            { label: "Maine", value: "ME" }, { label: "Maryland", value: "MD" }, { label: "Massachusetts", value: "MA" },
            { label: "Michigan", value: "MI" }, { label: "Minnesota", value: "MN" }, { label: "Mississippi", value: "MS" },
            { label: "Missouri", value: "MO" }, { label: "Montana", value: "MT" }, { label: "Nebraska", value: "NE" },
            { label: "Nevada", value: "NV" }, { label: "New Hampshire", value: "NH" }, { label: "New Jersey", value: "NJ" },
            { label: "New Mexico", value: "NM" }, { label: "New York", value: "NY" }, { label: "North Carolina", value: "NC" },
            { label: "North Dakota", value: "ND" }, { label: "Ohio", value: "OH" }, { label: "Oklahoma", value: "OK" },
            { label: "Oregon", value: "OR" }, { label: "Pennsylvania", value: "PA" }, { label: "Rhode Island", value: "RI" },
            { label: "South Carolina", value: "SC" }, { label: "South Dakota", value: "SD" }, { label: "Tennessee", value: "TN" },
            { label: "Texas", value: "TX" }, { label: "Utah", value: "UT" }, { label: "Vermont", value: "VT" },
            { label: "Virginia", value: "VA" }, { label: "Washington", value: "WA" }, { label: "West Virginia", value: "WV" },
            { label: "Wisconsin", value: "WI" }, { label: "Wyoming", value: "WY" }, { label: "Washington D.C.", value: "DC" },
          ],
        },
      ],
      providerProfiles: [
        { providerId: "hims", priceLevel: "mid", strengths: ["online", "personalized", "medical"], matchReasons: { cost: "Competitive subscription pricing with bundles", medical: "Licensed providers prescribe Rx finasteride & minoxidil", online: "Full online consult and discreet delivery", personalized: "Combined spray and add-ons to fit your routine" } },
        { providerId: "keeps", priceLevel: "low", strengths: ["cost", "online"], matchReasons: { cost: "Among the most affordable hair loss options", medical: "Physician-reviewed generic finasteride & minoxidil", online: "Simple online enrollment", personalized: "Focused, hair-loss-only plans" } },
        { providerId: "roman", priceLevel: "mid", strengths: ["medical", "online"], matchReasons: { cost: "Transparent subscription pricing", medical: "Clinician-guided plans from the Ro platform", online: "Streamlined telehealth experience", personalized: "Provider-guided adjustments" } },
        { providerId: "happyhead", priceLevel: "high", strengths: ["personalized", "medical"], matchReasons: { cost: "Premium, custom-compounded formulas", medical: "Dermatologist-founded, prescription strength", online: "Full online evaluation", personalized: "Formulas tailored to your hair loss pattern" } },
      ],
    },
  };
}

// Last successfully-merged config, kept in memory for the life of the server
// instance. If a later blob read fails transiently, we serve this instead of
// bare defaults — which would drop CMS-only content and 404 those pages.
let lastGoodConfig: SiteConfig | null = null;

export async function getConfig(): Promise<SiteConfig> {
  try {
    const { blobs } = await list({ prefix: BLOB_KEY });
    if (blobs.length > 0) {
      // Retry the blob fetch a few times before giving up on this request.
      let res: Response | null = null;
      for (let attempt = 0; attempt < 3; attempt++) {
        res = await fetch(blobs[0].url, { cache: "no-store" });
        if (res.ok) break;
        if (attempt < 2) await new Promise((r) => setTimeout(r, 150 * (attempt + 1)));
      }
      if (res && res.ok) {
        const saved = (await res.json()) as Partial<SiteConfig>;
        const initial = buildInitialConfig();
        // Merge providers: keep saved, add new defaults by id
        // Seed lookup tolerant of admin-recreated providers whose ids differ
        // from the seed keys ("provider-<timestamp>"): fall back to the
        // normalized provider name.
        const seedFor = (p: { id: string; name: string }) => {
          if (seedTrustpilot[p.id]) return seedTrustpilot[p.id];
          const norm = p.name.toLowerCase().replace(/[^a-z0-9]/g, "");
          const aliases: Record<string, string> = { sprouthealth: "sprout", directmeds: "directmeds" };
          return seedTrustpilot[norm] ?? seedTrustpilot[aliases[norm] ?? ""];
        };
        // Union the code seed (our canonical, newest-first source) with any
        // reviews saved in the CMS, deduped by title+text. This lets newly
        // added seed reviews surface even after a provider was saved to the
        // blob (a plain `saved ?? seed` would freeze the seed forever), while
        // still preserving any reviews added only through the admin.
        const mergeTrustpilotReviews = (
          savedReviews: TrustpilotReview[] | undefined,
          seedReviews: TrustpilotReview[] | undefined
        ): TrustpilotReview[] | undefined => {
          const seedList = seedReviews ?? [];
          const savedList = savedReviews ?? [];
          if (seedList.length === 0) return savedList.length > 0 ? savedList : undefined;
          const key = (r: TrustpilotReview) =>
            `${r.title}|${r.text}`.toLowerCase().replace(/\s+/g, " ").trim();
          const seedKeys = new Set(seedList.map(key));
          const cmsOnly = savedList.filter((r) => !seedKeys.has(key(r)));
          return [...seedList, ...cmsOnly];
        };
        const savedProviders = (saved.providers || []).map((p) => ({
          ...p,
          smallLogo: p.smallLogo || `/logos/${p.id}-icon.svg`,
          // Rating/count: CMS-edited values win, seed is a backfill. Use ||
          // so an empty string saved by the admin still falls back to seed.
          trustpilotRating: p.trustpilotRating || seedFor(p)?.rating,
          trustpilotReviewCount: p.trustpilotReviewCount || seedFor(p)?.reviewCount,
          // Reviews: merge seed + CMS so new seed reviews always show.
          trustpilotReviews: mergeTrustpilotReviews(p.trustpilotReviews, seedFor(p)?.reviews),
        }));
        const savedProviderIds = new Set(savedProviders.map((p) => p.id));
        const newProviders = initial.providers
          .filter((p) => !savedProviderIds.has(p.id))
          .map((p) => ({ ...p, smallLogo: p.smallLogo || `/logos/${p.id}-icon.svg` }));
        const providers = [...savedProviders, ...newProviders];
        return (lastGoodConfig = normalizeBrandCasing({
          ...initial,
          ...saved,
          providers,
          ranking: saved.ranking && saved.ranking.providerOrder && saved.ranking.providerOrder.length > 0 ? saved.ranking : initial.ranking,
          reviews: (() => {
            const savedReviews = saved.reviews && saved.reviews.length > 0 ? saved.reviews : [];
            const savedSlugs = new Set(savedReviews.map((r) => r.slug));
            const newDefaults = initial.reviews.filter((r) => !savedSlugs.has(r.slug));
            return [...savedReviews, ...newDefaults];
          })(),
          articles: (() => {
            const savedArticles = saved.articles && saved.articles.length > 0 ? saved.articles : [];
            const savedSlugs = new Set(savedArticles.map((a) => a.slug));
            const newDefaults = initial.articles.filter((a) => !savedSlugs.has(a.slug));
            return [...savedArticles, ...newDefaults];
          })(),
          battles: (() => {
            // Merge saved battles with code defaults: keep every saved battle,
            // and add any default battle whose slug isn't already saved. Default
            // battles live at their canonical (indexed) slugs, so those battle
            // URLs always resolve — even if the blob is briefly unavailable.
            const savedBattles = saved.battles && saved.battles.length > 0 ? saved.battles : [];
            const savedSlugs = new Set(savedBattles.map((b) => b.slug));
            const defaultsToAdd = initial.battles.filter((d) => !savedSlugs.has(d.slug));
            return [...savedBattles, ...defaultsToAdd];
          })(),
          sidebars: saved.sidebars && saved.sidebars.length > 0 ? saved.sidebars : initial.sidebars,
          landingPages: saved.landingPages && saved.landingPages.length > 0 ? saved.landingPages : initial.landingPages,
          quiz: saved.quiz && saved.quiz.questions && saved.quiz.questions.length > 0 ? { ...initial.quiz, ...saved.quiz } : initial.quiz,
          experts: saved.experts && saved.experts.length > 0 ? saved.experts : initial.experts,
        }));
      }
    }
  } catch {
    // fall through to last good config / default
  }
  // Prefer the last successfully-loaded config over bare defaults so a
  // transient blob failure never wipes CMS content (or 404s CMS-only pages).
  return lastGoodConfig ?? normalizeBrandCasing(buildInitialConfig());
}

export async function saveConfig(config: SiteConfig): Promise<void> {
  await put(BLOB_KEY, JSON.stringify(config, null, 2), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}
