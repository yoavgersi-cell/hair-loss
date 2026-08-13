export interface TrustpilotReview {
  title: string;
  text: string;
  name: string;
  location: string;
  rating: number;
  date?: string; // e.g. "Aug 3, 2026" — shown on the review card when present
}

// Reusable expert-team member for the site's credibility (E-E-A-T) layer.
// Populate with REAL team members; only attach medical credentials to people
// who actually hold them.
export interface Expert {
  id: string;
  name: string;
  role: string;          // e.g. "Lead Health Researcher"
  credentials?: string;  // e.g. "PharmD", "MPH" — real credentials only
  bio: string;
  avatar?: string;       // image URL; falls back to initials when empty
  specialties?: string[];
}

export interface Provider {
  id: string;
  name: string;
  tagline: string;
  logo: string;
  smallLogo: string;
  // Which audience hub(s) this provider belongs to. "both" surfaces on the
  // men hub AND the women hub; "men"/"women" restrict it to one. Defaults to
  // "men" when unset (the site was built men-first).
  audience?: "men" | "women" | "both";
  sidebarImage?: string;
  highlights: string[];
  affiliateUrl: string;
  ctaText: string;
  excludedStates?: string[];
  trustpilotRating?: string;
  trustpilotReviewCount?: string;
  trustpilotReviews?: TrustpilotReview[];
}

export interface RankingPosition {
  score: number;
  starRating: number;
  label: string;
  badge?: string;
}

export interface RankingPageConfig {
  providerOrder: string[];
  positions: RankingPosition[];
}

export interface ReviewData {
  slug: string;
  providerId: string;
  shortSummary: string;
  reviewIntro: string;
  keyFeatures: string[];
  pricingSummary: string;
  treatmentOptions: string[];
  pros: string[];
  cons: string[];
  bestFor: string[];
  finalVerdict: string;
  updatedAt?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface HeroConfig {
  backgroundImageUrl: string;
  imageAlt: string;
  updatedLabel: string;
  h1: string;
  h2: string;
  description: string;
}

export interface SidebarConfig {
  socialProofNumber: string;
  socialProofText: string;
  secureTitle: string;
  secureText: string;
  featuredImageUrl: string;
  featuredImageAlt: string;
  featuredImageLink: string;
  blockOrder?: string[];
}

export interface QuizOption {
  label: string;
  value: string;
}

export interface QuizQuestion {
  id: string;
  title: string;
  subtitle: string;
  type: "cards" | "dropdown";
  options: QuizOption[];
}

export interface QuizProviderProfile {
  providerId: string;
  priceLevel: "low" | "mid" | "high";
  strengths: string[];
  matchReasons: Record<string, string>;
}

export interface QuizConfig {
  panelType?: "classic" | "chat";
  chatIntroMessage?: string;
  providerOrder?: string[];
  welcomeTitle: string;
  welcomeSubtitle: string;
  welcomeTrustPoints: string[];
  welcomeCta: string;
  midFlowMessage: string;
  pageTitle: string;
  pageSubtitle: string;
  questions: QuizQuestion[];
  providerProfiles: QuizProviderProfile[];
  resultsTitle: string;
  resultsSubtitle: string;
  resultsOthersTitle: string;
  trustStrip: string[];
  loadingMessages: string[];
  resultOverrides?: Record<string, string[]>;
  testimonials?: { text: string; name: string; state: string }[];
  loadingScreen?: {
    headline: string;
    supportingTexts: string[];
    providerLogos: string[];
    durationMs: number;
  };
}

export interface ArticleSection {
  heading: string;
  body: string;
}

export interface ArticleData {
  slug: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
  publishedAt: string;
  updatedAt: string;
  heroColor: string;
  author?: string;
  sections: ArticleSection[];
  sidebarId?: string;
}

export interface BattleCategory {
  name: string;
  winner: "provider1" | "provider2" | "tie";
  explanation: string;
  supportingPoints: string[];
  // Legacy fields kept for backwards compat
  provider1Score?: number;
  provider2Score?: number;
  description?: string;
}

export interface BattleFeatureRow {
  feature: string;
  provider1Value: string;
  provider2Value: string;
  highlight?: "provider1" | "provider2" | "both" | "none";
}

export interface BattleData {
  slug: string;
  provider1Id: string;
  provider2Id: string;
  title: string;
  // Optional display order for the "X vs Y" label (breadcrumb, FAQ heading,
  // schema). Lets the visible matchup lead with a high-demand brand without
  // reordering provider1/provider2 (which drives the winner logic). Falls back
  // to `${p1.name} vs ${p2.name}` when unset.
  matchupLabel?: string;
  subtitle: string;
  description: string;
  intro: string;
  verdict: string;
  verdictWinnerPoints: string[];
  verdictLoserPoints: string[];
  winnerId: string;
  categories: BattleCategory[];
  features: BattleFeatureRow[];
  updatedAt?: string;
}

export interface SidebarBlock {
  type: "providers" | "quizCta" | "relatedArticles";
  enabled: boolean;
}

export interface SidebarQuizCta {
  headline: string;
  description: string;
  ctaText: string;
  ctaUrl: string;
}

export interface SidebarConfigData {
  id: string;
  name: string;
  area: "homepage" | "articles" | "reviews" | "comparisons" | "custom";
  active: boolean;
  blocks: SidebarBlock[];
  providerIds: string[];
  quizCta: SidebarQuizCta;
  articleSlugs: string[];
}

export interface LandingEditorialSection {
  heading: string;
  body: string;
  bullets?: string[];
}

export interface LandingPageData {
  slug: string;
  seoTitle: string;
  seoDescription: string;
  h1: string;
  h2: string;
  heroDescription: string;
  providerOrder: string[];
  editorialSections?: LandingEditorialSection[];
  updatedAt?: string;
}

// Stable fallback "last updated" date for schema when an item has no CMS
// updatedAt. Avoids emitting today's date on every request (fake freshness).
export const CONTENT_LAST_UPDATED = "2026-08-12";

export interface SiteConfig {
  providers: Provider[];
  faqs: FaqItem[];
  reviews: ReviewData[];
  articles: ArticleData[];
  battles: BattleData[];
  landingPages: LandingPageData[];
  sidebars: SidebarConfigData[];
  quiz: QuizConfig;
  hero: HeroConfig;
  sidebar: SidebarConfig;
  ranking: RankingPageConfig;
  siteName: string;
  disclosureText: string;
  cardSocialProof?: {
    number: string;
    text: string;
  };
  reviewTestimonials?: { text: string; name: string; state: string }[];
  battleWinnerBannerImageDesktop?: string;
  battleWinnerBannerImageMobile?: string;
  experts?: Expert[];
}

export const defaultConfig: SiteConfig = {
  siteName: "tophairloss.io",
  disclosureText:
    "Some providers featured on this site may compensate us. This may affect the order and placement of listings but does not influence our editorial ratings or reviews.",
  hero: {
    backgroundImageUrl: "/hero.png",
    imageAlt: "Man with thick, healthy hair",
    updatedLabel: "Last Updated: Aug 2026",
    h1: "Best Hair Loss Treatments for Men in 2026",
    h2: "Compare the top hair loss treatments, side by side",
    description:
      "Compare hair loss providers on pricing, treatments, medical support, and real results — and find the one that's right for you.",
  },
  sidebar: {
    socialProofNumber: "18,400+",
    socialProofText:
      "people compared hair loss providers on our platform this month.",
    secureTitle: "Secure & Confidential",
    secureText:
      "All providers featured on our platform use secure systems to protect your personal information.",
    featuredImageUrl: "/sidebar-featured.png",
    featuredImageAlt:
      "Hims — effective hair loss treatments for men",
    featuredImageLink: "/reviews/hims",
  },
  ranking: {
    providerOrder: [],
    positions: [
      { score: 9.8, starRating: 5, label: "Exceptional", badge: "Our Most Popular" },
      { score: 9.6, starRating: 5, label: "Excellent" },
      { score: 9.5, starRating: 5, label: "Excellent" },
      { score: 9.4, starRating: 5, label: "Excellent" },
      { score: 9.3, starRating: 5, label: "Excellent" },
      { score: 9.1, starRating: 4, label: "Excellent" },
      { score: 8.9, starRating: 4, label: "Very Good" },
      { score: 8.7, starRating: 4, label: "Very Good" },
      { score: 8.5, starRating: 4, label: "Very Good" },
      { score: 8.4, starRating: 4, label: "Very Good" },
    ],
  },
  providers: [],
  faqs: [],
  reviews: [],
  articles: [],
  battles: [],
  landingPages: [],
  sidebars: [],
  quiz: {
    welcomeTitle: "Find Your Best Hair Loss Provider Match",
    welcomeSubtitle: "Answer a few quick questions and we'll compare trusted hair loss providers based on your goals, preferences, and location.",
    welcomeTrustPoints: ["Takes less than 1 minute", "Personalized provider recommendations", "Completely free"],
    welcomeCta: "Find My Match",
    midFlowMessage: "Great, we're narrowing down the best options for you.",
    pageTitle: "Find Your Hair Loss Provider Match",
    pageSubtitle: "Answer a few quick questions to help us compare providers based on your goals, treatment preferences, and availability in your area.",
    resultsTitle: "Your Best Match",
    resultsSubtitle: "Based on your answers, this provider is the strongest fit for your goals and preferences.",
    resultsOthersTitle: "Other Providers You May Want to Consider",
    trustStrip: ["Updated Monthly", "Editorially Reviewed", "Independent Provider Comparison"],
    loadingMessages: ["Comparing trusted providers...", "Reviewing treatment options...", "Finding your best match...", "Preparing your recommendation..."],
    questions: [],
    providerProfiles: [],
  },
};
