const FACEBOOK_PAGE_URL =
  "https://www.facebook.com/profile.php?id=61591726413298";

const FACEBOOK_PLUGIN_URL =
  `https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(FACEBOOK_PAGE_URL)}` +
  "&tabs=timeline&width=500&height=720&small_header=false" +
  "&adapt_container_width=true&hide_cover=false&show_facepile=false";

const pageHtml = `<!doctype html>
<html lang="vi">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="robots" content="noindex,nofollow" />
    <title>Fanpage Trạm Laptop Việt</title>
    <style>
      :root {
        color-scheme: light;
        --brand: #c81020;
        --ink: #1f2937;
        --muted: #6b7280;
        --line: #e5e7eb;
        --surface: #ffffff;
        --background: #f5f6f8;
      }

      * { box-sizing: border-box; }

      html, body { margin: 0; min-height: 100%; }

      body {
        background: var(--background);
        color: var(--ink);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        padding: 18px 14px calc(28px + env(safe-area-inset-bottom));
      }

      main {
        width: min(100%, 560px);
        margin: 0 auto;
      }

      .header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 14px;
      }

      .header img {
        width: 50px;
        height: 50px;
        border-radius: 14px;
        object-fit: cover;
        box-shadow: 0 8px 20px rgba(31, 41, 55, .10);
      }

      .header strong,
      .header span {
        display: block;
      }

      .header strong {
        font-size: 17px;
        line-height: 1.25;
      }

      .header span {
        margin-top: 3px;
        color: var(--muted);
        font-size: 12px;
      }

      .card {
        overflow: hidden;
        border: 1px solid var(--line);
        border-radius: 18px;
        background: var(--surface);
        box-shadow: 0 16px 45px rgba(31, 41, 55, .10);
      }

      .notice {
        padding: 14px 16px;
        border-bottom: 1px solid var(--line);
        background: #fff7f8;
        color: #7f1d1d;
        font-size: 12px;
        line-height: 1.55;
      }

      .frame-wrap {
        display: grid;
        place-items: center;
        min-height: 620px;
        background: #fff;
      }

      iframe {
        display: block;
        width: 100%;
        max-width: 500px;
        height: 720px;
        border: 0;
        background: #fff;
      }

      .actions {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
        padding: 14px;
        border-top: 1px solid var(--line);
      }

      .actions a {
        display: flex;
        min-height: 46px;
        align-items: center;
        justify-content: center;
        padding: 10px 12px;
        border-radius: 12px;
        font-size: 13px;
        font-weight: 700;
        text-align: center;
        text-decoration: none;
      }

      .back {
        border: 1px solid var(--line);
        color: var(--ink);
      }

      .full {
        background: var(--brand);
        color: #fff;
      }

      .footnote {
        margin: 12px 4px 0;
        color: var(--muted);
        font-size: 11px;
        line-height: 1.5;
        text-align: center;
      }

      @media (max-width: 520px) {
        body { padding-inline: 0; padding-top: 0; }
        main { width: 100%; }
        .header { padding: 14px 16px 0; }
        .card { border-inline: 0; border-radius: 18px 18px 0 0; box-shadow: none; }
        .frame-wrap { min-height: 580px; }
        iframe { height: 680px; }
        .actions { grid-template-columns: 1fr; }
        .footnote { padding-inline: 16px; }
      }
    </style>
  </head>
  <body>
    <main>
      <header class="header">
        <img src="/tram-laptop-viet/logo-round.jpg" alt="Logo Trạm Laptop Việt" />
        <div>
          <strong>Fanpage Trạm Laptop Việt</strong>
          <span>Xem nội dung ngay trong trình duyệt</span>
        </div>
      </header>

      <section class="card">
        <div class="notice">
          Trang được hiển thị trực tiếp tại đây để tránh hộp thoại mở ứng dụng Facebook trên iPhone và Android.
        </div>

        <div class="frame-wrap">
          <iframe
            src="${FACEBOOK_PLUGIN_URL}"
            title="Fanpage Trạm Laptop Việt"
            width="500"
            height="720"
            loading="eager"
            scrolling="yes"
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          ></iframe>
        </div>

        <div class="actions">
          <a class="back" href="/">Quay lại website</a>
          <a class="full" href="${FACEBOOK_PAGE_URL}" target="_self" rel="noreferrer">Mở Facebook đầy đủ</a>
        </div>
      </section>

      <p class="footnote">
        Chỉ nút “Mở Facebook đầy đủ” mới có thể gọi ứng dụng Facebook theo cài đặt của thiết bị.
      </p>
    </main>
  </body>
</html>`;

export function GET() {
  return new Response(pageHtml, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
