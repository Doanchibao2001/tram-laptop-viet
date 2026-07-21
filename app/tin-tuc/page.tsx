import type { Metadata } from "next";
import Link from "next/link";
import { getNewsArticles, getSiteSettings } from "@/sanity/lib/content";
import { NewsFooter, NewsHeader } from "./NewsChrome";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://tramlaptopviet.vn";

export const metadata: Metadata = {
  title: "Tin tức sửa chữa và chăm sóc laptop",
  description: "Kiến thức sửa chữa, nâng cấp và chăm sóc laptop, MacBook từ kỹ thuật viên Trạm Laptop Việt.",
  alternates: { canonical: "/tin-tuc" },
  openGraph: { type: "website", locale: "vi_VN", url: "/tin-tuc", title: "Tin tức laptop | Trạm Laptop Việt", description: "Hướng dẫn sử dụng, sửa chữa và nâng cấp laptop hữu ích.", images: [{ url: "/tram-laptop-viet/brand-banner.jpg", alt: "Tin tức Trạm Laptop Việt" }] },
};

export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const [newsArticles, siteSettings] = await Promise.all([
    getNewsArticles(),
    getSiteSettings(),
  ]);
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Tin tức Trạm Laptop Việt",
    url: `${siteUrl}/tin-tuc`,
    inLanguage: "vi-VN",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: newsArticles.map((article, index) => ({ "@type": "ListItem", position: index + 1, url: `${siteUrl}/tin-tuc/${article.slug}`, name: article.title })),
    },
  };
  return (
    <main className="news-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema).replace(/</g, "\\u003c") }} />
      <NewsHeader siteSettings={siteSettings} />
      <section className="news-listing-hero"><div className="container"><span>KIẾN THỨC TỪ KỸ THUẬT VIÊN</span><h1>Tin tức & kinh nghiệm laptop</h1><p>Hướng dẫn dễ hiểu để sử dụng, chăm sóc, sửa chữa và nâng cấp laptop đúng cách.</p></div></section>
      <section className="section"><div className="container"><div className="news-grid news-listing-grid">{newsArticles.map((article) => <article className="news-card" key={article.slug}><Link className="news-card-image" href={`/tin-tuc/${article.slug}`}><img src={article.image} alt={article.imageAlt} /></Link><div><span>{article.category}</span><h2><Link href={`/tin-tuc/${article.slug}`}>{article.title}</Link></h2><p>{article.description}</p><div className="news-meta"><time dateTime={article.publishedAt}>{article.publishedLabel}</time><span>·</span><span>{article.readTime}</span></div><Link className="news-read-more" href={`/tin-tuc/${article.slug}`}>Đọc bài viết →</Link></div></article>)}</div></div></section>
      <NewsFooter siteSettings={siteSettings} />
    </main>
  );
}
