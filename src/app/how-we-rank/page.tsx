import type { Metadata } from "next";
import Link from "next/link";
import { ClipboardCheck, Database, ShieldCheck, Scale, Trophy, RefreshCw } from "lucide-react";
import { getConfig } from "@/lib/config-store";
import { ExpertTeam } from "@/components/expert-team";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { LastUpdated } from "@/components/last-updated";
import { CONTENT_LAST_UPDATED } from "@/lib/config";

export const revalidate = 60;

const CANONICAL = "https://www.tophairloss.io/how-we-rank";

export const metadata: Metadata = {
  title: "How We Rank & Review Hair Loss Providers — Our Methodology",
  description:
    "Our full methodology for ranking and reviewing hair loss providers: the factors we score, where our data comes from, how we verify accuracy, and how we pick winners in head-to-head comparisons.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "How We Rank & Review Hair Loss Providers — Our Methodology",
    description:
      "The factors we score, where our data comes from, how we verify accuracy, and how we pick winners in our hair loss provider comparisons.",
    url: CANONICAL,
    type: "article",
  },
};

const FACTORS = [
  { category: "Medical Credibility", weight: "25%", desc: "Licensed provider oversight, quality of the medical evaluation, ongoing monitoring, pharmacy standards, and any third-party certifications (e.g. LegitScript)." },
  { category: "Treatment Access", weight: "20%", desc: "Range of treatments offered (finasteride, minoxidil, oral & topical, custom), formulations, and dosing flexibility." },
  { category: "Pricing & Value", weight: "20%", desc: "Total monthly cost including medication, consultations, and delivery — plus pricing transparency and the absence of hidden fees." },
  { category: "Patient Experience", weight: "15%", desc: "Enrollment speed, interface quality, support responsiveness, delivery reliability, and recent verified customer feedback." },
  { category: "Clinical Support", weight: "10%", desc: "Follow-up consultations, dose adjustments, side-effect management, and ongoing guidance through treatment." },
  { category: "Flexibility", weight: "10%", desc: "Contract terms, cancellation and pause policies, ability to switch medications, and payment options." },
];

const SOURCES = [
  { icon: Database, title: "The providers' own materials", desc: "We pull pricing, medications, shipping, and the medical model directly from each provider's official website and landing pages — so what you read here matches what you'll see when you enroll." },
  { icon: ClipboardCheck, title: "Recent verified customer reviews", desc: "We read current Trustpilot reviews to gauge real-world customer experience — communication, delivery, and support — not just marketing claims." },
  { icon: Scale, title: "In-house research", desc: "Our editors independently walk enrollment flows, compare pricing side by side, and track how each provider's offering changes over time." },
  { icon: ShieldCheck, title: "Clinical literature", desc: "Medical claims reference published clinical evidence and FDA information — not opinion." },
];

export default async function HowWeRankPage() {
  const config = await getConfig();
  const experts = config.experts ?? [];

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "How We Rank & Review Hair Loss Providers — Our Methodology",
    description:
      "Our full methodology for ranking and reviewing hair loss providers: the factors we score, where our data comes from, how we verify accuracy, and how we pick winners.",
    url: CANONICAL,
    publisher: { "@type": "Organization", name: "tophairloss.io", url: "https://www.tophairloss.io" },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.tophairloss.io" },
      { "@type": "ListItem", position: 2, name: "How We Rank", item: CANONICAL },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Hero */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-[900px] px-4 py-12 sm:px-6 sm:py-16">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "How We Rank" }]} />
          <h1 className="text-[28px] font-extrabold text-[#191919] sm:text-[36px]">
            How We Rank &amp; Review Providers
          </h1>
          <p className="mt-3 max-w-[640px] text-[16px] leading-relaxed text-gray-500">
            Every review and head-to-head comparison on this site is built on the same
            repeatable, evidence-first process. Here&rsquo;s exactly how we evaluate each
            hair loss provider, where our information comes from, and how we keep it accurate.
          </p>
          <LastUpdated date={CONTENT_LAST_UPDATED} className="mt-4" />
        </div>
      </div>

      <div className="mx-auto max-w-[900px] px-4 py-10 sm:px-6">
        {/* Factors */}
        <section className="mb-12">
          <h2 className="mb-4 text-[22px] font-bold text-[#191919]">The 6 factors we score</h2>
          <p className="mb-6 text-[16px] leading-[1.75] text-gray-600">
            We rate every provider on a weighted evaluation across six core categories. The
            weighting reflects what matters most for a safe, affordable, and effective hair
            loss treatment plan.
          </p>
          <div className="space-y-4">
            {FACTORS.map(({ category, weight, desc }) => (
              <div key={category} className="flex gap-4 rounded-lg border border-gray-200 bg-white p-4">
                <span className="shrink-0 rounded bg-[#0C4B75] px-2.5 py-1 text-[12px] font-bold text-white">{weight}</span>
                <div>
                  <p className="text-[14px] font-bold text-[#191919]">{category}</p>
                  <p className="mt-0.5 text-[13px] text-gray-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Data sources */}
        <section className="mb-12">
          <h2 className="mb-4 text-[22px] font-bold text-[#191919]">Where our data comes from</h2>
          <p className="mb-6 text-[16px] leading-[1.75] text-gray-600">
            Our evaluations only carry weight if the underlying information is real. We draw
            on four sources for every provider:
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {SOURCES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-xl border border-gray-200 bg-white p-5">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[#0C4B75]/5">
                  <Icon className="h-5 w-5 text-[#0C4B75]" strokeWidth={1.5} />
                </div>
                <h3 className="mb-1 text-[15px] font-bold text-[#191919]">{title}</h3>
                <p className="text-[13px] leading-relaxed text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Accuracy commitment */}
        <section className="mb-12">
          <h2 className="mb-4 text-[22px] font-bold text-[#191919]">How we keep it accurate</h2>
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="space-y-4 text-[15px] leading-[1.75] text-gray-600">
              <p>
                <strong className="text-[#191919]">We don&rsquo;t make things up.</strong> Prices,
                medications, shipping times, and medical details are taken from each provider&rsquo;s
                own official sources. We don&rsquo;t invent figures, name medications a provider
                doesn&rsquo;t offer, or attach clinical claims that aren&rsquo;t supported.
              </p>
              <p>
                <strong className="text-[#191919]">We update when providers change.</strong> Pricing
                and offerings in this space move quickly. When a provider changes its plans, we revise
                the affected reviews and comparisons and refresh their &ldquo;last updated&rdquo; date.
              </p>
              <p>
                <strong className="text-[#191919]">We separate fact from experience.</strong> Objective
                details (price, delivery, medications) are reported as fact; customer sentiment is
                clearly attributed to reviews; and our own take is presented as editorial analysis.
              </p>
            </div>
          </div>
        </section>

        {/* Scoring */}
        <section className="mb-12">
          <h2 className="mb-4 text-[22px] font-bold text-[#191919]">How scoring works</h2>
          <p className="text-[16px] leading-[1.75] text-gray-600">
            Each provider earns an overall score on a 10-point scale, translated into a plain-English
            label — from <strong className="text-[#191919]">Exceptional</strong> at the top through{" "}
            <strong className="text-[#191919]">Excellent</strong> and{" "}
            <strong className="text-[#191919]">Very Good</strong>. A score reflects the weighted result
            across the six factors above. Strong transparent pricing, credible medical oversight, and
            consistently positive recent customer feedback move a score up; hidden fees, thin medical
            support, or recurring complaints move it down.
          </p>
        </section>

        {/* Head-to-head winners */}
        <section className="mb-12">
          <div className="flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-6">
            <Trophy className="mt-0.5 h-6 w-6 shrink-0 text-amber-500" strokeWidth={2} />
            <div>
              <h2 className="mb-2 text-[22px] font-bold text-[#191919]">How we pick a winner</h2>
              <p className="text-[15px] leading-[1.75] text-gray-600">
                In a head-to-head comparison we score the two providers category by category —
                pricing, medical support, medication options, speed, and customer experience. The
                provider that wins the majority of categories takes the matchup, and the advantage
                meter reflects how decisive that edge is. We always name the runner-up&rsquo;s genuine
                strengths, because the &ldquo;better&rdquo; provider still depends on what you value most.
              </p>
            </div>
          </div>
        </section>

        {/* Freshness */}
        <section className="mb-12">
          <div className="flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-6">
            <RefreshCw className="mt-0.5 h-6 w-6 shrink-0 text-[#0C4B75]" strokeWidth={2} />
            <div>
              <h2 className="mb-2 text-[22px] font-bold text-[#191919]">Keeping reviews current</h2>
              <p className="text-[15px] leading-[1.75] text-gray-600">
                We continuously monitor provider pricing and offerings, new clinical data, and recent
                customer reviews, and revise our rankings, reviews, and comparisons as things change.
                Each review and comparison shows when it was last updated.
              </p>
            </div>
          </div>
        </section>

        {/* Independence */}
        <section className="mb-12">
          <h2 className="mb-4 text-[22px] font-bold text-[#191919]">Editorial independence</h2>
          <div className="space-y-4 text-[16px] leading-[1.75] text-gray-600">
            <p>
              <strong className="text-[#191919]">Independent rankings.</strong> Our rankings and
              reviews are determined by the evaluation criteria on this page — not by commercial
              relationships.
            </p>
            <p>
              <strong className="text-[#191919]">Transparent about affiliates.</strong> Some providers
              compensate us through affiliate partnerships when you click through and sign up. This may
              affect how providers are displayed, but it does not influence our scores or the content of
              our reviews. See our{" "}
              <Link href="/disclaimer" className="font-semibold text-[#0C4B75] hover:underline">full disclaimer</Link>.
            </p>
          </div>
        </section>

        {/* Who's behind the reviews */}
        <ExpertTeam experts={experts} />

        {/* Medical disclaimer */}
        <section className="mb-12">
          <h2 className="mb-4 text-[22px] font-bold text-[#191919]">Medical disclaimer</h2>
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <p className="text-[15px] leading-[1.75] text-gray-600">
              tophairloss.io is not a medical provider and does not prescribe medications. The
              information on this site is for educational and comparison purposes only and should not
              replace professional medical advice. hair loss medications are prescription drugs that require
              evaluation and supervision by a licensed healthcare provider. Always consult a qualified
              physician before starting any hair loss medication. Individual results vary.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <p className="mb-4 text-[16px] font-bold text-[#191919]">See the rankings in action</p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="inline-flex h-[44px] items-center justify-center rounded-lg bg-[#0C4B75] px-6 text-[14px] font-bold text-white transition-colors hover:bg-[#093d61]"
            >
              Compare Providers
            </Link>
            <Link
              href="/reviews"
              className="inline-flex h-[44px] items-center justify-center rounded-lg border border-gray-200 bg-white px-6 text-[14px] font-semibold text-[#191919] transition-colors hover:bg-gray-50"
            >
              Read Our Reviews
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
