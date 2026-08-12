import type { Metadata } from "next";
import Link from "next/link";
import { Clock, ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { getConfig } from "@/lib/config-store";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ExpertByline } from "@/components/expert-byline";
import { notFound, permanentRedirect } from "next/navigation";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const config = await getConfig();
  const article = (config.articles ?? []).find((a) => a.slug === slug);
  if (!article) return { title: "Article Not Found" };

  return {
    title: article.title,
    description: article.description,
    alternates: {
      canonical: `https://www.tophairloss.io/articles/${slug}`,
    },
    openGraph: {
      title: article.title,
      description: article.description,
      url: `https://www.tophairloss.io/articles/${slug}`,
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [article.author || "tophairloss.io"],
    },
  };
}

const categoryColors: Record<string, string> = {
  Science: "bg-blue-50 text-blue-700",
  Guide: "bg-emerald-50 text-emerald-700",
  Advice: "bg-amber-50 text-amber-700",
  Wellness: "bg-purple-50 text-purple-700",
};

function slugifyHeading(heading: string): string {
  return heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const config = await getConfig();
  const articles = config.articles ?? [];
  const experts = config.experts ?? [];

  // Head-to-head provider comparisons are canonical at the root battle URL.
  // If a battle owns this slug, consolidate /articles/<slug> → /<slug> (301/308)
  // so a duplicate or stale /articles/ URL doesn't compete with the battle page.
  if ((config.battles ?? []).some((b) => b.slug === slug)) {
    permanentRedirect(`/${slug}`);
  }

  const article = articles.find((a) => a.slug === slug);
  if (!article) return notFound();

  const currentIndex = articles.findIndex((a) => a.slug === slug);
  const nextArticle = articles[currentIndex + 1] || null;
  const prevArticle = currentIndex > 0 ? articles[currentIndex - 1] : null;

  // Byline author: match the article's author to a team member, else the lead
  const author = experts.find((e) => e.name === article.author) ?? experts[0];

  // Top providers for inline CTA
  const { providerOrder, positions } = config.ranking;
  const topProviders = providerOrder
    .map((id, index) => {
      const provider = config.providers.find((p) => p.id === id);
      if (!provider) return null;
      const position = positions[index] || positions[positions.length - 1];
      return { ...provider, rating: position.score, tagline: provider.tagline };
    })
    .filter(Boolean) as Array<{ id: string; name: string; logo: string; tagline: string; affiliateUrl: string; rating: number }>;

  // Related articles: same category first, then others, exclude self, max 3
  const relatedArticles = [
    ...articles.filter(
      (a) => a.slug !== slug && a.category === article.category
    ),
    ...articles.filter(
      (a) => a.slug !== slug && a.category !== article.category
    ),
  ].slice(0, 3);

  const formattedDate = new Date(article.updatedAt).toLocaleDateString(
    "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  );

  // Word count for schema
  const wordCount = article.sections.reduce(
    (sum, s) =>
      sum + s.body.replace(/<[^>]*>/g, "").split(/\s+/).length,
    0
  );

  // JSON-LD Article schema (enhanced)
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    image: `https://www.tophairloss.io/articles/${slug}/opengraph-image`,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    wordCount,
    articleSection: article.category,
    author: author
      ? {
          "@type": "Person",
          name: author.credentials ? `${author.name}, ${author.credentials}` : author.name,
          jobTitle: author.role,
          url: "https://www.tophairloss.io/about",
        }
      : {
          "@type": "Organization",
          name: article.author || "tophairloss.io",
          url: "https://www.tophairloss.io",
        },
    publisher: {
      "@type": "Organization",
      name: "tophairloss.io",
      url: "https://www.tophairloss.io",
      logo: {
        "@type": "ImageObject",
        url: "https://www.tophairloss.io/favicon.svg",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.tophairloss.io/articles/${slug}`,
    },
    keywords: [
      "hair loss",
      "finasteride",
      "minoxidil",
      "hair loss treatment",
      article.category.toLowerCase(),
      ...article.sections.map((s) => s.heading),
    ],
  };

  // JSON-LD Breadcrumb
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.tophairloss.io",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Articles",
        item: "https://www.tophairloss.io/articles",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: `https://www.tophairloss.io/articles/${slug}`,
      },
    ],
  };

  // FAQ schema from sections (each heading = question, body = answer)
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: article.sections.map((s) => ({
      "@type": "Question",
      name: s.heading,
      acceptedAnswer: {
        "@type": "Answer",
        text: s.body.replace(/<[^>]*>/g, ""),
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="min-h-screen bg-gray-50">
        {/* Hero band */}
        <div
          className="w-full"
          style={{ backgroundColor: article.heroColor }}
        >
          <div className="mx-auto max-w-[1100px] px-4 py-10 sm:px-6 sm:py-14">
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Articles", href: "/articles" },
                { label: article.title },
              ]}
            />

            <div className="flex items-center gap-3 mb-4">
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

            <h1 className="text-[24px] font-bold leading-tight text-[#191919] sm:text-[32px]">
              {article.title}
            </h1>
            <p className="mt-3 text-[15px] leading-relaxed text-gray-500">
              {article.description}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
              {author ? (
                <ExpertByline expert={author} label="Written by" />
              ) : (
                article.author && <span className="text-[12px] text-gray-500">By {article.author}</span>
              )}
              <span className="text-[12px] text-gray-400">Updated {formattedDate}</span>
            </div>
          </div>
        </div>

        {/* Article body */}
        <div className="mx-auto max-w-[1100px] px-4 py-10 sm:px-6">
          <div>
          <article className="space-y-8">
            {article.sections.map((section, i) => (
              <div key={i}>
                <section id={slugifyHeading(section.heading)}>
                  <h2 className="mb-3 text-[20px] font-bold text-[#191919] scroll-mt-24">
                    {section.heading}
                  </h2>
                  <p
                    className="text-[16px] leading-[1.75] text-gray-600 [&_a]:text-[#0C4B75] [&_a]:font-medium [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-[#093d61]"
                    dangerouslySetInnerHTML={{ __html: section.body }}
                  />
                </section>

                {/* Editorial callout after 4th section */}
                {i === 3 && article.sections.length > 4 && (
                  <div className="my-10 rounded-xl border border-[#0C4B75]/10 bg-[#0C4B75]/[0.03] p-6 sm:p-8">
                    <h3 className="mb-3 text-[18px] font-bold leading-tight text-[#0C4B75] sm:text-[20px]">
                      What To Know Before Starting Treatment
                    </h3>
                    <p className="mb-3 text-[16px] leading-[1.75] text-gray-600">
                      Prescription treatments like finasteride require a consultation with a licensed clinician and aren&apos;t right for everyone — finasteride, in particular, is for men and isn&apos;t safe for women who are or may become pregnant. Some people experience side effects, so proper medical screening matters.
                    </p>
                    <p className="mb-3 text-[16px] leading-[1.75] text-gray-600">
                      Hair loss treatments also take time and consistency. Most people don&apos;t see visible results for 3–6 months, and the medications only keep working while you keep using them.
                    </p>
                    <p className="text-[16px] leading-[1.75] text-gray-600">
                      That&apos;s why choosing a provider that offers proper medical oversight and ongoing follow-up is essential for both safety and long-term results.
                    </p>
                  </div>
                )}

                {/* Inline provider CTA after 2nd section */}
                {i === 1 && topProviders.length > 0 && (
                  <div className="my-8 rounded-lg border border-gray-200 bg-white px-5 py-4">
                    <p className="mb-3 text-[13px] font-bold uppercase tracking-wider text-gray-400">Top-Rated Providers</p>
                    <div className="space-y-2.5">
                      {topProviders.slice(0, 3).map((tp) => (
                        <a
                          key={tp.id}
                          href={tp.affiliateUrl}
                          className="flex items-center justify-between rounded-lg border border-gray-100 bg-[#fafbfc] px-4 py-3 transition-colors hover:border-[#0C4B75]/20 hover:bg-[#0C4B75]/[0.02]"
                        >
                          <div className="flex items-center gap-3">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={tp.logo} alt={tp.name} className="h-[24px] w-[80px] object-contain object-left" />
                            <span className="text-[13px] text-gray-500">{tp.tagline}</span>
                          </div>
                          <ArrowUpRight className="h-4 w-4 shrink-0 text-[#0C4B75]" strokeWidth={1.5} />
                        </a>
                      ))}
                    </div>
                    <a href="/find-your-match" className="mt-3 block text-center text-[13px] font-semibold text-[#0C4B75] hover:underline">
                      Not sure? Take our free matching quiz →
                    </a>
                  </div>
                )}
              </div>
            ))}
          </article>

          {/* CTA box */}
          <div className="mt-12 rounded-xl border border-gray-200 bg-white p-6 text-center sm:p-8">
            <p className="text-[18px] font-bold text-[#191919]">
              Ready to compare hair loss providers?
            </p>
            <p className="mt-1 text-[14px] text-gray-500">
              See how top providers stack up on pricing, medical support, and
              treatment options.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/"
                className="inline-flex h-[44px] items-center justify-center rounded-lg bg-[#0C4B75] px-6 text-[14px] font-bold text-white transition-colors hover:bg-[#093d61]"
              >
                Compare Providers
              </Link>
              <Link
                href="/find-your-match"
                className="inline-flex h-[44px] items-center justify-center rounded-lg border border-gray-200 bg-white px-6 text-[14px] font-semibold text-[#191919] transition-colors hover:bg-gray-50"
              >
                Take the Quiz
              </Link>
            </div>
          </div>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <div className="mt-12">
              <h2 className="mb-5 text-[18px] font-bold text-[#191919]">
                Related Articles
              </h2>
              <div className="grid gap-4 sm:grid-cols-3">
                {relatedArticles.map((ra) => (
                  <Link
                    key={ra.slug}
                    href={`/articles/${ra.slug}`}
                    className="group rounded-xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md"
                  >
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold mb-2 ${categoryColors[ra.category] || "bg-gray-100 text-gray-600"}`}
                    >
                      {ra.category}
                    </span>
                    <p className="text-[14px] font-semibold leading-snug text-[#191919] group-hover:text-[#0C4B75] transition-colors">
                      {ra.title}
                    </p>
                    <p className="mt-1.5 text-[12px] text-gray-400 line-clamp-2">
                      {ra.description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Prev / Next navigation */}
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {prevArticle ? (
              <Link
                href={`/articles/${prevArticle.slug}`}
                className="group flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md"
              >
                <ArrowLeft className="mt-0.5 h-4 w-4 shrink-0 text-gray-400 group-hover:text-[#0C4B75] transition-colors" strokeWidth={2} />
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                    Previous
                  </span>
                  <p className="mt-0.5 text-[14px] font-semibold leading-snug text-[#191919] group-hover:text-[#0C4B75] transition-colors">
                    {prevArticle.title}
                  </p>
                </div>
              </Link>
            ) : (
              <div />
            )}
            {nextArticle && (
              <Link
                href={`/articles/${nextArticle.slug}`}
                className="group flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md sm:text-right sm:flex-row-reverse"
              >
                <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-gray-400 group-hover:text-[#0C4B75] transition-colors" strokeWidth={2} />
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                    Next
                  </span>
                  <p className="mt-0.5 text-[14px] font-semibold leading-snug text-[#191919] group-hover:text-[#0C4B75] transition-colors">
                    {nextArticle.title}
                  </p>
                </div>
              </Link>
            )}
          </div>

          </div>
        </div>
      </div>
    </>
  );
}
