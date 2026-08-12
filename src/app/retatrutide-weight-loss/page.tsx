import type { Metadata } from "next";
import Link from "next/link";
import { FlaskConical, TriangleAlert, ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { LastUpdated } from "@/components/last-updated";
import { CONTENT_LAST_UPDATED } from "@/lib/config";

export const revalidate = 60;

const CANONICAL = "https://www.tophairloss.io/retatrutide-weight-loss";

export const metadata: Metadata = {
  title: "Retatrutide for Weight Loss (2026): Results, Status & Reta vs Tirzepatide",
  description:
    "Retatrutide (“reta”) is the triple-agonist weight loss drug that hit ~24% weight loss in trials. What it is, how it compares to tirzepatide and semaglutide, and whether you can get it yet.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Retatrutide for Weight Loss (2026): Results, Status & Reta vs Tirzepatide",
    description:
      "The triple-agonist weight loss drug that reached ~24% in trials — explained, with an honest look at availability.",
    url: CANONICAL,
    type: "article",
  },
};

const compareRows: [string, string, string][] = [
  ["Drug class", "Triple agonist — GLP-1 + GIP + glucagon", "See below"],
  ["Average weight loss (trials)", "Up to ~24% at 48 weeks (Phase 2)", "Tirzepatide ~20%+ · Semaglutide ~15%"],
  ["Format", "Once-weekly injection", "Once-weekly injection (both)"],
  ["FDA status", "Investigational — not yet approved", "Tirzepatide & semaglutide are FDA-approved"],
  ["Availability", "Not available to prescribe yet", "Available now via licensed providers"],
];

const faqs: { question: string; answer: string }[] = [
  { question: "What is retatrutide?", answer: "Retatrutide (sometimes called “reta” or a “triple agonist”) is an investigational once-weekly injection from Eli Lilly. Unlike semaglutide (a GLP-1) or tirzepatide (a dual GLP-1/GIP), retatrutide targets three receptors at once — GLP-1, GIP, and glucagon — which is why it has produced the largest weight loss of any drug in trials so far." },
  { question: "How much weight loss does retatrutide cause?", answer: "In a Phase 2 trial, participants on the highest dose lost about 24% of their body weight over 48 weeks — more than tirzepatide (~20%) or semaglutide (~15%) in their trials. These are early results; larger Phase 3 trials are underway to confirm them." },
  { question: "Is retatrutide FDA approved?", answer: "No. As of 2026, retatrutide is investigational and has not been approved by the FDA for weight loss or any other use. It is being studied in late-stage (Phase 3) clinical trials." },
  { question: "When will retatrutide be available?", answer: "It depends on the outcome of its Phase 3 program and FDA review. Industry expectations point to a potential approval in the 2026–2027 window, but timelines can shift. Until it's approved, it cannot be legitimately prescribed for weight loss." },
  { question: "Retatrutide vs tirzepatide — which is more effective?", answer: "In their respective trials, retatrutide produced more weight loss (~24%) than tirzepatide (~20%+). But tirzepatide is FDA-approved and available today, while retatrutide is still investigational. For most people the practical comparison is between the approved options — with retatrutide as a promising future addition." },
  { question: "Can you buy retatrutide now?", answer: "No. Because it isn't FDA-approved, retatrutide is not legitimately available to purchase or be prescribed for weight loss. Be cautious of any site claiming to sell “retatrutide” — sourcing an unapproved drug carries real safety and legal risks. Stick to approved medications prescribed by a licensed clinician." },
];

export default function RetatrutidePage() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Retatrutide for Weight Loss (2026): Results, Status & Reta vs Tirzepatide",
    description: metadata.description,
    datePublished: "2026-08-09",
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
      { "@type": "ListItem", position: 2, name: "Retatrutide", item: CANONICAL },
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
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Retatrutide" }]} />
          <h1 className="text-[28px] font-extrabold text-[#191919] sm:text-[36px]">
            Retatrutide for Weight Loss: The Next-Gen Drug, Explained
          </h1>
          <p className="mt-3 max-w-[640px] text-[16px] leading-relaxed text-gray-500">
            Retatrutide (&ldquo;reta&rdquo;) reached roughly 24% weight loss in trials — the most of
            any weight loss drug so far. Here&rsquo;s what it is, how it stacks up against tirzepatide
            and semaglutide, and an honest answer on whether you can actually get it.
          </p>
          <LastUpdated date={CONTENT_LAST_UPDATED} className="mt-4" />
        </div>
      </div>

      <div className="mx-auto max-w-[900px] px-4 py-10 text-[16px] leading-[1.75] text-gray-700 sm:px-6">
        {/* Status callout — set expectations up front */}
        <div className="mb-10 flex items-start gap-4 rounded-2xl border border-amber-200 bg-amber-50/60 p-6">
          <TriangleAlert className="mt-0.5 h-6 w-6 shrink-0 text-amber-500" strokeWidth={2} />
          <div>
            <h2 className="mb-2 text-[18px] font-bold text-[#191919]">First, the honest part</h2>
            <p className="text-[15px] leading-[1.75] text-gray-600">
              Retatrutide is <strong className="text-[#191919]">not yet FDA-approved</strong> and
              can&rsquo;t be legitimately prescribed or purchased for weight loss. It&rsquo;s in
              late-stage trials, with a possible approval in the 2026&ndash;2027 window. This page
              explains the science and how it compares — and points you to the approved options you
              can use today.
            </p>
          </div>
        </div>

        {/* What it is */}
        <section className="mb-12">
          <div className="mb-4 flex items-center gap-2">
            <FlaskConical className="h-6 w-6 text-[#0C4B75]" strokeWidth={2} />
            <h2 className="text-[24px] font-bold text-[#191919]">What is retatrutide?</h2>
          </div>
          <p className="mb-4">
            Retatrutide is an investigational once-weekly injection from Eli Lilly. What makes it
            different is that it&rsquo;s a <strong className="text-[#191919]">triple agonist</strong>:
            it activates three receptors at once — GLP-1 and GIP (like tirzepatide) plus a third,
            glucagon. That extra target is thought to boost metabolism and fat burning on top of the
            appetite effects, which is why it has produced the largest weight loss seen in trials so far.
          </p>
        </section>

        {/* Comparison */}
        <section className="mb-12">
          <h2 className="mb-4 text-[24px] font-bold text-[#191919]">Retatrutide vs tirzepatide vs semaglutide</h2>
          <div className="mb-4 overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full min-w-[640px] text-left text-[14px]">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 font-bold text-[#191919]">Factor</th>
                  <th className="px-4 py-3 font-bold text-[#191919]">Retatrutide</th>
                  <th className="px-4 py-3 font-bold text-[#191919]">Tirzepatide / Semaglutide</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {compareRows.map(([k, a, b], i) => (
                  <tr key={i} className={i % 2 === 1 ? "bg-gray-50/50" : ""}>
                    <td className="px-4 py-3 align-top font-medium text-[#191919]">{k}</td>
                    <td className="px-4 py-3 align-top text-gray-600">{a}</td>
                    <td className="px-4 py-3 align-top text-gray-600">{b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[14px] text-gray-500">
            Compare the approved options in our{" "}
            <Link href="/tirzepatide" className="font-semibold text-[#0C4B75] hover:underline">tirzepatide</Link>{" "}
            and{" "}
            <Link href="/semaglutide" className="font-semibold text-[#0C4B75] hover:underline">semaglutide</Link>{" "}
            guides.
          </p>
        </section>

        {/* Trial results */}
        <section className="mb-12">
          <h2 className="mb-4 text-[24px] font-bold text-[#191919]">What the trials show</h2>
          <p className="mb-4">
            In a Phase 2 study published in 2023, participants on the highest retatrutide dose lost
            about <strong className="text-[#191919]">24% of their body weight over 48 weeks</strong> —
            ahead of tirzepatide (~20%) and semaglutide (~15%) in their own trials. Larger{" "}
            <strong className="text-[#191919]">Phase 3 trials are now underway</strong> to confirm the
            effect and its long-term safety. Early results are promising, but Phase 3 outcomes and FDA
            review are what determine whether — and when — it reaches patients.
          </p>
        </section>

        {/* What to use now */}
        <section className="mb-12">
          <h2 className="mb-4 text-[24px] font-bold text-[#191919]">What you can use today</h2>
          <p className="mb-6">
            Since retatrutide isn&rsquo;t available yet, the most effective approved options are
            tirzepatide (~20% weight loss) and semaglutide (~15%). Both are prescribed online by
            licensed telehealth providers, often as affordable compounded versions. Compare providers
            on pricing, medical support, and value.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/" className="inline-flex h-[46px] items-center justify-center gap-2 rounded-lg bg-[#0C4B75] px-6 text-[14px] font-bold text-white transition-colors hover:bg-[#093d61]">
              Compare Top Providers
              <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
            </Link>
            <Link href="/glp1-pills-vs-injections" className="inline-flex h-[46px] items-center justify-center rounded-lg border border-gray-200 bg-white px-6 text-[14px] font-semibold text-[#191919] transition-colors hover:bg-gray-50">
              Pills vs Injections
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="mb-6 text-[24px] font-bold text-[#191919]">Retatrutide: Frequently Asked Questions</h2>
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
            Sources: Phase 2 retatrutide trial results (New England Journal of Medicine, 2023) and
            manufacturer trial program information; published data for tirzepatide (SURMOUNT) and
            semaglutide (STEP). Trial figures are averages; individual results vary. Brand and drug
            names are trademarks of their respective manufacturers.
          </p>
          <p className="text-[13px] leading-relaxed text-gray-400">
            tophairloss.io is not a medical provider and does not prescribe medications. This page is
            for educational purposes only and is not medical advice. Retatrutide is investigational and
            not FDA-approved. Always consult a licensed healthcare provider about approved treatment
            options.
          </p>
        </section>
      </div>
    </div>
  );
}
