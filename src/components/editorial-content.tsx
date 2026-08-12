import Link from "next/link";

const finVsMinRows: [string, string, string][] = [
  ["How It Works", "Blocks DHT — the hormone that shrinks (miniaturizes) hair follicles — at the source", "Stimulates follicles and prolongs the growth phase by increasing blood flow to the scalp"],
  ["Form", "Daily oral pill (topical versions also exist)", "Topical foam/solution, or low-dose oral (off-label)"],
  ["FDA Status", "FDA-approved (prescription) for male pattern hair loss", "FDA-approved (OTC topical) for men and women"],
  ["Best For", "Slowing and stopping male pattern loss at the hormonal source", "Stimulating regrowth; works for both men and women"],
  ["Who Can Use It", "Men only — not for women who are or may become pregnant", "Men and women"],
];

const oralVsTopicalRows: [string, string, string][] = [
  ["Application", "A daily pill — nothing to apply to the scalp", "Applied to the scalp once or twice daily"],
  ["Convenience", "Very convenient; easy to stay consistent", "Requires a daily scalp routine and drying time"],
  ["Availability", "Prescription (finasteride; oral minoxidil off-label)", "Topical minoxidil is available over the counter"],
  ["Best For", "People who want a simple, low-effort routine", "People who prefer to avoid or add to oral treatment"],
  ["Note", "Oral minoxidil is prescribed off-label and needs monitoring", "Topical can cause scalp irritation for some users"],
];

function ComparisonTable({ colA, colB, rows }: { colA: string; colB: string; rows: [string, string, string][] }) {
  return (
    <div className="mb-4 overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full min-w-[600px] text-left text-[14px]">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-4 py-3 font-bold text-[#191919]">Key Consideration</th>
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

export function EditorialContent() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 pt-6 pb-12 text-[16px] leading-[1.7] text-gray-700">
      <h2 className="mb-4 text-[24px] font-bold text-[#191919]">
        The Best Hair Loss Treatments and Providers, Compared
      </h2>
      <p className="mb-4">
        To find the best hair loss treatment, we compare leading telehealth providers on the factors that actually matter. Choosing the right service involves more than picking a medication — pricing, which treatments are offered, medical support, and overall value can vary significantly between providers. Not sure where to start? Try our{" "}
        <Link href="/find-your-match" className="font-semibold text-[#0C4B75] hover:underline">
          provider matching quiz
        </Link>{" "}
        for a personalized recommendation.
      </p>
      <p className="mb-4">
        To simplify the decision, we reviewed the leading hair loss services and compared them on treatment options, affordability, provider support, customer experience, and overall value. Read our{" "}
        <Link href="/reviews" className="font-semibold text-[#0C4B75] hover:underline">
          in-depth provider reviews
        </Link>{" "}
        for detailed breakdowns, or jump straight to a head-to-head like{" "}
        <Link href="/hims-vs-keeps" className="font-semibold text-[#0C4B75] hover:underline">
          Hims vs Keeps
        </Link>.
      </p>
      <p className="mb-8">
        Our goal is to help you find the provider that best fits your hair loss goals, budget, and treatment preferences.
      </p>

      <hr className="mb-8 border-gray-200" />

      <h2 className="mb-4 text-[24px] font-bold text-[#191919]">
        Hair Loss Treatment Pricing Comparison
      </h2>
      <p className="mb-4">
        Monthly costs vary depending on the provider, the treatment prescribed, and whether you choose generics, brand-name products, or a custom-compounded formula. Generic finasteride and minoxidil are often the most affordable route, while dermatologist-formulated custom treatments sit at the premium end.
      </p>
      <p className="mb-3">Most telehealth plans are subscriptions that may include:</p>
      <ul className="mb-8 list-disc space-y-1 pl-6">
        <li>Prescription treatment (finasteride, minoxidil, or a combination)</li>
        <li>An online consultation with a licensed provider</li>
        <li>Ongoing support and dosage adjustments</li>
        <li>Discreet home delivery</li>
      </ul>

      {/* Editorial callout */}
      <div className="mb-8 rounded-xl border border-[#0C4B75]/10 bg-[#0C4B75]/[0.03] p-6 sm:p-8">
        <h3 className="mb-3 text-[18px] font-bold leading-tight text-[#0C4B75] sm:text-[20px]">
          What To Know Before Starting Hair Loss Treatment
        </h3>
        <p className="mb-3 text-[16px] leading-[1.75] text-gray-600">
          Prescription treatments like finasteride require a consultation with a licensed clinician and aren&apos;t right for everyone — finasteride, in particular, is for men and is not safe for women who are or may become pregnant. Some people experience side effects, so proper medical screening matters.
        </p>
        <p className="mb-3 text-[16px] leading-[1.75] text-gray-600">
          Hair loss treatments also take time and consistency. Most people don&apos;t see visible results for 3–6 months, and the medications only keep working while you keep using them.
        </p>
        <p className="text-[16px] leading-[1.75] text-gray-600">
          That&apos;s why choosing a provider with real medical oversight and ongoing follow-up is essential for both safety and long-term results.
        </p>
      </div>

      <hr className="mb-8 border-gray-200" />

      <h2 className="mb-4 text-[24px] font-bold text-[#191919]">
        What to Consider Before Choosing a Provider
      </h2>
      <p className="mb-3">
        Before choosing a hair loss provider, it helps to weigh a few key factors:
      </p>
      <ul className="mb-8 list-disc space-y-1 pl-6">
        <li>Which treatments are offered (finasteride, minoxidil, combined, custom)</li>
        <li>Whether they treat your situation (many are men-only)</li>
        <li>Pricing and whether generics are available</li>
        <li>Level of provider support and follow-up</li>
        <li>Potential side effects and medical screening</li>
        <li>Overall value and subscription flexibility</li>
      </ul>
      <p className="mb-8">
        Comparing providers side-by-side — like{" "}
        <Link href="/hims-vs-roman" className="font-semibold text-[#0C4B75] hover:underline">
          Hims vs Roman
        </Link>,{" "}
        <Link href="/keeps-vs-roman" className="font-semibold text-[#0C4B75] hover:underline">
          Keeps vs Roman
        </Link>, or{" "}
        <Link href="/hims-vs-happy-head" className="font-semibold text-[#0C4B75] hover:underline">
          Hims vs Happy Head
        </Link>{" "}
        — makes the differences clear and helps you make a more informed decision.
      </p>

      <hr className="mb-8 border-gray-200" />

      <h2 className="mb-4 text-[24px] font-bold text-[#191919]">
        The Main Hair Loss Treatments Explained
      </h2>
      <p className="mb-4">
        Most telehealth providers offer some combination of the same evidence-backed treatments. The two proven, FDA-approved options are finasteride and minoxidil — and they&apos;re often most effective when used together.
      </p>

      <div className="mb-8 overflow-hidden rounded-xl border border-gray-200">
        <table className="w-full text-left text-[14px]">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-4 py-3 font-bold text-[#191919]">Treatment</th>
              <th className="px-4 py-3 font-bold text-[#191919]">What It Does</th>
              <th className="hidden sm:table-cell px-4 py-3 font-bold text-[#191919]">Form</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr>
              <td className="px-4 py-3 font-medium">Finasteride</td>
              <td className="px-4 py-3">Blocks DHT to slow and stop male pattern loss</td>
              <td className="hidden sm:table-cell px-4 py-3">Oral pill (Rx); topical exists</td>
            </tr>
            <tr className="bg-gray-50/50">
              <td className="px-4 py-3 font-medium">Minoxidil</td>
              <td className="px-4 py-3">Stimulates regrowth; works for men and women</td>
              <td className="hidden sm:table-cell px-4 py-3">Topical (OTC) or low-dose oral</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium">Dutasteride</td>
              <td className="px-4 py-3">A stronger DHT blocker, used off-label</td>
              <td className="hidden sm:table-cell px-4 py-3">Oral pill (Rx, off-label)</td>
            </tr>
            <tr className="bg-gray-50/50">
              <td className="px-4 py-3 font-medium">Ketoconazole shampoo</td>
              <td className="px-4 py-3">A supporting, DHT-targeting topical adjunct</td>
              <td className="hidden sm:table-cell px-4 py-3">Shampoo</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mb-4 text-[13px] text-gray-400">
        Finasteride and topical minoxidil are the only FDA-approved medications for pattern hair loss. Dutasteride and oral minoxidil are prescribed off-label. Individual results vary; prescription treatments require a licensed clinician.
      </p>

      <h3 className="mb-3 mt-8 text-[20px] font-bold text-[#191919]">
        Finasteride vs Minoxidil
      </h3>
      <p className="mb-4">
        Finasteride and minoxidil are the two most-used hair loss treatments. They work in completely different ways — one blocks the hormone behind hair loss, the other stimulates regrowth — which is why many providers prescribe them together.
      </p>
      <ComparisonTable colA="Finasteride" colB="Minoxidil" rows={finVsMinRows} />

      <h3 className="mb-3 mt-8 text-[20px] font-bold text-[#191919]">
        Oral vs Topical Treatment
      </h3>
      <p className="mb-4">
        Some treatments are taken as a daily pill, others applied directly to the scalp. The right choice usually comes down to convenience versus your preference for avoiding oral medication.
      </p>
      <ComparisonTable colA="Oral" colB="Topical" rows={oralVsTopicalRows} />

      <h3 className="mb-3 mt-8 text-[18px] font-bold text-[#191919]">
        How Much Does Hair Loss Treatment Cost?
      </h3>
      <p className="mb-3">
        Through telehealth providers, generic finasteride typically runs about $20–$30/month and minoxidil about $15/month, with lower effective pricing on longer plans. Combined routines and brand-name or custom-compounded formulas cost more — dermatologist-formulated custom treatments generally range from about $35–$79/month. No insurance is required; the monthly cost includes the medication and provider oversight.
      </p>

      <h3 className="mb-3 mt-6 text-[18px] font-bold text-[#191919]">
        How Long Does It Take to See Results?
      </h3>
      <p className="mb-3">
        Hair loss treatment takes patience. Most people first notice reduced shedding within a couple of months, with visible regrowth typically starting around 3–6 months and continuing to improve up to about 12 months. Results only last while you keep treatment going.
      </p>

      <h3 className="mb-3 mt-6 text-[18px] font-bold text-[#191919]">
        Can You Get Hair Loss Treatment Online?
      </h3>
      <p className="mb-8">
        Yes. Licensed telehealth providers can prescribe finasteride, minoxidil, and combined treatments through a fully online evaluation, usually shipped discreetly within a few days. Every provider we feature uses licensed clinicians for prescribing and includes ongoing medical oversight.
      </p>

      <hr className="mb-8 border-gray-200" />

      <h2 className="mb-4 text-[24px] font-bold text-[#191919]">
        How We Evaluated Providers
      </h2>
      <p className="mb-3">Our rankings are based on a combination of factors including:</p>
      <ul className="mb-4 list-disc space-y-1 pl-6">
        <li>Pricing transparency and value</li>
        <li>Range of treatments offered</li>
        <li>Medical oversight and provider support</li>
        <li>Customer experience</li>
        <li>Who they treat (men, women, or both)</li>
        <li>Subscription flexibility</li>
      </ul>
      <p>
        We continuously review and update our recommendations to help you{" "}
        <Link href="/reviews" className="font-semibold text-[#0C4B75] hover:underline">
          compare leading hair loss providers
        </Link>{" "}
        with confidence. Browse all{" "}
        <Link href="/articles" className="font-semibold text-[#0C4B75] hover:underline">
          hair loss guides
        </Link>{" "}
        for more research.
      </p>
    </div>
  );
}
