import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getNewsArticleBySlug,
  getNewsArticles,
  getSiteSettings,
} from "@/sanity/lib/content";
import { createArticleMetadata, NewsArticlePage } from "./NewsArticlePage";

export async function metadataForArticle(slug: string): Promise<Metadata> {
  const article = await getNewsArticleBySlug(slug);
  return article ? createArticleMetadata(article) : {};
}

export async function renderArticle(slug: string) {
  const [article, articles, siteSettings] = await Promise.all([
    getNewsArticleBySlug(slug),
    getNewsArticles(),
    getSiteSettings(),
  ]);

  if (!article) notFound();

  const relatedArticles = articles
    .filter((item) => item.slug !== article.slug)
    .slice(0, 2);

  return (
    <NewsArticlePage
      article={article}
      relatedArticles={relatedArticles}
      siteSettings={siteSettings}
    />
  );
}
