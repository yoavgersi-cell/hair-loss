import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer — FTC Disclosure & Affiliate Information",
  description:
    "FTC disclosure, affiliate relationship details, medical disclaimer, and revenue model transparency for tophairloss.io.",
  alternates: {
    canonical: "https://www.tophairloss.io/disclaimer",
  },
};

export default function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="mb-6 text-3xl font-bold text-[#191919]">Disclaimer</h1>
      <div className="space-y-4 text-gray-600 leading-relaxed">
        <h2 className="text-xl font-semibold text-[#191919]">
          FTC Disclosure
        </h2>
        <p>
          In accordance with the Federal Trade Commission guidelines, TopHairLoss
          discloses that this website contains affiliate links. When you click
          on a link and make a purchase or sign up for a service, we may receive
          a commission at no additional cost to you.
        </p>

        <h2 className="pt-4 text-xl font-semibold text-[#191919]">
          Affiliate Relationships
        </h2>
        <p>
          TopHairLoss participates in affiliate programs with various weight loss
          medication providers and telehealth platforms. This means we may earn
          referral fees when visitors click through our links and complete
          qualifying actions. These relationships help support the operation of
          this website.
        </p>

        <h2 className="pt-4 text-xl font-semibold text-[#191919]">
          Editorial Independence
        </h2>
        <p>
          Our affiliate relationships do not influence our rankings or reviews.
          Products are evaluated based on objective criteria including clinical
          data, safety profiles, and user feedback. We are committed to
          providing honest, independent assessments regardless of compensation.
        </p>

        <h2 className="pt-4 text-xl font-semibold text-[#191919]">
          Medical Disclaimer
        </h2>
        <p>
          The content on TopHairLoss is for informational purposes only and is not
          intended as medical advice. Weight loss medications carry potential
          risks and side effects. Always consult with a licensed healthcare
          professional before making decisions about your health or starting
          any medication.
        </p>

        <h2 className="pt-4 text-xl font-semibold text-[#191919]">
          Revenue Model
        </h2>
        <p>
          TopHairLoss generates revenue primarily through affiliate commissions.
          When you use our links to visit a provider&apos;s website and take a
          qualifying action (such as scheduling a consultation or making a
          purchase), we may receive compensation. This model allows us to
          provide free, accessible comparisons to our visitors.
        </p>
      </div>
    </div>
  );
}
