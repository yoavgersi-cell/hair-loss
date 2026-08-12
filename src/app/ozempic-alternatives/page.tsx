import type { Metadata } from "next";
import Link from "next/link";
import { Pill, ShieldCheck, ArrowRight, DollarSign } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { LastUpdated } from "@/components/last-updated";
import { CONTENT_LAST_UPDATED } from "@/lib/config";

export const revalidate = 60;

const CANONICAL = "https://www.tophairloss.io/ozempic-alternatives";
const TITLE = "Ozempic, Wegovy & Mounjaro Alternatives (2026): Cheaper GLP-1 Options";
const DESCRIPTION =
  "The best alternatives to Ozempic, Wegovy, Mounjaro and Zepbound in 2026 — including the same active ingredients (semaglutide and tirzepatide) as affordable compounded options through licensed telehealth providers. Honest comparison and typical costs.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Ozempic, Wegovy & Mounjaro Alternatives That Actually Work (2026)",
    description:
      "The most effective alternatives to brand-name GLP-1s are often the same active ingredient — for a fraction of the price. Here's how it works.",
    url: CANONICAL,
    type: "article",
  },
};

// Brand drug → active ingredient → the telehealth alternative that uses it.
const brandRows: [string, string, string][] = [
  ["Ozempic", "Semaglutide (approved for type 2 diabetes)", "Compounded semaglutide via telehealth"],
  ["Wegovy", "Semaglutide (approved for weight loss)", "Compounded semaglutide via telehealth"],
  ["Mounjaro", "Tirzepatide (approved for type 2 diabetes)", "Compounded tirzepatide via telehealth"],
  ["Zepbound", "Tirzepatide (approved for weight loss)", "Compounded tirzepatide via telehealth"],
  ["Rybelsus", "Oral semaglutide (pill)", "Oral GLP-1 options via telehealth"],
];

const faqs: { question: string; answer: string }[] = [
  {
    question: "What is the best alternative to Ozempic?",
    answer:
      "For most people, the most effective alternative to Ozempic isn't a different drug at all — it's the same active ingredient (semaglutide) prescribed as an affordable compounded version through a licensed telehealth provider. Ozempic and Wegovy are both semaglutide; the brand versions are expensive and often hard to get, while compounded semaglutide delivers the same molecule, typically for a fraction of the list price. If you want a stronger option, tirzepatide (the active ingredient in Mounjaro and Zepbound) produced even greater average weight loss in trials and is also available as a compounded telehealth option.",
  },
  {
    question: "Is compounded semaglutide the same as Ozempic?",
    answer:
      "They share the same active ingredient — semaglutide. Ozempic is Novo Nordisk's brand-name, FDA-approved product; compounded semaglutide is made by a licensed compounding pharmacy and prescribed by a provider after a medical review. The medicine works the same way, but compounded products are not FDA-approved brand drugs and can vary by pharmacy, so it matters to use a provider that works with reputable, state-licensed compounding pharmacies.",
  },
  {
    question: "What's a cheaper alternative to Mounjaro?",
    answer:
      "Mounjaro's active ingredient is tirzepatide. The cheaper route most people use is compounded tirzepatide prescribed online through a telehealth provider — the same dual GLP-1/GIP molecule, usually well below brand list price. Brand Mounjaro and Zepbound can run over $1,000/month without insurance; compounded tirzepatide from telehealth providers is often advertised from around $150–$300/month depending on the provider and dose.",
  },
  {
    question: "Are there alternatives to Ozempic without insurance?",
    answer:
      "Yes — this is exactly where telehealth GLP-1 providers fit. They prescribe compounded semaglutide or tirzepatide on a cash-pay basis, so you don't need insurance coverage for a brand drug. Pricing is typically a flat monthly amount that includes the medication, the provider consultation, and ongoing support.",
  },
  {
    question: "Is there an over-the-counter (OTC) Ozempic?",
    answer:
      "No. There is no legitimate over-the-counter version of Ozempic or any GLP-1 medication — they are prescription-only. Any product marketed as 'OTC Ozempic,' 'Ozempic in a bottle,' or a supplement claiming the same effects is not the real medication. The legitimate lower-cost path is a prescription for compounded semaglutide or tirzepatide through a licensed provider.",
  },
  {
    question: "Semaglutide vs tirzepatide — which alternative is more effective?",
    answer:
      "In their respective clinical trials, tirzepatide (Mounjaro/Zepbound) produced greater average weight loss (roughly 20%+) than semaglutide (Ozempic/Wegovy, roughly 15%). Both are highly effective and both are available as compounded telehealth options. Tirzepatide tends to cost a little more. The right choice depends on your medical history and your provider's guidance.",
  },
  {
    question: "Are compounded GLP-1 alternatives safe and legal?",
    answer:
      "Compounded medications are prescribed by licensed clinicians and made by state-licensed compounding pharmacies that follow federal compounding standards. They are legal when prescribed appropriately, but they are not FDA-approved brand products, and quality depends on the pharmacy. Choose a provider that is transparent about its pharmacies, requires a real medical intake, and offers ongoing clinical support — which is what we weigh in our provider rankings.",
  },
];

export default function OzempicAlternativesPage() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: TITLE,
    description: DESCRIPTION,
    datePublished: "2026-08-11",
    dateModified: CONTENT_LAST_UPDATED,
    author: { "@type": "Organization", name: "TopHairLoss Team", url: "https://www.tophairloss.io" },
    publisher: { "@type": "Organization", name: "tophairloss.io", url: "https://www.tophairloss.io" },
    mainEntityOfPage: CANONICAL,
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.tophairloss.io" },
      { "@type": "ListItem", position: 2, name: "Ozempic Alternatives", item: CANONICAL },
    ],
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Hero */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-[900px] px-4 py-12 sm:px-6 sm:py-16">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Ozempic Alternatives" }]} />
          <h1 className="text-[28px] font-extrabold text-[#191919] sm:text-[36px]">
            Ozempic, Wegovy &amp; Mounjaro Alternatives That Actually Work
          </h1>
          <p className="mt-3 max-w-[640px] text-[16px] leading-relaxed text-gray-500">
            The most effective &ldquo;alternative&rdquo; to a brand-name GLP-1 is usually the very same
            active ingredient — prescribed as an affordable compounded option through a licensed
            telehealth provider. Here&rsquo;s how the real alternatives compare, what they cost, and how
            to choose one safely.
          </p>
          <LastUpdated date={CONTENT_LAST_UPDATED} className="mt-4" />
        </div>
      </div>

      <div className="mx-auto max-w-[900px] px-4 py-10 text-[16px] leading-[1.75] text-gray-700 sm:px-6">
        {/* Key insight callout */}
        <div className="mb-10 flex items-start gap-4 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-6">
          <Pill className="mt-0.5 h-6 w-6 shrink-0 text-emerald-600" strokeWidth={2} />
          <div>
            <h2 className="mb-2 text-[18px] font-bold text-[#191919]">The one thing to understand first</h2>
            <p className="text-[15px] leading-[1.75] text-gray-600">
              Ozempic and Wegovy are both <strong className="text-[#191919]">semaglutide</strong>.
              Mounjaro and Zepbound are both <strong className="text-[#191919]">tirzepatide</strong>. So
              the cheapest, most effective &ldquo;alternative&rdquo; to these brands is typically the
              same active ingredient, prescribed as a <strong className="text-[#191919]">compounded
              medication</strong> through an online provider — for a fraction of the brand price.
            </p>
          </div>
        </div>

        {/* Brand → alternative table */}
        <section className="mb-12">
          <h2 className="mb-4 text-[24px] font-bold text-[#191919]">What each brand drug&rsquo;s real alternative is</h2>
          <div className="mb-4 overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full min-w-[640px] text-left text-[14px]">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 font-bold text-[#191919]">Brand drug</th>
                  <th className="px-4 py-3 font-bold text-[#191919]">Active ingredient</th>
                  <th className="px-4 py-3 font-bold text-[#191919]">Lower-cost alternative</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {brandRows.map(([brand, active, alt], i) => (
                  <tr key={i} className={i % 2 === 1 ? "bg-gray-50/50" : ""}>
                    <td className="px-4 py-3 align-top font-medium text-[#191919]">{brand}</td>
                    <td className="px-4 py-3 align-top text-gray-600">{active}</td>
                    <td className="px-4 py-3 align-top text-gray-600">{alt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[14px] text-gray-500">
            Weighing a pill instead of a shot? See our{" "}
            <Link href="/glp1-pills-vs-injections" className="font-semibold text-[#0C4B75] hover:underline">
              GLP-1 pills vs injections
            </Link>{" "}
            comparison.
          </p>
        </section>

        {/* Why compounded */}
        <section className="mb-12">
          <div className="mb-4 flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-[#0C4B75]" strokeWidth={2} />
            <h2 className="text-[24px] font-bold text-[#191919]">Why the compounded route is cheaper</h2>
          </div>
          <p className="mb-4">
            Brand-name Ozempic, Wegovy, Mounjaro and Zepbound can run{" "}
            <strong className="text-[#191919]">over $1,000 a month at list price</strong> without
            insurance, and coverage for weight loss is inconsistent. Licensed telehealth providers work
            with compounding pharmacies to prescribe the same active ingredients — semaglutide or
            tirzepatide — on a flat, cash-pay basis. In practice that&rsquo;s often{" "}
            <strong className="text-[#191919]">around $99–$300 a month</strong> depending on the
            medication, dose, and provider, with the consultation and ongoing support included.
          </p>
          <p>
            The trade-off: compounded products aren&rsquo;t FDA-approved brand drugs, and quality
            depends on the pharmacy behind them. That&rsquo;s why the provider you choose matters more
            than the brand name on the box — you want transparent pharmacies, a real medical intake, and
            genuine clinical follow-up.
          </p>
        </section>

        {/* How to choose / route to partners */}
        <section className="mb-12">
          <div className="mb-4 flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-[#0C4B75]" strokeWidth={2} />
            <h2 className="text-[24px] font-bold text-[#191919]">How to choose a provider (and what we&rsquo;d pick)</h2>
          </div>
          <p className="mb-6">
            We compare the leading telehealth providers that offer compounded semaglutide and
            tirzepatide on the things that actually matter — transparent pricing, the medications
            offered, shipping speed, and the quality of medical support. A few we rate highly for
            affordable, legitimate access are{" "}
            <Link href="/reviews/embody" className="font-semibold text-[#0C4B75] hover:underline">embody</Link>,{" "}
            <Link href="/reviews/altrx" className="font-semibold text-[#0C4B75] hover:underline">altRx</Link>, and{" "}
            <Link href="/reviews/trimrx" className="font-semibold text-[#0C4B75] hover:underline">TrimRX</Link>{" "}
            — but the right fit depends on your goals and budget.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/" className="inline-flex h-[46px] items-center justify-center gap-2 rounded-lg bg-[#0C4B75] px-6 text-[14px] font-bold text-white transition-colors hover:bg-[#093d61]">
              Compare Top Providers
              <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
            </Link>
            <Link href="/weight-loss-pills" className="inline-flex h-[46px] items-center justify-center rounded-lg border border-gray-200 bg-white px-6 text-[14px] font-semibold text-[#191919] transition-colors hover:bg-gray-50">
              See Weight Loss Pill Options
            </Link>
          </div>
        </section>

        {/* What's coming */}
        <section className="mb-12">
          <h2 className="mb-4 text-[24px] font-bold text-[#191919]">What about newer options?</h2>
          <p>
            The next generation is already in trials. <strong className="text-[#191919]">Retatrutide</strong>,
            a triple-agonist from Eli Lilly, reached about 24% average weight loss in a Phase 2 study —
            more than tirzepatide or semaglutide — though it isn&rsquo;t FDA-approved yet. Read our{" "}
            <Link href="/retatrutide-weight-loss" className="font-semibold text-[#0C4B75] hover:underline">
              retatrutide guide
            </Link>{" "}
            for where it stands and when it might arrive.
          </p>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="mb-6 text-[24px] font-bold text-[#191919]">Ozempic Alternatives: Frequently Asked Questions</h2>
          <div className="divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-200 bg-white">
            {faqs.map((f, i) => (
              <div key={i} className="p-6">
                <h3 className="mb-2 text-[16px] font-bold text-[#191919]">{f.question}</h3>
                <p className="text-[14px] leading-[1.7] text-gray-600">{f.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Sources + disclaimer */}
        <section>
          <p className="mb-3 text-[13px] leading-relaxed text-gray-400">
            Average weight-loss figures reference published trial data for semaglutide (STEP) and
            tirzepatide (SURMOUNT) and Phase 2 retatrutide results; individual results vary. Pricing
            ranges are typical advertised telehealth cash-pay prices and vary by provider, medication,
            and dose. Ozempic, Wegovy, Mounjaro, Zepbound and Rybelsus are trademarks of their
            respective manufacturers and are not affiliated with tophairloss.io.
          </p>
          <p className="text-[13px] leading-relaxed text-gray-400">
            tophairloss.io is not a medical provider and does not prescribe medications. This page is
            for educational purposes only and is not medical advice. Compounded medications are not
            FDA-approved brand drugs. Always consult a licensed healthcare provider about the right
            treatment for you.
          </p>
        </section>
      </div>
    </div>
  );
}
