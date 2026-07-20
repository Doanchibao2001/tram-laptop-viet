import { getNewsArticles } from "@/sanity/lib/content";

export const revalidate = 300;

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://tramlaptopviet.vn"
).replace(/\/+$/, "");

export async function GET() {
  const articles = (await getNewsArticles()).filter((article) => !article.seoNoIndex);
  const articleLinks = articles
    .map((article) => `- [${article.title}](${siteUrl}/tin-tuc/${article.slug}): ${article.description}`)
    .join("\n");

  const body = `# Trạm Laptop Việt

> Dịch vụ kiểm tra, sửa chữa, nâng cấp và bảo hành laptop, MacBook tại TP.HCM. Trạm Laptop Việt báo đúng lỗi, báo giá trước khi sửa và không tự ý thay linh kiện.

## Trang chính

- [Trang chủ](${siteUrl}/)
- [Tin tức và kinh nghiệm laptop](${siteUrl}/tin-tuc)
- [Sơ đồ website](${siteUrl}/sitemap.xml)

## Bài viết

${articleLinks || "Chưa có bài viết được xuất bản."}
`;

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, s-maxage=300, stale-while-revalidate=86400",
    },
  });
}
