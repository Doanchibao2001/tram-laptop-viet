import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getNewsArticlesPage, getSiteSettings } from "@/sanity/lib/content";
import { siteUrl } from "@/lib/site-url";
import { NewsFooter, NewsHeader } from "./NewsChrome";

export const dynamic = "force-dynamic";

type NewsPageProps = {
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({ searchParams }: NewsPageProps): Promise<Metadata> {
  const params = await searchParams;
  const page = Math.max(Number.parseInt(params.page ?? "1", 10) || 1, 1);
  const pageSuffix = page > 1 ? ` – Trang ${page}` : "";
  const canonical = page > 1 ? `/tin-tuc?page=${page}` : "/tin-tuc";
  return {
    title: `Tin tức sửa chữa và chăm sóc laptop${pageSuffix}`,
    description: "Kiến thức sửa chữa, nâng cấp và chăm sóc laptop, MacBook từ kỹ thuật viên Trạm Laptop Việt.",
    alternates: { canonical },
    openGraph: { type: "website", locale: "vi_VN", url: canonical, title: `Tin tức laptop${pageSuffix} | Trạm Laptop Việt`, description: "Hướng dẫn sử dụng, sửa chữa và nâng cấp laptop hữu ích.", images: [{ url: "/tram-laptop-viet/brand-banner.jpg", alt: "Tin tức Trạm Laptop Việt" }] },
  };
}

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const params = await searchParams;
  const requestedPage = Number.parseInt(params.page ?? "1", 10);
  const [newsPage, siteSettings] = await Promise.all([
    getNewsArticlesPage(Number.isFinite(requestedPage) ? requestedPage : 1, 12),
    getSiteSettings(),
  ]);
  const newsArticles = newsPage.articles;
  const indexableArticles = newsArticles.filter((article) => !article.seoNoIndex);
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Tin tức Trạm Laptop Việt",
    url: newsPage.page > 1 ? `${siteUrl}/tin-tuc?page=${newsPage.page}` : `${siteUrl}/tin-tuc`,
    inLanguage: "vi-VN",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: indexableArticles.map((article, index) => ({ "@type": "ListItem", position: (newsPage.page - 1) * newsPage.pageSize + index + 1, url: `${siteUrl}/tin-tuc/${article.slug}`, name: article.title })),
    },
  };
  return (
    <main className="news-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema).replace(/</g, "\\u003c") }} />
      <NewsHeader siteSettings={siteSettings} />
      <section className="news-listing-hero"><div className="container"><span>KIẾN THỨC TỪ KỸ THUẬT VIÊN</span><h1>Tin tức & kinh nghiệm laptop</h1><p>Hướng dẫn dễ hiểu để sử dụng, chăm sóc, sửa chữa và nâng cấp laptop đúng cách.</p></div></section>
      <section className="section"><div className="container"><div className="news-grid news-listing-grid">{indexableArticles.map((article) => <article className="news-card" key={article.slug}><Link className="news-card-image" href={`/tin-tuc/${article.slug}`}><Image src={article.image} alt={article.imageAlt} width={800} height={450} sizes="(max-width: 700px) 100vw, 33vw" /></Link><div><span>{article.category}</span><h2><Link href={`/tin-tuc/${article.slug}`}>{article.title}</Link></h2><p>{article.description}</p><div className="news-meta"><time dateTime={article.publishedAt}>{article.publishedLabel}</time><span>·</span><span>{article.readTime}</span></div><Link className="news-read-more" href={`/tin-tuc/${article.slug}`}>Đọc bài viết →</Link></div></article>)}</div>{newsPage.totalPages > 1 && <nav className="news-pagination" aria-label="Phân trang tin tức"><Link className={newsPage.page <= 1 ? "is-disabled" : ""} href={newsPage.page > 2 ? `/tin-tuc?page=${newsPage.page - 1}` : "/tin-tuc"} aria-disabled={newsPage.page <= 1}>← Bài mới hơn</Link><span>Trang {newsPage.page}/{newsPage.totalPages}</span><Link className={newsPage.page >= newsPage.totalPages ? "is-disabled" : ""} href={`/tin-tuc?page=${newsPage.page + 1}`} aria-disabled={newsPage.page >= newsPage.totalPages}>Bài cũ hơn →</Link></nav>}</div></section>
      <NewsFooter siteSettings={siteSettings} />
    </main>
  );
}
