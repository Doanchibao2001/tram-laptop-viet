import type { Metadata } from "next";
import { NewsFooter, NewsHeader } from "./NewsChrome";
import { newsArticles, type NewsArticle } from "./news-data";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://tramlaptopviet.vn";

export function createArticleMetadata(article: NewsArticle): Metadata {
  return {
    title: article.title,
    description: article.description,
    keywords: article.keywords,
    alternates: { canonical: `/tin-tuc/${article.slug}` },
    openGraph: {
      type: "article",
      locale: "vi_VN",
      url: `/tin-tuc/${article.slug}`,
      title: article.title,
      description: article.description,
      publishedTime: `${article.publishedAt}T08:00:00+07:00`,
      modifiedTime: `${article.updatedAt}T08:00:00+07:00`,
      authors: ["Trạm Laptop Việt"],
      images: [{ url: article.image, alt: article.imageAlt }],
    },
    twitter: { card: "summary_large_image", title: article.title, description: article.description, images: [article.image] },
  };
}

export function NewsArticlePage({ article }: { article: NewsArticle }) {
  const articleUrl = `${siteUrl}/tin-tuc/${article.slug}`;
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${articleUrl}#article`,
    headline: article.title,
    description: article.description,
    image: `${siteUrl}${article.image}`,
    datePublished: `${article.publishedAt}T08:00:00+07:00`,
    dateModified: `${article.updatedAt}T08:00:00+07:00`,
    inLanguage: "vi-VN",
    isAccessibleForFree: true,
    mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
    author: { "@type": "Organization", name: "Trạm Laptop Việt", url: siteUrl },
    publisher: { "@type": "Organization", name: "Trạm Laptop Việt", url: siteUrl, logo: { "@type": "ImageObject", url: `${siteUrl}/tram-laptop-viet/logo-round.jpg` } },
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Trang chủ", item: `${siteUrl}/` },
      { "@type": "ListItem", position: 2, name: "Tin tức", item: `${siteUrl}/tin-tuc` },
      { "@type": "ListItem", position: 3, name: article.title, item: articleUrl },
    ],
  };
  const relatedArticles = newsArticles.filter((item) => item.slug !== article.slug).slice(0, 2);

  return (
    <main className="news-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c") }} />
      <NewsHeader />
      <div className="container article-breadcrumb"><a href="/">Trang chủ</a><span>›</span><a href="/tin-tuc">Tin tức</a><span>›</span><span>{article.category}</span></div>
      <article className="container article-shell">
        <header className="article-heading"><span>{article.category}</span><h1>{article.title}</h1><p>{article.description}</p><div><time dateTime={article.publishedAt}>{article.publishedLabel}</time><b>·</b><span>{article.readTime}</span><b>·</b><span>Biên tập: Trạm Laptop Việt</span></div></header>
        <img className="article-cover" src={article.image} alt={article.imageAlt} />
        <div className="article-layout">
          <div className="article-content">
            {article.sections.map((section) => <section id={section.id} key={section.id}><h2>{section.heading}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{section.bullets && <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}</section>)}
            <aside className="article-cta"><h2>Cần kiểm tra laptop?</h2><p>Trạm Laptop Việt kiểm tra đúng lỗi và báo giá trước khi sửa.</p><div><a href="tel:0343323865">Gọi 0343.323.865</a><a href="https://zalo.me/0343323865" target="_blank" rel="noreferrer">Chat Zalo</a></div></aside>
          </div>
          <aside className="article-index"><strong>Mục lục bài viết</strong><ol>{article.sections.map((section) => <li key={section.id}><a href={`#${section.id}`}>{section.heading}</a></li>)}</ol></aside>
        </div>
      </article>
      <section className="related-news"><div className="container"><div className="section-heading"><span>ĐỌC THÊM</span><h2>Bài viết liên quan</h2></div><div className="news-grid">{relatedArticles.map((item) => <article className="news-card" key={item.slug}><a className="news-card-image" href={`/tin-tuc/${item.slug}`}><img src={item.image} alt={item.imageAlt} /></a><div><span>{item.category}</span><h3><a href={`/tin-tuc/${item.slug}`}>{item.title}</a></h3><p>{item.description}</p><a className="news-read-more" href={`/tin-tuc/${item.slug}`}>Đọc bài viết →</a></div></article>)}</div></div></section>
      <NewsFooter />
    </main>
  );
}
