import type { Metadata } from "next";
import Link from "next/link";
import { Clock, ArrowRight, Trophy } from "lucide-react";
import { getConfig } from "@/lib/config-store";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Hair Loss Articles — Research, Guides & Expert Insights",
  description:
    "Expert articles on hair loss treatments, finasteride and minoxidil, and choosing the right telehealth provider. Evidence-based guides updated regularly.",
  alternates: {
    canonical: "https://www.tophairloss.io/articles",
  },
  openGraph: {
    title: "Hair Loss Articles — Research, Guides & Expert Insights",
    description:
      "Expert articles on hair loss treatments and choosing the right provider.",
    url: "https://www.tophairloss.io/articles",
  },
};

const categoryColors: Record<string, string> = {
  Science: "bg-blue-50 text-blue-700",
  Guide: "bg-emerald-50 text-emerald-700",
  Advice: "bg-amber-50 text-amber-700",
  Wellness: "bg-purple-50 text-purple-700",
};

export default async function ArticlesPage() {
  const config = await getConfig();
  const articles = config.articles ?? [];

  // Standalone in-depth guide pages (custom layouts, not CMS articles)
  const guides = [
    { title: "Finasteride vs Minoxidil", href: "/articles/finasteride-vs-minoxidil", category: "Comparison", description: "The two proven treatments compared — how they work, and why many people use both." },
    { title: "Does Finasteride Work?", href: "/articles/does-finasteride-work", category: "Science", description: "The evidence, the timeline, and what results to realistically expect." },
    { title: "How Much Does Treatment Cost?", href: "/articles/hair-loss-treatment-cost", category: "Guide", description: "From cheap generics to premium custom formulas — real telehealth pricing." },
    { title: "Male Pattern Baldness Explained", href: "/articles/male-pattern-baldness-explained", category: "Science", description: "What causes it, how it progresses, and what actually stops it." },
    { title: "Women's Hair Loss Treatment", href: "/articles/womens-hair-loss-treatment", category: "Guide", description: "What's safe, what's effective, and where finasteride fits (and doesn't)." },
  ];

  // Head-to-head comparison (battle) pages, with both providers resolved
  const comparisons = (config.battles ?? [])
    .map((battle) => {
      const p1 = config.providers.find((p) => p.id === battle.provider1Id);
      const p2 = config.providers.find((p) => p.id === battle.provider2Id);
      if (!p1 || !p2) return null;
      const winner = battle.winnerId === p1.id ? p1 : battle.winnerId === p2.id ? p2 : null;
      return { battle, p1, p2, winner };
    })
    .filter((c): c is NonNullable<typeof c> => c !== null);

  if (articles.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-[1100px] px-4 py-12 sm:px-6">
          <h1 className="text-[28px] font-bold text-[#191919]">Articles</h1>
          <p className="mt-4 text-gray-500">No articles yet. Check back soon.</p>
        </div>
      </div>
    );
  }

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Hair Loss Articles — Research, Guides & Expert Insights",
    description: "Expert articles on hair loss treatments, finasteride and minoxidil, and choosing the right telehealth provider.",
    url: "https://www.tophairloss.io/articles",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: articles.length + comparisons.length,
      itemListElement: [
        ...articles.map((a, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: a.title,
          url: `https://www.tophairloss.io/articles/${a.slug}`,
        })),
        ...guides.map((g, i) => ({
          "@type": "ListItem",
          position: articles.length + i + 1,
          name: g.title,
          url: `https://www.tophairloss.io${g.href}`,
        })),
        ...comparisons.map(({ battle, p1, p2 }, i) => ({
          "@type": "ListItem",
          position: articles.length + guides.length + i + 1,
          name: `${p1.name} vs ${p2.name}`,
          url: `https://www.tophairloss.io/${battle.slug}`,
        })),
      ],
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <div className="mx-auto max-w-[1100px] px-4 py-12 sm:px-6">
        {/* Page header */}
        <div className="mb-10">
          <h1 className="text-[28px] font-bold text-[#191919] sm:text-[36px]">
            Articles
          </h1>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-gray-500">
            Evidence-based guides on hair loss treatments, what to expect, and
            making informed decisions about your hair.
          </p>
        </div>

        {/* Featured article (first one) */}
        <Link
          href={`/articles/${articles[0].slug}`}
          className="group mb-8 block overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-md"
        >
          <div className="flex flex-col sm:flex-row">
            <div
              className="flex h-[180px] items-center justify-center sm:h-auto sm:w-[340px] sm:shrink-0"
              style={{ backgroundColor: articles[0].heroColor }}
            >
              <span className="text-[40px] font-extrabold text-[#191919]/10 select-none">
                01
              </span>
            </div>
            <div className="flex flex-1 flex-col justify-center p-6 sm:p-8">
              <div className="mb-3 flex items-center gap-3">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${categoryColors[articles[0].category] || "bg-gray-100 text-gray-600"}`}
                >
                  {articles[0].category}
                </span>
                <span className="flex items-center gap-1 text-[12px] text-gray-400">
                  <Clock className="h-3 w-3" strokeWidth={1.5} />
                  {articles[0].readTime}
                </span>
              </div>
              <h2 className="text-[20px] font-bold leading-tight text-[#191919] group-hover:text-[#0C4B75] transition-colors sm:text-[22px]">
                {articles[0].title}
              </h2>
              <p className="mt-2 text-[14px] leading-relaxed text-gray-500 line-clamp-2">
                {articles[0].description}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#0C4B75]">
                Read article
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
              </span>
            </div>
          </div>
        </Link>

        {/* Grid of remaining articles */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.slice(1).map((article, i) => (
            <Link
              key={article.slug}
              href={`/articles/${article.slug}`}
              className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-md"
            >
              <div
                className="flex h-[140px] items-center justify-center"
                style={{ backgroundColor: article.heroColor }}
              >
                <span className="text-[36px] font-extrabold text-[#191919]/10 select-none">
                  {String(i + 2).padStart(2, "0")}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="mb-2.5 flex items-center gap-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${categoryColors[article.category] || "bg-gray-100 text-gray-600"}`}
                  >
                    {article.category}
                  </span>
                  <span className="flex items-center gap-1 text-[12px] text-gray-400">
                    <Clock className="h-3 w-3" strokeWidth={1.5} />
                    {article.readTime}
                  </span>
                </div>
                <h2 className="text-[16px] font-bold leading-snug text-[#191919] group-hover:text-[#0C4B75] transition-colors">
                  {article.title}
                </h2>
                <p className="mt-2 flex-1 text-[13px] leading-relaxed text-gray-500 line-clamp-3">
                  {article.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#0C4B75]">
                  Read article
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* ───── In-Depth Guides ───── */}
        {guides.length > 0 && (
          <div className="mt-14">
            <div className="mb-8">
              <h2 className="text-[22px] font-bold text-[#191919] sm:text-[26px]">
                In-Depth Guides
              </h2>
              <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-gray-500">
                Deeper explainers on medications and options — with side-by-side data.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {guides.map((g) => (
                <Link
                  key={g.href}
                  href={g.href}
                  className="group flex flex-col rounded-xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md"
                >
                  <span
                    className={`mb-3 inline-flex w-fit rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${categoryColors[g.category] || "bg-gray-100 text-gray-600"}`}
                  >
                    {g.category}
                  </span>
                  <h3 className="text-[16px] font-bold leading-snug text-[#191919] transition-colors group-hover:text-[#0C4B75]">
                    {g.title}
                  </h3>
                  <p className="mt-2 flex-1 text-[13px] leading-relaxed text-gray-500 line-clamp-3">
                    {g.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#0C4B75]">
                    Read guide
                    <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ───── Head-to-Head Comparisons ───── */}
        {comparisons.length > 0 && (
          <div className="mt-14">
            <div className="mb-8">
              <h2 className="text-[22px] font-bold text-[#191919] sm:text-[26px]">
                Head-to-Head Comparisons
              </h2>
              <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-gray-500">
                Can&apos;t decide between two providers? See how they stack up
                side by side on pricing, medications, and support — and which one we&apos;d pick.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {comparisons.map(({ battle, p1, p2, winner }) => (
                <Link
                  key={battle.slug}
                  href={`/${battle.slug}`}
                  className="group flex flex-col rounded-xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md"
                >
                  {/* Logos + VS */}
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <div className="flex h-[36px] flex-1 items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p1.logo}
                        alt={`${p1.name} logo`}
                        className="max-h-full max-w-[110px] object-contain"
                      />
                    </div>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-[#0C4B75]/20 bg-white text-[11px] font-extrabold text-[#0C4B75]">
                      VS
                    </span>
                    <div className="flex h-[36px] flex-1 items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p2.logo}
                        alt={`${p2.name} logo`}
                        className="max-h-full max-w-[110px] object-contain"
                      />
                    </div>
                  </div>

                  <h3 className="text-center text-[16px] font-bold leading-snug text-[#191919] group-hover:text-[#0C4B75] transition-colors">
                    {p1.name} vs {p2.name}
                  </h3>

                  <p className="mt-2 flex-1 text-center text-[13px] leading-relaxed text-gray-500 line-clamp-2">
                    {battle.subtitle || battle.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                    {winner ? (
                      <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                        <Trophy className="h-3 w-3" strokeWidth={2.5} />
                        Winner: {winner.name}
                      </span>
                    ) : (
                      <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-500">
                        Close call
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#0C4B75]">
                      Compare
                      <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
