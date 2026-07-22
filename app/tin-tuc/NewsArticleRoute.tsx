import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getNewsArticleBySlug,
  getRelatedNewsArticles,
  getSiteSettings,
} from "@/sanity/lib/content";
import { createArticleMetadata, NewsArticlePage } from "./NewsArticlePage";

export async function metadataForArticle(slug: string): Promise<Metadata> {
  const article = await getNewsArticleBySlug(slug);
  return article ? createArticleMetadata(article) : {};
}

export async function renderArticle(slug: string) {
  const [article, relatedArticles, siteSettings] = await Promise.all([
    getNewsArticleBySlug(slug),
    getRelatedNewsArticles(slug),
    getSiteSettings(),
  ]);

  if (!article) notFound();

  return (
    <NewsArticlePage
      article={article}
      relatedArticles={relatedArticles}
      siteSettings={siteSettings}
    />
  );
}
