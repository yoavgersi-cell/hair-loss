import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProviderCta } from "./provider-cta";
import type { SidebarConfigData, Provider, ArticleData } from "@/lib/config";

interface ContentSidebarProps {
  config: SidebarConfigData;
  providers: Provider[];
  articles: ArticleData[];
  pageType: "listing" | "review" | "battle" | "quiz_results";
  sourceFlow: "main_comparison" | "provider_review" | "battle_page" | "matching_flow";
}

export function ContentSidebar({ config, providers, articles, pageType, sourceFlow }: ContentSidebarProps) {
  if (!config.active) return null;

  const sortedBlocks = config.blocks.filter((b) => b.enabled);
  const selectedProviders = config.providerIds
    .map((id) => providers.find((p) => p.id === id))
    .filter(Boolean) as Provider[];
  const selectedArticles = config.articleSlugs
    .map((slug) => articles.find((a) => a.slug === slug))
    .filter(Boolean) as ArticleData[];

  return (
    <>
      {/* Desktop sticky sidebar */}
      <aside className="hidden lg:block w-[340px] shrink-0">
        <div className="sticky top-6 space-y-5">
          {sortedBlocks.map((block, i) => {
            if (block.type === "providers" && selectedProviders.length > 0) {
              return (
                <div key={i} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <h3 className="mb-4 text-[13px] font-bold uppercase tracking-wider text-gray-400">
                    Top Providers
                  </h3>
                  <div className="space-y-4">
                    {selectedProviders.map((provider, pi) => (
                      <div key={provider.id} className="flex items-center gap-3">
                        <div className="flex h-[32px] w-[100px] shrink-0 items-center">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={provider.logo}
                            alt={provider.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <div className="flex-1" />
                        <ProviderCta
                          href={provider.affiliateUrl}
                          providerName={provider.name}
                          providerSlug={provider.id}
                          position={pi + 1}
                          pageType={pageType}
                          sourceFlow={sourceFlow}
                          className="shrink-0 rounded-lg bg-[#0C4B75] px-3 py-1.5 text-[12px] font-bold text-white transition-colors hover:bg-[#093d61]"
                        >
                          Visit
                        </ProviderCta>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            if (block.type === "quizCta") {
              return (
                <div key={i} className="rounded-xl border border-[#0C4B75]/15 bg-[#0C4B75]/[0.03] p-5">
                  <h3 className="text-[15px] font-bold text-[#191919]">
                    {config.quizCta.headline}
                  </h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-gray-500">
                    {config.quizCta.description}
                  </p>
                  <Link
                    href={config.quizCta.ctaUrl}
                    className="mt-4 flex h-[40px] w-full items-center justify-center gap-1.5 rounded-lg bg-[#0C4B75] text-[13px] font-bold text-white transition-colors hover:bg-[#093d61]"
                  >
                    {config.quizCta.ctaText}
                    <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </Link>
                </div>
              );
            }

            if (block.type === "relatedArticles" && selectedArticles.length > 0) {
              return (
                <div key={i} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <h3 className="mb-3 text-[13px] font-bold uppercase tracking-wider text-gray-400">
                    Related Articles
                  </h3>
                  <div className="space-y-3">
                    {selectedArticles.map((article) => (
                      <Link
                        key={article.slug}
                        href={`/articles/${article.slug}`}
                        className="group block"
                      >
                        <p className="text-[13px] font-semibold leading-snug text-[#191919] group-hover:text-[#0C4B75] transition-colors">
                          {article.title}
                        </p>
                        {article.category && (
                          <span className="mt-0.5 inline-block text-[11px] text-gray-400">
                            {article.category}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            }

            return null;
          })}
        </div>
      </aside>

      {/* Mobile inline blocks — rendered at end of content */}
      <div className="lg:hidden mt-10 space-y-6">
        {sortedBlocks.map((block, i) => {
          if (block.type === "quizCta") {
            return (
              <div key={i} className="rounded-xl border border-[#0C4B75]/15 bg-[#0C4B75]/[0.03] p-5 text-center">
                <h3 className="text-[16px] font-bold text-[#191919]">
                  {config.quizCta.headline}
                </h3>
                <p className="mt-1.5 text-[14px] text-gray-500">
                  {config.quizCta.description}
                </p>
                <Link
                  href={config.quizCta.ctaUrl}
                  className="mt-4 inline-flex h-[44px] items-center justify-center gap-1.5 rounded-lg bg-[#0C4B75] px-6 text-[14px] font-bold text-white"
                >
                  {config.quizCta.ctaText}
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
                </Link>
              </div>
            );
          }

          if (block.type === "providers" && selectedProviders.length > 0) {
            return (
              <div key={i} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <h3 className="mb-4 text-[13px] font-bold uppercase tracking-wider text-gray-400">Top Providers</h3>
                <div className="space-y-3">
                  {selectedProviders.map((provider, pi) => (
                    <div key={provider.id} className="flex items-center gap-3">
                      <div className="flex h-[28px] w-[90px] shrink-0 items-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={provider.logo} alt={provider.name} className="max-h-full max-w-full object-contain" />
                      </div>
                      <div className="flex-1" />
                      <ProviderCta
                        href={provider.affiliateUrl}
                        providerName={provider.name}
                        providerSlug={provider.id}
                        position={pi + 1}
                        pageType={pageType}
                        sourceFlow={sourceFlow}
                        className="shrink-0 rounded-lg bg-[#0C4B75] px-3 py-1.5 text-[12px] font-bold text-white"
                      >
                        Visit
                      </ProviderCta>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          return null;
        })}
      </div>
    </>
  );
}
