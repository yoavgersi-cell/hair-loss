import type { Metadata } from "next";
import Link from "next/link";
import { Pill, Syringe, ShieldCheck, TriangleAlert, ArrowRight, Check } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ProviderCta } from "@/components/provider-cta";
import { LastUpdated } from "@/components/last-updated";
import { CONTENT_LAST_UPDATED } from "@/lib/config";
import { getConfig } from "@/lib/config-store";

// Providers confirmed to offer oral / pill options (site owner confirmed).
// Featured accurately using verified provider data — no invented pill claims.
const PILL_PROVIDER_IDS = ["embody", "trimrx", "medvi", "shed"];

export const revalidate = 60;

const CANONICAL = "https://www.tophairloss.io/weight-loss-pills";

export const metadata: Metadata = {
  title: "Weight Loss Pills vs Injections 2026: Oral GLP-1s & What Works",
  description:
    "GLP-1 pills vs injections, explained: oral GLP-1s (Rybelsus, oral semaglutide), FDA-approved pills like Contrave and Qsymia, and how they compare to injections on results, cost, and convenience.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Weight Loss Pills vs Injections 2026: Oral GLP-1s & What Works",
    description:
      "GLP-1 pills vs injections — oral options, FDA-approved prescription pills, and how they really compare.",
    url: CANONICAL,
    type: "article",
  },
};

// ── Real, publicly documented medical data (not provider claims) ──
const oralGlp1: [string, string, string][] = [
  ["Rybelsus (oral semaglutide 7–14mg)", "FDA-approved for type 2 diabetes; taken daily on an empty stomach", "Modest weight loss (a few %); same molecule as Ozempic/Wegovy"],
  ["Oral semaglutide 25mg (oral Wegovy)", "Higher-dose daily oral semaglutide for weight loss; advancing through FDA review", "~15% weight loss reported in trials (OASIS) — approaching injectable levels"],
  ["Orforglipron (Lilly)", "Oral small-molecule GLP-1, no food/water timing restrictions; in late-stage trials, not yet approved", "Meaningful weight loss reported in Phase 2/3; approval pending"],
];

const fdaPills: [string, string, string][] = [
  ["Qsymia (phentermine/topiramate)", "Appetite suppression + reduced cravings; daily capsule", "Among the most effective oral options — roughly 8–10% average weight loss"],
  ["Contrave (bupropion/naltrexone)", "Targets appetite and reward-related eating; daily tablet", "Roughly 5–9% average weight loss"],
  ["Phentermine (Adipex-P)", "Short-term appetite suppressant; controlled substance", "Roughly 3–5% over short-term use"],
  ["Metformin", "Used off-label; improves insulin sensitivity; daily tablet", "Modest (~2–3%); often used as a lower-cost option"],
  ["Orlistat (Xenical / Alli)", "Blocks absorption of some dietary fat; Rx and OTC", "Roughly 3–5%; GI side effects are common"],
];

const pillsVsInjections: [string, string, string][] = [
  ["Average weight loss", "~5–10% for most pills; up to ~15% for high-dose oral semaglutide", "~15% (semaglutide) to ~20%+ (tirzepatide) in trials"],
  ["Format", "Daily tablet or capsule — no needles", "Once-weekly injection"],
  ["Best for", "Needle-averse patients; those wanting a simpler start", "Those prioritizing the greatest average weight loss"],
  ["Considerations", "Some require empty-stomach timing; effect varies by drug", "Weekly self-injection; strong, well-studied results"],
];

function DataTable({ colA, colB, rows }: { colA: string; colB: string; rows: [string, string, string][] }) {
  return (
    <div className="mb-4 overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full min-w-[640px] text-left text-[14px]">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-4 py-3 font-bold text-[#191919]">Option</th>
            <th className="px-4 py-3 font-bold text-[#191919]">{colA}</th>
            <th className="px-4 py-3 font-bold text-[#191919]">{colB}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map(([k, a, b], i) => (
            <tr key={i} className={i % 2 === 1 ? "bg-gray-50/50" : ""}>
              <td className="px-4 py-3 align-top font-medium text-[#191919]">{k}</td>
              <td className="px-4 py-3 align-top text-gray-600">{a}</td>
              <td className="px-4 py-3 align-top text-gray-600">{b}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const faqs: { question: string; answer: string }[] = [
  { question: "Do weight loss pills actually work?", answer: "Prescription weight loss pills can work, but results vary a lot by medication. FDA-approved options like Qsymia and Contrave produce roughly 5–10% average weight loss, while newer high-dose oral semaglutide has reached ~15% in trials. Over-the-counter 'fat burner' or 'natural' pills are largely unproven and are not a substitute for prescription treatment." },
  { question: "Is there a weight loss pill as effective as Ozempic or Wegovy?", answer: "Getting close. Oral semaglutide at a 25mg dose (an oral version of Wegovy) has shown around 15% weight loss in trials — comparable to the semaglutide injection — and is advancing through FDA review. Orforglipron, an oral GLP-1 from Eli Lilly, is also in late-stage trials. For now, weekly injections still lead on average results." },
  { question: "What is the strongest prescription weight loss pill?", answer: "Among currently FDA-approved oral options, Qsymia (phentermine/topiramate) tends to produce the most weight loss — roughly 8–10% on average. High-dose oral semaglutide, where available, is more effective still." },
  { question: "Can you get weight loss pills online?", answer: "Yes. Licensed telehealth providers can evaluate you online and, when appropriate, prescribe oral weight loss medications. A clinician determines whether an oral or injectable option fits your health profile and goals." },
  { question: "Are weight loss pills or injections better?", answer: "It depends on your priorities. Injections currently produce greater average weight loss, but pills avoid needles, can be simpler to start, and newer oral GLP-1s are closing the gap. The right choice comes down to your goals, tolerance, and what a clinician recommends." },
  { question: "GLP-1 pills vs injections — which works better?", answer: "Injectable GLP-1s (semaglutide, tirzepatide) still lead on average weight loss — roughly 15–20%+ in trials — while most GLP-1 pills land lower. The exception is high-dose oral semaglutide, which has reached ~15% in trials and is closing the gap. Pills win on convenience: no needles and a simple daily tablet. If maximum results matter most, injections lead today; if avoiding needles matters more, a GLP-1 pill can be a strong fit." },
];

export default async function WeightLossPillsPage() {
  const config = await getConfig();
  const pillProviders = PILL_PROVIDER_IDS
    .map((id) => config.providers.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => !!p);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Weight Loss Pills 2026: Oral GLP-1s & Prescription Options That Work",
    description: metadata.description,
    datePublished: "2026-08-01",
    dateModified: "2026-08-09",
    author: { "@type": "Organization", name: "TopHairLoss Team", url: "https://www.tophairloss.io" },
    publisher: { "@type": "Organization", name: "tophairloss.io", url: "https://www.tophairloss.io" },
    mainEntityOfPage: CANONICAL,
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.tophairloss.io" },
      { "@type": "ListItem", position: 2, name: "Weight Loss Pills", item: CANONICAL },
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
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Weight Loss Pills" }]} />
          <h1 className="text-[28px] font-extrabold text-[#191919] sm:text-[36px]">
            Weight Loss Pills: Oral Options That Actually Work in 2026
          </h1>
          <p className="mt-3 max-w-[640px] text-[16px] leading-relaxed text-gray-500">
            Not everyone wants a weekly injection. Here&rsquo;s an honest look at oral weight loss
            medications — the new oral GLP-1s, the FDA-approved prescription pills, and how they
            really compare to injections.
          </p>
          <LastUpdated date={CONTENT_LAST_UPDATED} className="mt-4" />
        </div>
      </div>

      <div className="mx-auto max-w-[900px] px-4 py-10 text-[16px] leading-[1.75] text-gray-700 sm:px-6">
        {/* Do they work */}
        <section className="mb-12">
          <h2 className="mb-4 text-[24px] font-bold text-[#191919]">Do weight loss pills work?</h2>
          <p className="mb-4">
            Some do — but it depends heavily on which pill. Prescription weight loss medications are
            clinically studied and can produce meaningful results, while the over-the-counter
            &ldquo;fat burners&rdquo; and &ldquo;natural&rdquo; supplements filling search results are
            largely unproven. This guide focuses on the real, medically recognized options and what
            the evidence actually shows.
          </p>
          <p>
            Prefer injections? See our guides to{" "}
            <Link href="/semaglutide" className="font-semibold text-[#0C4B75] hover:underline">semaglutide</Link>{" "}
            and{" "}
            <Link href="/tirzepatide" className="font-semibold text-[#0C4B75] hover:underline">tirzepatide</Link>{" "}
            providers.
          </p>
        </section>

        {/* Oral GLP-1s */}
        <section className="mb-12">
          <div className="mb-4 flex items-center gap-2">
            <Pill className="h-6 w-6 text-[#0C4B75]" strokeWidth={2} />
            <h2 className="text-[24px] font-bold text-[#191919]">The oral GLP-1 breakthrough</h2>
          </div>
          <p className="mb-4">
            The most exciting development in weight loss pills is the arrival of oral GLP-1
            medications — the same class as Ozempic and Wegovy, but in tablet form. These are
            closing the gap with injections and could reshape the market.
          </p>
          <DataTable colA="How it works" colB="What the evidence shows" rows={oralGlp1} />
        </section>

        {/* FDA-approved pills */}
        <section className="mb-12">
          <div className="mb-4 flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-[#0C4B75]" strokeWidth={2} />
            <h2 className="text-[24px] font-bold text-[#191919]">FDA-approved prescription weight loss pills</h2>
          </div>
          <p className="mb-4">
            Beyond GLP-1s, several oral medications are FDA-approved (or widely used off-label) for
            weight management. They work in different ways — appetite suppression, craving reduction,
            or blocking fat absorption.
          </p>
          <DataTable colA="How it works" colB="Typical results" rows={fdaPills} />
        </section>

        {/* Pills vs injections */}
        <section className="mb-12">
          <div className="mb-4 flex items-center gap-2">
            <Syringe className="h-6 w-6 text-[#0C4B75]" strokeWidth={2} />
            <h2 className="text-[24px] font-bold text-[#191919]">GLP-1 pills vs injections: which is right for you?</h2>
          </div>
          <p className="mb-4">
            The honest summary: injections currently deliver the greatest average weight loss, but
            GLP-1 pills avoid needles, can be simpler to start, and the newest oral GLP-1s are
            catching up fast. Here&rsquo;s how pills and injections compare — or read our full{" "}
            <Link href="/glp1-pills-vs-injections" className="font-semibold text-[#0C4B75] hover:underline">
              GLP-1 pills vs injections comparison
            </Link>.
          </p>
          <DataTable colA="Pills (oral)" colB="Injections" rows={pillsVsInjections} />
        </section>

        {/* OTC warning */}
        <section className="mb-12">
          <div className="flex items-start gap-4 rounded-xl border border-amber-200 bg-amber-50/60 p-6">
            <TriangleAlert className="mt-0.5 h-6 w-6 shrink-0 text-amber-500" strokeWidth={2} />
            <div>
              <h2 className="mb-2 text-[20px] font-bold text-[#191919]">A note on over-the-counter &ldquo;diet pills&rdquo;</h2>
              <p className="text-[15px] leading-[1.75] text-gray-600">
                Most non-prescription weight loss supplements — &ldquo;fat burners,&rdquo; appetite
                &ldquo;blockers,&rdquo; and herbal blends — have little to no rigorous evidence behind
                their weight loss claims, and they aren&rsquo;t regulated the way prescription
                medications are. If you&rsquo;re serious about results, a licensed clinician and an
                FDA-recognized medication are the evidence-based path.
              </p>
            </div>
          </div>
        </section>

        {/* Providers offering oral options */}
        <section className="mb-12">
          <h2 className="mb-4 text-[24px] font-bold text-[#191919]">Providers offering oral weight loss options</h2>
          <p className="mb-6">
            Several telehealth providers we review offer oral weight loss options alongside
            injections. A licensed clinician reviews your health profile and determines whether an
            oral or injectable medication is the right fit — no in-person visit required.
          </p>

          {pillProviders.length > 0 && (
            <div className="mb-6 grid gap-4 sm:grid-cols-2">
              {pillProviders.map((p) => (
                <div key={p.id} className="flex flex-col rounded-xl border border-gray-200 bg-white p-5">
                  <div className="mb-4 flex h-[34px] w-[120px] items-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.logo} alt={`${p.name} logo`} className="max-h-full max-w-full object-contain" loading="lazy" decoding="async" />
                  </div>
                  {p.highlights?.length > 0 && (
                    <ul className="mb-5 space-y-2">
                      {p.highlights.slice(0, 3).map((h, hi) => (
                        <li key={hi} className="flex items-start gap-2 text-[13px] leading-snug text-gray-600">
                          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" strokeWidth={2.5} />
                          {h}
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2">
                    <ProviderCta
                      href={p.affiliateUrl}
                      providerName={p.name}
                      providerSlug={p.id}
                      pageType="listing"
                      sourceFlow="main_comparison"
                      className="inline-flex h-[42px] items-center justify-center gap-1.5 rounded-lg bg-[#0C4B75] px-5 text-[14px] font-bold text-white transition-colors hover:bg-[#093d61]"
                    >
                      Visit {p.name}
                      <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
                    </ProviderCta>
                    <Link href={`/reviews/${p.id}`} className="text-[13px] font-bold text-[#0C4B75] hover:underline">
                      Read our review
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex h-[46px] items-center justify-center rounded-lg bg-[#0C4B75] px-6 text-[14px] font-bold text-white transition-colors hover:bg-[#093d61]"
            >
              Compare All Providers
            </Link>
            <Link
              href="/find-your-match"
              className="inline-flex h-[46px] items-center justify-center rounded-lg border border-gray-200 bg-white px-6 text-[14px] font-semibold text-[#191919] transition-colors hover:bg-gray-50"
            >
              Take the Quiz
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="mb-6 text-[24px] font-bold text-[#191919]">Weight Loss Pills: Frequently Asked Questions</h2>
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
            Sources: FDA approvals and prescribing information; published clinical trial data (STEP
            and OASIS for semaglutide, plus registration trials for Qsymia, Contrave, and orlistat).
            Weight loss figures are trial averages; individual results vary. Trademarks belong to
            their respective manufacturers.
          </p>
          <p className="text-[13px] leading-relaxed text-gray-400">
            tophairloss.io is not a medical provider and does not prescribe medications. This page is
            for educational and comparison purposes only and is not medical advice. Prescription weight
            loss medications require evaluation and supervision by a licensed healthcare provider.
            Always consult a qualified physician before starting any treatment.
          </p>
        </section>
      </div>
    </div>
  );
}
