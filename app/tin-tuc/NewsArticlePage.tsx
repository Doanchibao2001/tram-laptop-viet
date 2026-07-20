import type { Metadata } from "next";
import Link from "next/link";
import {
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents,
  type PortableTextMarkComponentProps,
  type PortableTextTypeComponentProps,
} from "next-sanity";
import type { ReactNode } from "react";
import { urlFor } from "@/sanity/lib/image";
import type { SiteSettings } from "@/sanity/types";
import { NewsFooter, NewsHeader } from "./NewsChrome";
import type { NewsArticle } from "./news-data";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://tramlaptopviet.vn";

type PortableImage = {
  _type: string;
  asset?: { _ref?: string; _id?: string };
  alt?: string;
  caption?: string;
};

type LinkMark = {
  _type: "link";
  href?: string;
  openInNewTab?: boolean;
};

function portableBlockText(block: PortableTextBlock): string {
  return Array.isArray(block.children)
    ? block.children
        .map((child) =>
          typeof child === "object" &&
          child !== null &&
          "text" in child &&
          typeof child.text === "string"
            ? child.text
            : "",
        )
        .join("")
    : "";
}

function isPortableImage(value: unknown): value is PortableImage {
  return typeof value === "object" && value !== null && "asset" in value;
}

function safeLinkHref(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const href = value.trim();
  if (!href) return undefined;
  if (
    href.startsWith("/") ||
    href.startsWith("#") ||
    href.startsWith("?") ||
    href.startsWith("./") ||
    href.startsWith("../")
  ) {
    return href.startsWith("//") ? undefined : href;
  }
  try {
    const url = new URL(href);
    return ["http:", "https:", "mailto:", "tel:"].includes(url.protocol)
      ? href
      : undefined;
  } catch {
    return undefined;
  }
}

function PortableImageFigure({
  value,
}: PortableTextTypeComponentProps<PortableImage>) {
  if (!isPortableImage(value) || !value.asset) return null;
  return (
    <figure>
      <img
        src={urlFor(value).width(1200).fit("max").auto("format").url()}
        alt={value.alt ?? ""}
        loading="lazy"
      />
      {value.caption && <figcaption>{value.caption}</figcaption>}
    </figure>
  );
}

function SafeLink({
  value,
  children,
}: PortableTextMarkComponentProps<LinkMark>) {
  const href = safeLinkHref(value?.href);
  if (!href) return <span>{children}</span>;
  const target = value?.openInNewTab ? "_blank" : undefined;
  return (
    <a
      href={href}
      target={target}
      rel={target ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  );
}

const portableTextComponents: PortableTextComponents = {
  block: {
    h2: ({ children, value }: { children?: ReactNode; value: PortableTextBlock }) => (
      <h2 id={`section-${value._key}`}>{children}</h2>
    ),
    h3: ({ children, value }: { children?: ReactNode; value: PortableTextBlock }) => (
      <h3 id={`section-${value._key}`}>{children}</h3>
    ),
  },
  types: {
    contentImage: PortableImageFigure,
    image: PortableImageFigure,
  },
  marks: {
    link: SafeLink,
  },
};

export function createArticleMetadata(article: NewsArticle): Metadata {
  const title = article.seoTitle ?? article.title;
  const description = article.seoDescription ?? article.description;
  const image = article.seoImage ?? article.image;
  const imageAlt = article.seoImageAlt ?? article.imageAlt;
  return {
    title,
    description,
    keywords: article.keywords,
    alternates: { canonical: `/tin-tuc/${article.slug}` },
    robots: article.seoNoIndex
      ? {
          index: false,
          follow: false,
          googleBot: { index: false, follow: false },
        }
      : undefined,
    openGraph: {
      type: "article",
      locale: "vi_VN",
      url: `/tin-tuc/${article.slug}`,
      title,
      description,
      publishedTime: `${article.publishedAt}T08:00:00+07:00`,
      modifiedTime: `${article.updatedAt}T08:00:00+07:00`,
      authors: [article.authorName ?? "Trạm Laptop Việt"],
      images: [{ url: image, alt: imageAlt }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export function NewsArticlePage({
  article,
  relatedArticles,
  siteSettings,
}: {
  article: NewsArticle;
  relatedArticles: NewsArticle[];
  siteSettings: SiteSettings;
}) {
  const articleUrl = `${siteUrl}/tin-tuc/${article.slug}`;
  const articleImage = article.image.startsWith("http")
    ? article.image
    : `${siteUrl}${article.image}`;
  const bodyHeadings = (article.body ?? [])
    .filter((block) => block.style === "h2" || block.style === "h3")
    .map((block) => ({
      id: `section-${block._key}`,
      heading: portableBlockText(block),
    }))
    .filter((item) => item.heading);
  const indexItems = bodyHeadings.length ? bodyHeadings : article.sections;
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${articleUrl}#article`,
    headline: article.title,
    description: article.seoDescription ?? article.description,
    image: articleImage,
    datePublished: `${article.publishedAt}T08:00:00+07:00`,
    dateModified: `${article.updatedAt}T08:00:00+07:00`,
    inLanguage: "vi-VN",
    isAccessibleForFree: true,
    mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
    author: { "@type": "Organization", name: article.authorName ?? "Trạm Laptop Việt", url: siteUrl },
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
  return (
    <main className="news-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c") }} />
      <NewsHeader siteSettings={siteSettings} />
      <div className="container article-breadcrumb"><Link href="/">Trang chủ</Link><span>›</span><Link href="/tin-tuc">Tin tức</Link><span>›</span><span>{article.category}</span></div>
      <article className="container article-shell">
        <header className="article-heading"><span>{article.category}</span><h1>{article.title}</h1><p>{article.description}</p><div><time dateTime={article.publishedAt}>{article.publishedLabel}</time><b>·</b><span>{article.readTime}</span><b>·</b><span>Biên tập: {article.authorName ?? "Trạm Laptop Việt"}</span></div></header>
        <img className="article-cover" src={article.image} alt={article.imageAlt} />
        <div className="article-layout">
          <div className="article-content">
            {article.body?.length ? (
              <PortableText value={article.body} components={portableTextComponents} />
            ) : (
              article.sections.map((section) => <section id={section.id} key={section.id}><h2>{section.heading}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{section.bullets && <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}</section>)
            )}
            <aside className="article-cta"><h2>Cần kiểm tra laptop?</h2><p>Trạm Laptop Việt kiểm tra đúng lỗi và báo giá trước khi sửa.</p><div><a href={`tel:${siteSettings.hotline}`}>Gọi {siteSettings.hotlineDisplay}</a><a href={siteSettings.zaloUrl} target="_blank" rel="noreferrer">Chat Zalo</a></div></aside>
          </div>
          <aside className="article-index"><strong>Mục lục bài viết</strong><ol>{indexItems.map((section) => <li key={section.id}><a href={`#${section.id}`}>{section.heading}</a></li>)}</ol></aside>
        </div>
      </article>
      <section className="related-news"><div className="container"><div className="section-heading"><span>ĐỌC THÊM</span><h2>Bài viết liên quan</h2></div><div className="news-grid">{relatedArticles.map((item) => <article className="news-card" key={item.slug}><Link className="news-card-image" href={`/tin-tuc/${item.slug}`}><img src={item.image} alt={item.imageAlt} /></Link><div><span>{item.category}</span><h3><Link href={`/tin-tuc/${item.slug}`}>{item.title}</Link></h3><p>{item.description}</p><Link className="news-read-more" href={`/tin-tuc/${item.slug}`}>Đọc bài viết →</Link></div></article>)}</div></div></section>
      <NewsFooter siteSettings={siteSettings} />
    </main>
  );
}
