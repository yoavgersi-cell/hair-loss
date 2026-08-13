import type { MetadataRoute } from "next";
import { getConfig } from "@/lib/config-store";
import { CONTENT_LAST_UPDATED } from "@/lib/config";
import { articles } from "@/data/articles";

const BASE_URL = "https://www.tophairloss.io";
const FALLBACK_DATE = new Date(CONTENT_LAST_UPDATED);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const config = await getConfig();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: FALLBACK_DATE,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/men`,
      lastModified: FALLBACK_DATE,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/women`,
      lastModified: FALLBACK_DATE,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/reviews`,
      lastModified: FALLBACK_DATE,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/find-your-match`,
      lastModified: FALLBACK_DATE,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/how-we-rank`,
      lastModified: FALLBACK_DATE,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: FALLBACK_DATE,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/disclaimer`,
      lastModified: FALLBACK_DATE,
      changeFrequency: "monthly",
      priority: 0.2,
    },
  ];

  const reviewPages: MetadataRoute.Sitemap = (config.reviews ?? []).map(
    (review) => ({
      url: `${BASE_URL}/reviews/${review.slug}`,
      lastModified: review.updatedAt ? new Date(review.updatedAt) : FALLBACK_DATE,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })
  );

  const articlePages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/articles`,
      lastModified: FALLBACK_DATE,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...articles.map((article) => ({
      url: `${BASE_URL}/articles/${article.slug}`,
      lastModified: new Date(article.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];

  const battlePages: MetadataRoute.Sitemap = (config.battles ?? []).map(
    (battle) => ({
      url: `${BASE_URL}/${battle.slug}`,
      lastModified: battle.updatedAt ? new Date(battle.updatedAt) : FALLBACK_DATE,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })
  );

  const landingPageEntries: MetadataRoute.Sitemap = (config.landingPages ?? []).map(
    (lp) => ({
      url: `${BASE_URL}/${lp.slug}`,
      lastModified: lp.updatedAt ? new Date(lp.updatedAt) : FALLBACK_DATE,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })
  );

  return [...staticPages, ...reviewPages, ...articlePages, ...battlePages, ...landingPageEntries];
}
