import Link from "next/link";
import type { LandingEditorialSection } from "@/lib/config";

interface LandingEditorialProps {
  sections: LandingEditorialSection[];
}

export function LandingEditorial({ sections }: LandingEditorialProps) {
  return (
    <div className="mx-auto max-w-[1200px] px-4 pt-6 pb-12 text-[16px] leading-[1.7] text-gray-700">
      {sections.map((section, i) => (
        <div key={i}>
          {i > 0 && <hr className="mb-8 border-gray-200" />}
          <h2 className="mb-4 text-[24px] font-bold text-[#191919]">
            {section.heading}
          </h2>
          <p
            className="mb-4 [&_a]:font-semibold [&_a]:text-[#0C4B75] hover:[&_a]:underline"
            dangerouslySetInnerHTML={{ __html: section.body }}
          />
          {section.bullets && section.bullets.length > 0 && (
            <ul className="mb-8 list-disc space-y-1 pl-6">
              {section.bullets.map((bullet, j) => (
                <li key={j}>{bullet}</li>
              ))}
            </ul>
          )}
        </div>
      ))}

      <hr className="mb-8 border-gray-200" />

      <p className="text-[15px] text-gray-500">
        We continuously review and update our recommendations. Browse all{" "}
        <Link
          href="/articles"
          className="font-semibold text-[#0C4B75] hover:underline"
        >
          weight loss articles
        </Link>{" "}
        for more research and guides, or{" "}
        <Link
          href="/find-your-match"
          className="font-semibold text-[#0C4B75] hover:underline"
        >
          take our matching quiz
        </Link>{" "}
        for a personalized recommendation.
      </p>
    </div>
  );
}
