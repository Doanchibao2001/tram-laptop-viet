import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("protects analytics before rendering and never serves a password form", async () => {
  const [proxy, dashboard] = await Promise.all([
    read("proxy.ts"),
    read("app/bao-cao-web/page.tsx"),
  ]);

  assert.match(proxy, /matcher:\s*\["\/bao-cao-web\/:path\*"\]/);
  assert.match(proxy, /status:\s*401/);
  assert.match(proxy, /WWW-Authenticate/);
  assert.match(proxy, /X-Robots-Tag/);
  assert.match(proxy, /noindex, nofollow, noarchive, nosnippet/);
  assert.match(proxy, /Cache-Control/);
  assert.doesNotMatch(dashboard, /type="password"|Mật khẩu báo cáo|\/api\/analytics\/login/);

  await assert.rejects(access(new URL("app/api/analytics/login/route.ts", root)));
});

test("publishes one canonical host and excludes private routes from crawling", async () => {
  const [siteUrl, robots, sitemap, layout] = await Promise.all([
    read("lib/site-url.ts"),
    read("app/robots.ts"),
    read("app/sitemap.ts"),
    read("app/layout.tsx"),
  ]);

  assert.match(siteUrl, /https:\/\/www\.tramlaptopviet\.vn/);
  assert.match(robots, /"\/bao-cao-web"/);
  assert.match(robots, /"\/api\/analytics"/);
  assert.match(robots, /sitemap:\s*`\$\{siteUrl\}\/sitemap\.xml`/);
  assert.match(sitemap, /filter\(\(article\) => !article\.seoNoIndex\)/);
  assert.match(sitemap, /`\$\{siteUrl\}\/tin-tuc\/\$\{article\.slug\}`/);
  assert.match(layout, /metadataBase:\s*new URL\(siteUrl\)/);
  assert.match(layout, /alternates:\s*\{ canonical:\s*"\/" \}/);
  assert.match(layout, /"max-image-preview":\s*"large"/);
});

test("news pages define unique canonicals and structured data", async () => {
  const [listing, article] = await Promise.all([
    read("app/tin-tuc/page.tsx"),
    read("app/tin-tuc/NewsArticlePage.tsx"),
  ]);

  assert.match(listing, /alternates:\s*\{ canonical:\s*"\/tin-tuc" \}/);
  assert.match(listing, /"@type":\s*"CollectionPage"/);
  assert.match(article, /canonical:\s*`\/tin-tuc\/\$\{article\.slug\}`/);
  assert.match(article, /"@type":\s*"BlogPosting"/);
  assert.match(article, /"@type":\s*"BreadcrumbList"/);
});

test("prioritizes and responsively sizes the homepage LCP image", async () => {
  const [homepage, nextConfig] = await Promise.all([
    read("app/HomeClient.tsx"),
    read("next.config.ts"),
  ]);

  assert.match(homepage, /<Image[\s\S]*className="hero-photo"[\s\S]*priority[\s\S]*sizes="\(max-width: 700px\) 100vw, 59vw"/);
  assert.match(nextConfig, /hostname:\s*"cdn\.sanity\.io"/);
  assert.match(nextConfig, /pathname:\s*"\/images\/qnykgwoz\/production\/\*\*"/);
});
