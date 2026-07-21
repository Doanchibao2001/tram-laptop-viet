import type { MetadataRoute } from "next";
import { getNewsArticles } from "@/sanity/lib/content";
import { siteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

function validDate(value: string): Date | undefined {
  const parsed = new Date(`${value}T08:00:00+07:00`);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const newsArticles = await getNewsArticles();
  const indexableArticles = newsArticles.filter((article) => !article.seoNoIndex);
  const newestArticleDate = indexableArticles
    .map((article) => validDate(article.updatedAt))
    .filter((date): date is Date => Boolean(date))
    .sort((a, b) => b.getTime() - a.getTime())[0];

  return [
    {
      url: `${siteUrl}/`,
      ...(newestArticleDate ? { lastModified: newestArticleDate } : {}),
    },
    {
      url: `${siteUrl}/tin-tuc`,
      ...(newestArticleDate ? { lastModified: newestArticleDate } : {}),
    },
    ...indexableArticles.map((article) => ({
      url: `${siteUrl}/tin-tuc/${article.slug}`,
      ...(validDate(article.updatedAt)
        ? { lastModified: validDate(article.updatedAt) }
        : {}),
    })),
  ];
}
