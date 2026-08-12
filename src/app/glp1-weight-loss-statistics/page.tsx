import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "GLP-1 Weight Loss Statistics & Data (2026) — Clinical Trial Results",
  description:
    "Comprehensive GLP-1 weight loss statistics: clinical trial results for semaglutide, tirzepatide, and liraglutide. Average weight loss, costs, side effects, and treatment timelines.",
  alternates: {
    canonical: "https://www.tophairloss.io/glp1-weight-loss-statistics",
  },
};

export default function StatisticsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-[900px] px-4 py-10 sm:px-6 sm:py-14">
          <h1 className="text-[26px] font-extrabold text-[#191919] sm:text-[34px]">
            GLP-1 Weight Loss Statistics & Data (2026)
          </h1>
          <p className="mt-3 max-w-[600px] text-[15px] leading-relaxed text-gray-500">
            Key statistics from published clinical trials on GLP-1 weight loss medications.
            Data sourced from STEP, SURMOUNT, and SCALE trials.
          </p>
          <p className="mt-2 text-[12px] text-gray-400">Last updated: July 2026</p>
        </div>
      </div>

      <div className="mx-auto max-w-[900px] px-4 py-10 sm:px-6">

        {/* Weight Loss Results */}
        <section className="mb-10">
          <h2 className="mb-4 text-[22px] font-bold text-[#191919]">Average Weight Loss by Medication</h2>
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <table className="w-full text-left text-[14px]">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-5 py-3 font-bold text-[#191919]">Medication</th>
                  <th className="px-5 py-3 font-bold text-[#191919]">Active Ingredient</th>
                  <th className="px-5 py-3 font-bold text-[#191919]">Avg. Weight Loss</th>
                  <th className="px-5 py-3 font-bold text-[#191919]">Trial</th>
                  <th className="hidden sm:table-cell px-5 py-3 font-bold text-[#191919]">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-5 py-3 font-medium">Wegovy</td>
                  <td className="px-5 py-3">Semaglutide 2.4mg</td>
                  <td className="px-5 py-3 font-semibold text-[#0C4B75]">~15% of body weight</td>
                  <td className="px-5 py-3">STEP 1</td>
                  <td className="hidden sm:table-cell px-5 py-3">68 weeks</td>
                </tr>
                <tr className="bg-gray-50/50">
                  <td className="px-5 py-3 font-medium">Zepbound</td>
                  <td className="px-5 py-3">Tirzepatide 15mg</td>
                  <td className="px-5 py-3 font-semibold text-[#0C4B75]">Up to 22.5% of body weight</td>
                  <td className="px-5 py-3">SURMOUNT-1</td>
                  <td className="hidden sm:table-cell px-5 py-3">72 weeks</td>
                </tr>
                <tr>
                  <td className="px-5 py-3 font-medium">Ozempic</td>
                  <td className="px-5 py-3">Semaglutide 2mg</td>
                  <td className="px-5 py-3 font-semibold text-[#0C4B75]">~10–12% of body weight</td>
                  <td className="px-5 py-3">SUSTAIN</td>
                  <td className="hidden sm:table-cell px-5 py-3">40 weeks</td>
                </tr>
                <tr className="bg-gray-50/50">
                  <td className="px-5 py-3 font-medium">Mounjaro</td>
                  <td className="px-5 py-3">Tirzepatide 15mg</td>
                  <td className="px-5 py-3 font-semibold text-[#0C4B75]">Up to 22.5% of body weight</td>
                  <td className="px-5 py-3">SURMOUNT-1</td>
                  <td className="hidden sm:table-cell px-5 py-3">72 weeks</td>
                </tr>
                <tr>
                  <td className="px-5 py-3 font-medium">Saxenda</td>
                  <td className="px-5 py-3">Liraglutide 3mg</td>
                  <td className="px-5 py-3 font-semibold text-[#0C4B75]">~5–8% of body weight</td>
                  <td className="px-5 py-3">SCALE</td>
                  <td className="hidden sm:table-cell px-5 py-3">56 weeks</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-[12px] text-gray-400">Source: Published clinical trial results. Individual results vary.</p>
        </section>

        {/* Cost Data */}
        <section className="mb-10">
          <h2 className="mb-4 text-[22px] font-bold text-[#191919]">Monthly Cost Comparison (2026)</h2>
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <table className="w-full text-left text-[14px]">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-5 py-3 font-bold text-[#191919]">Option</th>
                  <th className="px-5 py-3 font-bold text-[#191919]">Monthly Cost</th>
                  <th className="hidden sm:table-cell px-5 py-3 font-bold text-[#191919]">Includes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-5 py-3 font-medium">Wegovy (brand-name)</td>
                  <td className="px-5 py-3">$1,300–$1,400/month</td>
                  <td className="hidden sm:table-cell px-5 py-3">Medication only</td>
                </tr>
                <tr className="bg-gray-50/50">
                  <td className="px-5 py-3 font-medium">Ozempic (brand-name)</td>
                  <td className="px-5 py-3">$900–$1,000/month</td>
                  <td className="hidden sm:table-cell px-5 py-3">Medication only</td>
                </tr>
                <tr>
                  <td className="px-5 py-3 font-medium">Zepbound (brand-name)</td>
                  <td className="px-5 py-3">$1,000–$1,100/month</td>
                  <td className="hidden sm:table-cell px-5 py-3">Medication only</td>
                </tr>
                <tr className="bg-gray-50/50">
                  <td className="px-5 py-3 font-medium">Compounded semaglutide</td>
                  <td className="px-5 py-3 font-semibold text-emerald-600">$199–$400/month</td>
                  <td className="hidden sm:table-cell px-5 py-3">Medication + consultations + delivery</td>
                </tr>
                <tr>
                  <td className="px-5 py-3 font-medium">Compounded tirzepatide</td>
                  <td className="px-5 py-3 font-semibold text-emerald-600">$300–$500/month</td>
                  <td className="hidden sm:table-cell px-5 py-3">Medication + consultations + delivery</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-[12px] text-gray-400">Source: Retail pricing and telehealth provider rates as of July 2026. Prices may vary by provider.</p>
        </section>

        {/* Side Effects */}
        <section className="mb-10">
          <h2 className="mb-4 text-[22px] font-bold text-[#191919]">Most Common Side Effects</h2>
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <table className="w-full text-left text-[14px]">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-5 py-3 font-bold text-[#191919]">Side Effect</th>
                  <th className="px-5 py-3 font-bold text-[#191919]">Semaglutide</th>
                  <th className="px-5 py-3 font-bold text-[#191919]">Tirzepatide</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr><td className="px-5 py-3 font-medium">Nausea</td><td className="px-5 py-3">40–45%</td><td className="px-5 py-3">35–40%</td></tr>
                <tr className="bg-gray-50/50"><td className="px-5 py-3 font-medium">Diarrhea</td><td className="px-5 py-3">~30%</td><td className="px-5 py-3">~25%</td></tr>
                <tr><td className="px-5 py-3 font-medium">Vomiting</td><td className="px-5 py-3">~25%</td><td className="px-5 py-3">~20%</td></tr>
                <tr className="bg-gray-50/50"><td className="px-5 py-3 font-medium">Constipation</td><td className="px-5 py-3">~24%</td><td className="px-5 py-3">~20%</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-[12px] text-gray-400">Source: Published clinical trial safety data. Side effects typically improve over time and with dose stabilization.</p>
        </section>

        {/* Timeline */}
        <section className="mb-10">
          <h2 className="mb-4 text-[22px] font-bold text-[#191919]">Weight Loss Timeline</h2>
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <table className="w-full text-left text-[14px]">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-5 py-3 font-bold text-[#191919]">Timeframe</th>
                  <th className="px-5 py-3 font-bold text-[#191919]">What to Expect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr><td className="px-5 py-3 font-medium">Week 1–2</td><td className="px-5 py-3">Reduced appetite, early satiety, possible mild nausea</td></tr>
                <tr className="bg-gray-50/50"><td className="px-5 py-3 font-medium">Month 1</td><td className="px-5 py-3">3–5 lbs weight loss (starting dose)</td></tr>
                <tr><td className="px-5 py-3 font-medium">Month 2–3</td><td className="px-5 py-3">5–10% body weight loss as dose increases</td></tr>
                <tr className="bg-gray-50/50"><td className="px-5 py-3 font-medium">Month 6</td><td className="px-5 py-3">10–15% body weight loss (semaglutide) or 15–20% (tirzepatide)</td></tr>
                <tr><td className="px-5 py-3 font-medium">Month 12–16</td><td className="px-5 py-3">Maximum results: 15% (semaglutide) to 22.5% (tirzepatide)</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-[12px] text-gray-400">Source: Clinical trial averages. Individual results vary based on medication, dose, diet, and exercise.</p>
        </section>

        {/* Eligibility */}
        <section className="mb-10">
          <h2 className="mb-4 text-[22px] font-bold text-[#191919]">Who Qualifies for GLP-1 Treatment?</h2>
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <p className="mb-4 text-[15px] leading-[1.7] text-gray-600">
              According to FDA-approved prescribing criteria, GLP-1 weight loss medications
              are indicated for adults with:
            </p>
            <ul className="mb-4 space-y-2 text-[15px] text-gray-700">
              <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0C4B75]" />BMI ≥ 30 (obesity)</li>
              <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0C4B75]" />BMI ≥ 27 with at least one weight-related condition (type 2 diabetes, hypertension, high cholesterol, sleep apnea)</li>
            </ul>
            <p className="text-[14px] text-gray-500">
              Read our complete{" "}
              <Link href="/articles/who-qualifies-for-glp1-weight-loss" className="font-semibold text-[#0C4B75] hover:underline">eligibility guide</Link> or{" "}
              <Link href="/find-your-match" className="font-semibold text-[#0C4B75] hover:underline">take our quiz</Link> to check if you qualify.
            </p>
          </div>
        </section>

        {/* Key Facts */}
        <section className="mb-10">
          <h2 className="mb-4 text-[22px] font-bold text-[#191919]">Key Facts About GLP-1 Weight Loss</h2>
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <ul className="space-y-3 text-[15px] leading-[1.7] text-gray-600">
              <li><strong className="text-[#191919]">Most effective prescription weight loss:</strong> GLP-1 medications produce 3–5x more weight loss than older weight loss drugs and lifestyle intervention alone.</li>
              <li><strong className="text-[#191919]">Once-weekly injection:</strong> Both semaglutide and tirzepatide are administered as once-weekly subcutaneous injections.</li>
              <li><strong className="text-[#191919]">Gradual dose escalation:</strong> Treatment starts at a low dose and increases monthly over 16–20 weeks to minimize side effects.</li>
              <li><strong className="text-[#191919]">Available online:</strong> Licensed telehealth providers can prescribe GLP-1 medications through fully online medical evaluations, with home delivery in most US states.</li>
              <li><strong className="text-[#191919]">Weight regain risk:</strong> The STEP 1 trial extension showed approximately two-thirds of weight lost was regained within one year of stopping semaglutide, supporting the case for ongoing treatment.</li>
              <li><strong className="text-[#191919]">Dual-agonist advantage:</strong> Tirzepatide targets both GLP-1 and GIP receptors, which may explain its superior weight loss results compared to semaglutide.</li>
            </ul>
          </div>
        </section>

        {/* CTA */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 text-center">
          <p className="mb-2 text-[16px] font-bold text-[#191919]">Compare GLP-1 Providers</p>
          <p className="mb-4 text-[14px] text-gray-500">See how the top telehealth weight loss providers compare on pricing, medications, and support.</p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/" className="inline-flex h-[44px] items-center justify-center rounded-lg bg-[#0C4B75] px-6 text-[14px] font-bold text-white transition-colors hover:bg-[#093d61]">
              Compare Providers
            </Link>
            <Link href="/find-your-match" className="inline-flex h-[44px] items-center justify-center rounded-lg border border-gray-200 bg-white px-6 text-[14px] font-semibold text-[#191919] transition-colors hover:bg-gray-50">
              Take the Quiz
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
