import type { MetadataRoute } from "next";
import { getNewsArticles } from "@/sanity/lib/content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://tramlaptopviet.vn";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const newsArticles = await getNewsArticles();
  return [
    {
      url: `${siteUrl}/`,
      lastModified: new Date("2026-07-19T00:00:00+07:00"),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/tin-tuc`,
      lastModified: new Date("2026-07-19T00:00:00+07:00"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...newsArticles.filter((article) => !article.seoNoIndex).map((article) => ({
      url: `${siteUrl}/tin-tuc/${article.slug}`,
      lastModified: new Date(`${article.updatedAt}T08:00:00+07:00`),
      changeFrequency: "monthly" as const,
      priority: 0.7,
      images: [
        article.image.startsWith("http")
          ? article.image
          : `${siteUrl}${article.image}`,
      ],
    })),
  ];
}
